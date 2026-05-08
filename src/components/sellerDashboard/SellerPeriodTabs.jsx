function SellerPeriodTabs({ selectedPeriod, onChange }) {
  const periods = [
    { label: '일간', value: 'DAILY' },
    { label: '주간', value: 'WEEKLY' },
    { label: '월간', value: 'MONTHLY' },
  ];

  return (
    <div className="seller-period-tabs">
      {periods.map((period) => (
        <button
          key={period.value}
          type="button"
          className={
            selectedPeriod === period.value
              ? 'seller-period-tab active'
              : 'seller-period-tab'
          }
          onClick={() => onChange(period.value)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}

export default SellerPeriodTabs;