import { useState, useRef, useEffect, useCallback } from 'react';

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function TestimonialsCarousel({ items, title }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [perView, setPerView]     = useState(3);
  const trackRef   = useRef(null);
  const snapTimer  = useRef(null);

  // Detect how many cards fit: 1 mobile, 2 tablet, 3 desktop
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768)  setPerView(1);
      else if (w < 1024) setPerView(2);
      else setPerView(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const pageCount = Math.max(1, items.length - perView + 1);

  // Scroll track to a card by index
  const scrollToIdx = useCallback((idx) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[idx];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    setActiveIdx(Math.min(idx, pageCount - 1));
  }, [pageCount]);

  // Sync active dot when user swipes natively
  const handleScroll = useCallback(() => {
    clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const cards = Array.from(track.children);
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIdx(Math.min(closest, pageCount - 1));
    }, 60);
  }, [pageCount]);

  const prev = () => scrollToIdx(Math.max(0, activeIdx - 1));
  const next = () => scrollToIdx(Math.min(pageCount - 1, activeIdx + 1));

  return (
    <div className="carousel-wrapper">
      {title && <h2 className="carousel-title">{title}</h2>}

      {/* Scroll-snap track — no viewport wrapper needed */}
      <div className="carousel-track" ref={trackRef} onScroll={handleScroll}>
        {items.map((item) => (
          <article key={item.id} className="testimonial-card">
            <p className="testimonial-rating">{'⭐'.repeat(item.rating)}</p>
            <div className="testimonial-author">
              <img src={item.photo} alt={item.name} />
              <h3>{item.name}</h3>
            </div>
            <p>{item.review}</p>
          </article>
        ))}
      </div>

      {/* Controls: [←]  [• • • •]  [→] */}
      <div className="carousel-controls">
        <button
          className="carousel-btn"
          onClick={prev}
          disabled={activeIdx === 0}
          aria-label="Previous testimonials"
        >
          <ChevronLeft />
        </button>

        <div className="carousel-dots" role="tablist" aria-label="Testimonial slides">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Go to slide ${i + 1}`}
              className={`carousel-dot${i === activeIdx ? ' active' : ''}`}
              onClick={() => scrollToIdx(i)}
            />
          ))}
        </div>

        <button
          className="carousel-btn"
          onClick={next}
          disabled={activeIdx === pageCount - 1}
          aria-label="Next testimonials"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export default TestimonialsCarousel;
