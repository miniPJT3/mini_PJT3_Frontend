function SellerProductRankTable({ topProducts }) {
  const products = topProducts || [];

  return (
    <section className="seller-panel">
      <div className="seller-panel-header">
        <h2>인기 상품 Top 5</h2>
        <p>결제 완료 데이터를 기준으로 집계한 상품 순위입니다.</p>
      </div>

      {products.length === 0 ? (
        <div className="seller-empty-box">
          인기 상품 데이터가 없습니다.
        </div>
      ) : (
        <div className="seller-rank-table-wrap">
          <table className="seller-rank-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>상품명</th>
                <th>매출액</th>
                <th>결제 건수</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={`${product.rank}-${product.productName}`}>
                  <td>
                    <span className="seller-rank-badge">
                      {product.rank}
                    </span>
                  </td>
                  <td className="seller-product-name">
                    {product.productName}
                  </td>
                  <td>
                    {Number(product.amount || product.salesAmount || 0).toLocaleString()}원
                  </td>
                  <td>
                    {Number(product.count || product.salesCount || 0).toLocaleString()}건
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default SellerProductRankTable;