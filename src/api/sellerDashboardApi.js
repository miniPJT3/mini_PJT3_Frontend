export function getToday() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${date}`;
}

export async function getSellerSalesStat({
  sellerId,
  period,
  startDate,
  endDate,
}) {
  const params = new URLSearchParams({
    sellerId: String(sellerId),
    period,
    startDate,
    endDate,
  });

  const response = await fetch(
    `/api/dashboard/seller-sales?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `판매자 매출 통계 조회에 실패했습니다. 상태코드: ${response.status} / ${errorText}`
    );
  }

  return response.json();
}