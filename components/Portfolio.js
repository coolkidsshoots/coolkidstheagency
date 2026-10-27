"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const pad = (n) => (n < 10 ? "0" : "") + n;

// Photos in groups, with one full-width video dropped between groups. Returns blocks plus the flat order for the viewer.
function layout(media) {
  const photos = media.filter((m) => m.type !== "video");
  const videos = media.filter((m) => m.type === "video");
  const groups = videos.length + 1;
  const size = Math.ceil(photos.length / groups) || 1;
  const blocks = [];
  const flat = [];
  for (let g = 0; g < groups; g++) {
    const chunk = photos.slice(g * size, (g + 1) * size);
    if (chunk.length) {
      blocks.push({ kind: "photos", items: chunk.map((m) => ({ m, i: flat.push(m) - 1 })) });
    }
    if (videos[g]) blocks.push({ kind: "video", item: { m: videos[g], i: flat.push(videos[g]) - 1 } });
  }
  return { blocks, flat };
}

// A video band that swells up as it scrolls into view.
function Swell({ children }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={"swell" + (on ? " in" : "")}>{children}</div>;
}

export default function Portfolio({ media: raw }) {
  const { blocks, flat: media } = useMemo(() => layout(raw), [raw]);
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
        {blocks.map((b, k) =>
          b.kind === "photos" ? (
            <div className="mosaic" key={k}>
              {b.items.map(({ m, i }) => (
                <button type="button" className="tile" key={m.src} onClick={() => setOpen(i)} aria-label={`Open piece ${i + 1}`}>
                  <img src={m.thumb || m.src} alt="" loading="eager" decoding="async" />
                </button>
              ))}
            </div>
          ) : (
            <Swell key={k}>
              <button type="button" className="vband" onClick={() => setOpen(b.item.i)} aria-label="Open video">
                <video src={b.item.m.src} muted loop autoPlay playsInline preload="metadata" />
              </button>
            </Swell>
          )
        )}
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
        <h2>Let’s make something cool <em>together.</em></h2>
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
