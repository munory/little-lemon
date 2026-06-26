function CheckoutSuccess({ onBackHome }) {
  const orderNum = Math.floor(10000 + Math.random() * 90000);

  return (
    <main className="co-success-page">
      <div className="co-success-inner">

        <div className="co-success-icon" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="co-success-heading">Order Confirmed!</h1>
        <p className="co-success-sub">
          Thank you! Your order <strong>#LL-{orderNum}</strong> is being prepared and
          will be on its way shortly.
        </p>

        <div className="co-success-eta">
          <span className="co-success-eta-icon" aria-hidden="true">🛵</span>
          <div>
            <span className="co-success-eta-label">Estimated delivery</span>
            <span className="co-success-eta-time">30 – 45 min</span>
          </div>
        </div>

        <div className="co-success-steps">
          {['Order received', 'Preparing your food', 'Out for delivery'].map((step, i) => (
            <div key={step} className="co-success-step">
              <div className={`co-step-dot${i === 0 ? ' active' : ''}`} aria-hidden="true" />
              <span>{step}</span>
            </div>
          ))}
        </div>

        <button className="btn-primary co-success-cta" onClick={onBackHome}>
          Back to Home
        </button>
      </div>
    </main>
  );
}

export default CheckoutSuccess;
