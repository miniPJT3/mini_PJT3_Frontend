import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function SellerDailySalesChart({ dailySales }) {
  const chartData = (dailySales || []).map((item) => ({
    date: item.date ?? item.statDate,
    amount: Number(item.dailyAmount || 0),
  }));

  return (
    <section className="seller-panel">
      <div className="seller-panel-header">
        <h2>날짜별 매출</h2>
        <p>선택한 기간의 일자별 매출 흐름입니다.</p>
      </div>

      {chartData.length === 0 ? (
        <div className="seller-empty-box">
          조회된 매출 데이터가 없습니다.
        </div>
      ) : (
        <div
          className="seller-chart-box"
          style={{ width: '100%', height: 320, minWidth: 0 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `${value / 10000}만`} />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString()}원`,
                  '매출액',
                ]}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Bar
                dataKey="amount"
                name="amount"
                fill="#7c3aed"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default SellerDailySalesChart;