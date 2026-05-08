import { useEffect, useState } from 'react';
import {
  getSellerSalesStat,
  getToday,
} from '../api/sellerDashboardApi';
import SellerPeriodTabs from '../components/sellerDashboard/SellerPeriodTabs';
import SellerSummaryCards from '../components/sellerDashboard/SellerSummaryCards';
import SellerDailySalesChart from '../components/sellerDashboard/SellerDailySalesChart';
import SellerOrderCountChart from '../components/sellerDashboard/SellerOrderCountChart';
import SellerProductRankTable from '../components/sellerDashboard/SellerProductRankTable';
import '../styles/SellerDashboard.css';

function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getMonthStart(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}-01`;
}

function SellerDashboardPage() {
  const today = getToday();

  const [sellerId, setSellerId] = useState(1);
  const [period, setPeriod] = useState('DAILY');

  // 일간 날짜
  const [selectedDate, setSelectedDate] = useState(today);

  // 주간/월간 조회 기간
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [statData, setStatData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isDaily = period === 'DAILY';

  useEffect(() => {
    if (period === 'DAILY') {
      fetchSellerDashboard(selectedDate, selectedDate);
      return;
    }

    fetchSellerDashboard(startDate, endDate);
  }, [sellerId, period, selectedDate, startDate, endDate]);

  const handlePeriodChange = (nextPeriod) => {
    setPeriod(nextPeriod);

    if (nextPeriod === 'DAILY') {
      setSelectedDate(today);
      return;
    }

    if (nextPeriod === 'WEEKLY') {
      setStartDate(addDays(today, -6));
      setEndDate(today);
      return;
    }

    if (nextPeriod === 'MONTHLY') {
      setStartDate(getMonthStart(today));
      setEndDate(today);
    }
  };

  const fetchSellerDashboard = async (rangeStartDate, rangeEndDate) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const data = await getSellerSalesStat({
        sellerId,
        period,
        startDate: rangeStartDate,
        endDate: rangeEndDate,
      });

      setStatData(data);
    } catch (error) {
      setErrorMessage(error.message);
      setStatData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);

    if (value > endDate) {
      setEndDate(value);
    }
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);

    if (value < startDate) {
      setStartDate(value);
    }
  };

  return (
    <main className="seller-dashboard-page">
      <section className="seller-dashboard-hero">
        <div>
          <p className="seller-dashboard-label">Seller Dashboard</p>
          <h1>판매자 매출 통계</h1>
          <p className="seller-dashboard-desc">
            전체 매출 현황은 고정으로 확인하고, 아래에서 일간·주간·월간 통계를 조회하세요.
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

      <SellerSummaryCards summary={statData?.fixedSummary} />

      <section className="seller-filter-section">
        <div>
          <h2>기간별 통계 조회</h2>
          <p>
            일간은 선택한 날짜 기준, 주간과 월간은 선택한 조회 기간 기준으로 통계를 보여줍니다.
          </p>
        </div>

        <SellerPeriodTabs
          selectedPeriod={period}
          onChange={handlePeriodChange}
        />

        {isDaily ? (
          <div className="seller-date-controls">
            <label>
              일간 조회 날짜
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>
          </div>
        ) : (
          <div className="seller-date-controls">
            <label>
              시작일
              <input
                type="date"
                value={startDate}
                onChange={(event) => handleStartDateChange(event.target.value)}
              />
            </label>

            <label>
              종료일
              <input
                type="date"
                value={endDate}
                onChange={(event) => handleEndDateChange(event.target.value)}
              />
            </label>
          </div>
        )}
      </section>

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
          <section className="seller-period-summary">
            <div className="seller-period-card">
              <span>조회 기간</span>
              <strong>
                {statData.startDate} ~ {statData.endDate}
              </strong>
            </div>

            <div className="seller-period-card">
              <span>{isDaily ? '일간 주문 건수' : '기간 내 주문 건수'}</span>
              <strong>{Number(statData.periodTotalCount || 0).toLocaleString()}건</strong>
            </div>

            <div className="seller-period-card">
              <span>{isDaily ? '일간 매출액' : '기간 내 매출액'}</span>
              <strong>{Number(statData.periodTotalAmount || 0).toLocaleString()}원</strong>
            </div>
          </section>

          {isDaily ? (
            <div className="seller-dashboard-content daily">
              <ProductRankOnlySection topProducts={statData.topProducts} />
            </div>
          ) : (
            <div className="seller-dashboard-content">
              <SellerDailySalesChart dailySales={statData.dailySales} />
              <SellerOrderCountChart dailySales={statData.dailySales} />
              <div className="seller-wide-panel">
                <SellerProductRankTable topProducts={statData.topProducts} />
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

function ProductRankOnlySection({ topProducts }) {
  return (
    <div className="seller-wide-panel">
      <SellerProductRankTable topProducts={topProducts} />
    </div>
  );
}

export default SellerDashboardPage;