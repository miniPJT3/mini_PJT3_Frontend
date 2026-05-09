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
  return formatDate(date);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getMonthValue(dateString) {
  return dateString.slice(0, 7);
}

function getMonthRange(monthValue) {
  const [year, month] = monthValue.split('-').map(Number);

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay),
  };
}

function SellerDashboardPage() {
  const today = getToday();

  const [sellerId, setSellerId] = useState(1);
  const [period, setPeriod] = useState('DAILY');

  // 일간: 선택 날짜 1개
  const [selectedDate, setSelectedDate] = useState(today);

  // 주간: 시작일만 선택, 종료일은 시작일 + 6일 자동 계산
  const [weekStartDate, setWeekStartDate] = useState(addDays(today, -6));

  // 월간: YYYY-MM 단위 선택
  const [selectedMonth, setSelectedMonth] = useState(getMonthValue(today));

  const [statData, setStatData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isDaily = period === 'DAILY';
  const isWeekly = period === 'WEEKLY';
  const isMonthly = period === 'MONTHLY';

  const weekEndDate = addDays(weekStartDate, 6);
  const monthRange = getMonthRange(selectedMonth);

  useEffect(() => {
    if (period === 'DAILY') {
      fetchSellerDashboard(selectedDate, selectedDate);
      return;
    }

    if (period === 'WEEKLY') {
      fetchSellerDashboard(weekStartDate, weekEndDate);
      return;
    }

    if (period === 'MONTHLY') {
      fetchSellerDashboard(monthRange.startDate, monthRange.endDate);
    }
  }, [sellerId, period, selectedDate, weekStartDate, selectedMonth]);

  const handlePeriodChange = (nextPeriod) => {
    setPeriod(nextPeriod);

    if (nextPeriod === 'DAILY') {
      setSelectedDate(today);
      return;
    }

    if (nextPeriod === 'WEEKLY') {
      // 기본값: 종료일 today, 시작일 today 포함 7일 전 범위
      setWeekStartDate(addDays(today, -6));
      return;
    }

    if (nextPeriod === 'MONTHLY') {
      // 기본값: 현재 월
      setSelectedMonth(getMonthValue(today));
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
            일간은 선택한 날짜 기준, 주간은 시작일 기준 7일, 월간은 선택한 월 기준으로 통계를 보여줍니다.
          </p>
        </div>

        <SellerPeriodTabs
          selectedPeriod={period}
          onChange={handlePeriodChange}
        />

        {isDaily && (
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
        )}

        {isWeekly && (
          <div className="seller-date-controls">
            <label>
              주간 시작일
              <input
                type="date"
                value={weekStartDate}
                onChange={(event) => setWeekStartDate(event.target.value)}
              />
            </label>

            <label>
              주간 종료일
              <input
                type="date"
                value={weekEndDate}
                readOnly
              />
            </label>
          </div>
        )}

        {isMonthly && (
          <div className="seller-date-controls">
            <label>
              월간 조회 월
              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              />
            </label>

            <label>
              월간 조회 기간
              <input
                type="text"
                value={`${monthRange.startDate} ~ ${monthRange.endDate}`}
                readOnly
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
              <strong>
                {Number(statData.periodTotalCount || 0).toLocaleString()}건
              </strong>
            </div>

            <div className="seller-period-card">
              <span>{isDaily ? '일간 매출액' : '기간 내 매출액'}</span>
              <strong>
                {Number(statData.periodTotalAmount || 0).toLocaleString()}원
              </strong>
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