import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function SellerOrderCountChart({ dailySales }) {
  const chartData = (dailySales || []).map((item) => ({
    date: item.date ?? item.statDate,
    count: Number(item.dailyCount || 0),
  }));

  return (
    <section className="seller-panel">
      <div className="seller-panel-header">
        <h2>날짜별 주문 건수</h2>
        <p>선택한 기간의 일자별 결제 완료 건수입니다.</p>
      </div>

      {chartData.length === 0 ? (
        <div className="seller-empty-box">
          조회된 주문 데이터가 없습니다.
        </div>
      ) : (
        <div
          className="seller-chart-box"
          style={{ width: '100%', height: 320, minWidth: 0 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString()}건`,
                  '주문 건수',
                ]}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default SellerOrderCountChart;