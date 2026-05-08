const API_BASE_URL = '/api/dashboard'

// 프론트 화면만 먼저 테스트하려면 true
// 백엔드 연동 테스트할 때 false로 변경
const USE_MOCK = true

const mockSellerDashboardData = {
  sellerId: 1,
  period: 'DAILY',
  startDate: '2026-05-08',
  endDate: '2026-05-08',
  totalAmount: 482000,
  totalCount: 8,
  dailySales: [
    {
      statDate: '2026-05-04',
      dailyAmount: 120000,
      dailyCount: 2,
    },
    {
      statDate: '2026-05-05',
      dailyAmount: 76000,
      dailyCount: 1,
    },
    {
      statDate: '2026-05-06',
      dailyAmount: 184000,
      dailyCount: 3,
    },
    {
      statDate: '2026-05-07',
      dailyAmount: 52000,
      dailyCount: 1,
    },
    {
      statDate: '2026-05-08',
      dailyAmount: 50000,
      dailyCount: 1,
    },
  ],
  topProducts: [
    {
      rank: 1,
      productName: '무선 이어폰',
      salesAmount: 184000,
      salesCount: 3,
    },
    {
      rank: 2,
      productName: 'USB-C 충전기',
      salesAmount: 120000,
      salesCount: 2,
    },
    {
      rank: 3,
      productName: '노트북 거치대',
      salesAmount: 76000,
      salesCount: 1,
    },
    {
      rank: 4,
      productName: '보조배터리',
      salesAmount: 52000,
      salesCount: 1,
    },
    {
      rank: 5,
      productName: '케이블 세트',
      salesAmount: 50000,
      salesCount: 1,
    },
  ],
}

export async function getSellerSalesStat(sellerId, period) {
  if (USE_MOCK) {
    return {
      ...mockSellerDashboardData,
      sellerId,
      period,
    }
  }

  const response = await fetch(
    `${API_BASE_URL}/sellers/${sellerId}/sales?period=${period}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('판매자 매출 통계 조회에 실패했습니다.')
  }

  return response.json()
}