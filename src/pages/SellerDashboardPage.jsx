import { useEffect, useState } from 'react'
import { getSellerSalesStat } from '../api/sellerDashboardApi'
import SellerPeriodTabs from '../components/sellerDashboard/SellerPeriodTabs'
import SellerSummaryCards from '../components/sellerDashboard/SellerSummaryCards'
import SellerDailySalesChart from '../components/sellerDashboard/SellerDailySalesChart'
import SellerProductRankTable from '../components/sellerDashboard/SellerProductRankTable'
import '../styles/SellerDashboard.css'

function SellerDashboardPage() {
  const [sellerId, setSellerId] = useState(1)
  const [period, setPeriod] = useState('DAILY')
  const [statData, setStatData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchSellerDashboard()
  }, [sellerId, period])

  const fetchSellerDashboard = async () => {
    try {
      setLoading(true)
      setErrorMessage('')

      const data = await getSellerSalesStat(sellerId, period)
      setStatData(data)
    } catch (error) {
      setErrorMessage(error.message)
      setStatData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="seller-dashboard-page">
      <section className="seller-dashboard-hero">
        <div>
          <p className="seller-dashboard-label">Seller Dashboard</p>
          <h1>판매자 매출 통계</h1>
          <p className="seller-dashboard-desc">
            기간별 매출 흐름, 결제 건수, 인기 상품 순위를 한눈에 확인하세요.
          </p>
        </div>

        <div className="seller-id-card">
          <label htmlFor="sellerId">판매자 ID</label>
          <input
            id="sellerId"
            type="number"
            min="1"
            value={sellerId}
            onChange={(event) => setSellerId(Number(event.target.value))}
          />
        </div>
      </section>

      <SellerPeriodTabs selectedPeriod={period} onChange={setPeriod} />

      {loading && (
        <div className="seller-loading-box">
          판매자 대시보드 데이터를 불러오는 중입니다...
        </div>
      )}

      {errorMessage && (
        <div className="seller-error-box">
          {errorMessage}
        </div>
      )}

      {!loading && statData && (
        <>
          <SellerSummaryCards
            totalAmount={statData.totalAmount}
            totalCount={statData.totalCount}
            startDate={statData.startDate}
            endDate={statData.endDate}
          />

          <div className="seller-dashboard-content">
            <SellerDailySalesChart dailySales={statData.dailySales} />
            <SellerProductRankTable topProducts={statData.topProducts} />
          </div>
        </>
      )}
    </main>
  )
}

export default SellerDashboardPage