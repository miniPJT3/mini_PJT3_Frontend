function SellerSummaryCards({ summary }) {
  const totalAmount = summary?.totalAmount || 0;

  const totalOrderCount =
    summary?.totalOrderCount ?? summary?.totalCount ?? 0;

  const totalCustomerCount =
    summary?.totalCustomerCount ?? summary?.customerCount ?? 0;

  return (
    <section className="seller-summary-grid">
      <div className="seller-summary-card purple">
        <span className="seller-summary-title">총 매출액</span>
        <strong>{Number(totalAmount).toLocaleString()}원</strong>
        <p>전체 결제 완료 금액 합계</p>
      </div>

      <div className="seller-summary-card blue">
        <span className="seller-summary-title">총 주문 건수</span>
        <strong>{Number(totalOrderCount).toLocaleString()}건</strong>
        <p>전체 결제 완료 주문 수</p>
      </div>

      <div className="seller-summary-card green">
        <span className="seller-summary-title">총 고객수</span>
        <strong>{Number(totalCustomerCount).toLocaleString()}명</strong>
        <p>전체 고유 고객 수</p>
      </div>
    </section>
  );
}

export default SellerSummaryCards;