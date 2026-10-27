"use client";
import { useCallback, useEffect, useState } from "react";

const pad = (n) => (n < 10 ? "0" : "") + n;

export default function Portfolio({ media }) {
  const [open, setOpen] = useState(null); // index of the item shown full-size

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d) => setOpen((i) => (i === null ? i : (i + d + media.length) % media.length)),
    [media.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const current = open === null ? null : media[open];

  return (
    <>
      <div className="bar">
        <a href="#top" className="brand">
          <img src="/logo.png" alt="Cool Kids" />
        </a>
        <a href="#contact">Contact</a>
      </div>

      <section className="hero" id="top">
        <span className="tag">● Nothing for sale</span>
        <h1>Cool Kids <span>The Agency</span></h1>
        <p>We make the coolest stories in sport.</p>
      </section>

      <div className="marquee">
        <div>{"Nothing for sale ✦ Just real stories ✦ ".repeat(8)}</div>
      </div>

      <section className="story">
        <h2>Sport, but make it a <em>movie.</em></h2>
        <p>We’re a creative agency with a playful streak and a cinematic eye. We find the moments, characters and chaos that make sport worth watching, then tell them properly: sharp, funny, beautifully shot.</p>
        <div className="fmt">Your story, told your way.</div>
        <p>Whichever format suits the moment, we’ll shape it with the same cinematic care.</p>
        <div className="chips">
          <span>Film Photography</span><span>Cinematic Trailers</span><span>Documentary</span>
          <span>Digital Photography</span><span>Vlogs</span>
        </div>
      </section>

      <section className="work" id="work">
        <div className="work-head">
          <h2>Selected <em>work</em></h2>
          <span>{media.length} pieces</span>
        </div>
        <div className="mosaic">
          {media.map((m, i) => (
            <button type="button" className="tile" key={m.src} onClick={() => setOpen(i)} aria-label={`Open piece ${i + 1}`}>
              {m.type === "video" ? (
                <video src={m.src} muted loop autoPlay playsInline preload="metadata" />
              ) : (
                <img src={m.thumb || m.src} alt="" loading="eager" decoding="async" />
              )}
            </button>
          ))}
        </div>
      </section>

      {current && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          {current.type === "video" ? (
            <video src={current.src} controls autoPlay loop playsInline onClick={(e) => e.stopPropagation()} />
          ) : (
            <img src={current.src} alt="" onClick={(e) => e.stopPropagation()} />
          )}
          <button className="lb-btn x" onClick={close}>Close</button>
          <button className="lb-btn p" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous">‹</button>
          <button className="lb-btn n" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next">›</button>
          <div className="lb-count">{pad(open + 1)} / {pad(media.length)}</div>
        </div>
      )}

      <section className="contact" id="contact">
        <h2>Let’s make something cool.</h2>
        <ul>
          <li><b>Name:</b><span>Abdullah Ahmed</span></li>
          <li><b>Email:</b><a href="mailto:Coolkidsshoots@gmail.com">Coolkidsshoots@gmail.com</a></li>
          <li><b>Phone:</b><a href="tel:+447385794068">07385 794068</a></li>
          <li><b>Instagram:</b><a href="https://instagram.com/coolkidsthegency">@coolkidsthegency</a></li>
        </ul>
      </section>
      <footer>© 2026 Cool Kids The Agency. Nothing for sale.</footer>
    </>
  );
}
