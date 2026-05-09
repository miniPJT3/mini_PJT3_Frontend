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
import SellerPaymentApproval from '../components/sellerDashboard/SellerPaymentApproval'; // 🥊 추가 유지
import '../styles/SellerDashboard.css';

// --- 유틸리티 함수들 (기존 100% 유지) ---
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

// --- 메인 컴포넌트 ---
function SellerDashboardPage() {
  const today = getToday();

  const [sellerId, setSellerId] = useState(1);
  const [period, setPeriod] = useState('DAILY');
  const [activeTab, setActiveTab] = useState('STAT'); // 🥊 'STAT' 또는 'APPROVAL'

  const [selectedDate, setSelectedDate] = useState(today);
  const [weekStartDate, setWeekStartDate] = useState(addDays(today, -6));
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
    // 통계 탭일 때만 데이터 페칭 수행
    if (activeTab === 'STAT') {
      if (period === 'DAILY') {
        fetchSellerDashboard(selectedDate, selectedDate);
      } else if (period === 'WEEKLY') {
        fetchSellerDashboard(weekStartDate, weekEndDate);
      } else if (period === 'MONTHLY') {
        fetchSellerDashboard(monthRange.startDate, monthRange.endDate);
      }
    }
  }, [sellerId, period, selectedDate, weekStartDate, selectedMonth, activeTab]);

  const handlePeriodChange = (nextPeriod) => {
    setPeriod(nextPeriod);
    if (nextPeriod === 'DAILY') setSelectedDate(today);
    if (nextPeriod === 'WEEKLY') setWeekStartDate(addDays(today, -6));
    if (nextPeriod === 'MONTHLY') setSelectedMonth(getMonthValue(today));
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
      {/* (1) 히어로 섹션 및 판매자 ID 입력 (기존 유지) */}
      <section className="seller-dashboard-hero">
        <div>
          <p className="seller-dashboard-label">Seller Admin Center</p>
          <h1>판매자 관리 센터</h1>
          <p className="seller-dashboard-desc">
            매출 통계를 확인하고 사용자의 입금 내역을 승인하세요.
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

      {/* (2) 🥊 상단 메인 탭 메뉴 (수정 및 추가 부분) */}
      <div className="flex gap-6 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('STAT')}
          className={`pb-4 px-2 text-lg font-black transition-all ${activeTab === 'STAT' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          매출 통계 현황
        </button>
        <button 
          onClick={() => setActiveTab('APPROVAL')}
          className={`pb-4 px-2 text-lg font-black transition-all ${activeTab === 'APPROVAL' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          결제 승인 관리
        </button>
      </div>

      {/* --- 🥊 탭에 따른 화면 분기 (기존 통계 로직 100% 보존) --- */}
      
      {activeTab === 'APPROVAL' ? (
        // [탭 1] 결제 승인 관리 섹션 (새로 추가한 컴포넌트)
        <SellerPaymentApproval sellerId={sellerId} />
      ) : (
        // [탭 2] 매출 통계 섹션 (지호님의 기존 팀원 코드를 그대로 감쌌습니다)
        <>
          <SellerSummaryCards summary={statData?.fixedSummary} />

          <section className="seller-filter-section">
            <div>
              <h2>기간별 통계 조회</h2>
              <p>일간·주간·월간 선택에 따라 실시간 통계를 보여줍니다.</p>
            </div>

            <SellerPeriodTabs
              selectedPeriod={period}
              onChange={handlePeriodChange}
            />

            {/* 날짜 컨트롤들 (기존 유지) */}
            {isDaily && (
              <div className="seller-date-controls">
                <label>일간 조회 날짜 <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /></label>
              </div>
            )}
            {isWeekly && (
              <div className="seller-date-controls">
                <label>주간 시작일 <input type="date" value={weekStartDate} onChange={(e) => setWeekStartDate(e.target.value)} /></label>
                <label>주간 종료일 <input type="date" value={weekEndDate} readOnly /></label>
              </div>
            )}
            {isMonthly && (
              <div className="seller-date-controls">
                <label>월간 조회 월 <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} /></label>
                <label>조회 기간 <input type="text" value={`${monthRange.startDate} ~ ${monthRange.endDate}`} readOnly /></label>
              </div>
            )}
          </section>

          {loading && <div className="seller-loading-box">데이터를 불러오는 중...</div>}
          {errorMessage && <div className="seller-error-box">{errorMessage}</div>}

          {!loading && statData && (
            <>
              <section className="seller-period-summary">
                <div className="seller-period-card">
                  <span>조회 기간</span>
                  <strong>{statData.startDate} ~ {statData.endDate}</strong>
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