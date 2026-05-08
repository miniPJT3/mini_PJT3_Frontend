function SellerSummaryCards({ totalAmount, totalCount, startDate, endDate }) {
  const formatWon = (value) => {
    return `${Number(value || 0).toLocaleString()}원`
  }

  return (
    <section className="seller-summary-grid">
      <div className="seller-summary-card purple">
        <span className="seller-summary-title">총 매출액</span>
        <strong>{formatWon(totalAmount)}</strong>
        <p>조회 기간 내 결제 완료 금액 합계</p>
      </div>

      <div className="seller-summary-card blue">
        <span className="seller-summary-title">결제 완료 건수</span>
        <strong>{Number(totalCount || 0).toLocaleString()}건</strong>
        <p>조회 기간 내 PAID 결제 건수</p>
      </div>

      <div className="seller-summary-card green">
        <span className="seller-summary-title">조회 기간</span>
        <strong className="small">
          {startDate} ~ {endDate}
        </strong>
        <p>선택한 기간 기준 통계</p>
      </div>
    </section>
  )
}

export default SellerSummaryCards