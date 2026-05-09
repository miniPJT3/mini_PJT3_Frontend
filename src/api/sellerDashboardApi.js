const API_BASE_URL = '/api/dashboard';

// 프론트 화면만 먼저 테스트하려면 true
// 백엔드 연동 테스트할 때 false로 변경
const USE_MOCK = true;

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const copied = new Date(date);
  copied.setDate(copied.getDate() + days);
  return copied;
}

function getTodayString() {
  return formatDate(new Date());
}

const productPool = [
  { name: '무선 이어폰', price: 92000 },
  { name: 'USB-C 충전기', price: 30000 },
  { name: '노트북 거치대', price: 76000 },
  { name: '보조배터리', price: 52000 },
  { name: '케이블 세트', price: 25000 },
  { name: '블루투스 키보드', price: 68000 },
  { name: '마우스 패드', price: 18000 },
];

function generateMockPayments() {
  const today = new Date();
  const payments = [];

  for (let dayOffset = 0; dayOffset < 35; dayOffset++) {
    const date = formatDate(addDays(today, -dayOffset));
    const orderCount = (dayOffset % 4) + 1;

    for (let i = 0; i < orderCount; i++) {
      const product = productPool[(dayOffset + i) % productPool.length];

      payments.push({
        sellerId: 1,
        paidDate: date,
        productName: product.name,
        totalAmount: product.price,
        customerId: (dayOffset + i) % 11 + 1,
        status: 'PAID',
      });
    }
  }

  return payments;
}

const mockPayments = generateMockPayments();

function filterPaymentsByDateRange(sellerId, startDate, endDate) {
  return mockPayments.filter((payment) => {
    return (
      payment.sellerId === Number(sellerId) &&
      payment.status === 'PAID' &&
      payment.paidDate >= startDate &&
      payment.paidDate <= endDate
    );
  });
}

function buildDailySales(payments, startDate, endDate) {
  const dailyMap = new Map();

  let cursor = new Date(startDate);
  const end = new Date(endDate);

  while (cursor <= end) {
    const date = formatDate(cursor);

    dailyMap.set(date, {
      statDate: date,
      dailyAmount: 0,
      dailyCount: 0,
    });

    cursor = addDays(cursor, 1);
  }

  payments.forEach((payment) => {
    const current = dailyMap.get(payment.paidDate);

    if (!current) return;

    current.dailyAmount += payment.totalAmount;
    current.dailyCount += 1;
  });

  return Array.from(dailyMap.values());
}

function buildTopProducts(payments) {
  const productMap = new Map();

  payments.forEach((payment) => {
    const current = productMap.get(payment.productName) || {
      productName: payment.productName,
      salesAmount: 0,
      salesCount: 0,
    };

    current.salesAmount += payment.totalAmount;
    current.salesCount += 1;

    productMap.set(payment.productName, current);
  });

  return Array.from(productMap.values())
    .sort((a, b) => {
      if (b.salesAmount !== a.salesAmount) {
        return b.salesAmount - a.salesAmount;
      }

      return b.salesCount - a.salesCount;
    })
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      productName: item.productName,
      salesAmount: item.salesAmount,
      salesCount: item.salesCount,
    }));
}

function buildFixedSummary() {
  const totalAmount = mockPayments.reduce(
    (sum, payment) => sum + payment.totalAmount,
    0
  );

  const totalOrderCount = mockPayments.length;

  const totalCustomerCount = new Set(
    mockPayments.map((payment) => payment.customerId)
  ).size;

  return {
    totalAmount,
    totalOrderCount,
    totalCustomerCount,
  };
}

export function getToday() {
  return getTodayString();
}

export async function getSellerSalesStat({
  sellerId,
  period,
  startDate,
  endDate,
}) {
  if (USE_MOCK) {
    const filteredPayments = filterPaymentsByDateRange(
      sellerId,
      startDate,
      endDate
    );

    const dailySales = buildDailySales(filteredPayments, startDate, endDate);
    const topProducts = buildTopProducts(filteredPayments);

    const periodTotalAmount = filteredPayments.reduce(
      (sum, payment) => sum + payment.totalAmount,
      0
    );

    const periodTotalCount = filteredPayments.length;

    return {
      sellerId,
      period,
      startDate,
      endDate,
      fixedSummary: buildFixedSummary(),
      periodTotalAmount,
      periodTotalCount,
      dailySales,
      topProducts,
    };
  }

  const response = await fetch(
    `${API_BASE_URL}/sellers/${sellerId}/sales?period=${period}&startDate=${startDate}&endDate=${endDate}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('판매자 매출 통계 조회에 실패했습니다.');
  }

  return response.json();
}