"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const pad = (n) => (n < 10 ? "0" : "") + n;

// Photos in groups, with one full-width video dropped between groups. The featured photo opens the section.
function layout(media) {
  const featured = media.find((m) => m.featured);
  const photos = media
    .filter((m) => m.type !== "video" && m !== featured && !m.story)
    .sort((a, b) => ((a.lead ?? -1) >= 0 ? a.lead : 99) - ((b.lead ?? -1) >= 0 ? b.lead : 99));
  const leadCount = photos.filter((m) => (m.lead ?? -1) >= 0).length;
  const pinned = media.find((m) => m.type === "video" && m.afterHero); // this video sits straight after the featured photo
  const videos = media.filter((m) => m.type === "video" && m !== pinned);
  const groups = videos.length + 1;
  const size = Math.ceil(photos.length / groups) || 1;
  const blocks = [];
  const flat = [];
  if (featured) blocks.push({ kind: "hero", item: { m: featured, i: flat.push(featured) - 1 } });
  if (pinned) blocks.push({ kind: "video", item: { m: pinned, i: flat.push(pinned) - 1 } });
  for (let g = 0; g < groups; g++) {
    const chunk = photos.slice(g * size, (g + 1) * size);
    if (chunk.length) {
      blocks.push({ kind: "photos", lead: g === 0 ? leadCount : 0, items: chunk.map((m) => ({ m, i: flat.push(m) - 1 })) });
    }
    if (videos[g]) blocks.push({ kind: "video", item: { m: videos[g], i: flat.push(videos[g]) - 1 } });
  }
  // Instagram band goes in the middle of the work, right after a video.
  let at = Math.ceil(blocks.length / 2);
  while (at < blocks.length && blocks[at - 1]?.kind !== "video") at++;
  blocks.splice(Math.min(at, blocks.length), 0, { kind: "insta" });
  return { blocks, flat };
}

// Packs photos into rows that fill the full width exactly, so there are no gaps and nothing is cropped.
function justify(items, ratios, target, lead = 0) {
  const rows = [];
  let cur = [], sum = 0;
  if (lead) {
    rows.push(items.slice(0, lead).map((it) => ({ ...it, r: ratios[it.m.thumb || it.m.src] || 1.5 })));
    items = items.slice(lead);
  }
  for (const it of items) {
    const r = ratios[it.m.thumb || it.m.src] || 1.5;
    cur.push({ ...it, r });
    sum += r;
    if (sum >= target) { rows.push(cur); cur = []; sum = 0; }
  }
  if (cur.length) {
    if (rows.length && sum < target * 0.75) rows[rows.length - 1].push(...cur);
    else rows.push(cur);
  }
  return rows;
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
  const storyPhoto = raw.find((m) => m.story);
  const [ratios, setRatios] = useState({});
  const [ready, setReady] = useState(false);
  const [vw, setVw] = useState(1200);
  const [open, setOpen] = useState(null); // index of the item shown full-size

  // Measure every photo once so rows can be sized exactly (no black gaps).
  useEffect(() => {
    const srcs = media.filter((m) => m.type !== "video" && !m.featured).map((m) => m.thumb || m.src);
    if (!srcs.length) { setReady(true); return; }
    const found = {};
    let left = srcs.length;
    const done = () => { if (--left <= 0) { setRatios({ ...found }); setReady(true); } };
    const timer = setTimeout(() => { setRatios({ ...found }); setReady(true); }, 8000);
    srcs.forEach((src) => {
      const im = new Image();
      im.onload = () => { found[src] = im.naturalWidth / im.naturalHeight; done(); };
      im.onerror = done;
      im.src = src;
    });
    return () => clearTimeout(timer);
  }, [media]);

  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  const target = vw > 800 ? vw / 330 : vw / 170;

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
        <a href="#contact" className="cta">Contact us <span aria-hidden="true">→</span></a>
      </div>

      <section className="hero" id="top">
        <h1>Cool Kids <span>The Agency</span></h1>
        <p>We make the coolest stories in sport.</p>
      </section>

      <div className="marquee">
        <div>{"Just real stories ✦ ".repeat(16)}</div>
      </div>

      <section className="story">
        <div className="story-grid">
          <div className="story-text">
          <h2>Sport, but make it a <em>movie.</em></h2>
          <p>Sport is life, and it deserves to be captured in style. We are a creative agency built by two friends, a filmmaker and a photographer, with a cinematic eye for every story. We work with athletes, clubs and brands to tell theirs.</p>
          <div className="fmt">Your story, told your way.</div>
          
          <div className="chips">
            <span>Film Photography</span><span>Movies</span><span>Cinematic Trailers</span><span>Documentary</span>
            <span>Digital Photography</span><span>Vlogs</span>
          </div>
          </div>
          {storyPhoto && (
            <figure className="story-photo">
              <img src={storyPhoto.thumb || storyPhoto.src} alt="" loading="eager" decoding="async" />
            </figure>
          )}
        </div>
      </section>

      <section className="work" id="work">
        <div className="work-head">
          <h2>Selected <em>work</em></h2>
          <span>{media.length} pieces</span>
        </div>
        {blocks.map((b, k) => {
          if (b.kind === "hero") {
            return (
              <button type="button" className="hero-shot" key={k} onClick={() => setOpen(b.item.i)} aria-label="Open featured photo">
                <img src={b.item.m.src} alt="" loading="eager" decoding="async" fetchPriority="high" />
              </button>
            );
          }
          if (b.kind === "insta") {
            return (
              <section className="insta" key={k}>
                <svg className="ig-big" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                <span className="insta-tag">● Follow along</span>
                <h2>See it before it’s a <em>movie.</em></h2>
                <p>Follow <b>@coolkidstheagency</b> for the latest projects, raw behind-the-scenes footage and first looks at what we’re shooting next.</p>
                <div className="insta-chips">
                  <span>Latest projects</span><span>Behind the scenes</span><span>First looks</span>
                </div>
                <a className="insta-btn" href="https://instagram.com/coolkidstheagency" target="_blank" rel="noopener noreferrer"><svg className="ig-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>Follow on Instagram <span aria-hidden="true">→</span></a>
              </section>
            );
          }
          if (b.kind === "photos") {
            if (!ready) return <div className="mosaic-wait" key={k} />;
            return (
              <div className="mosaic" key={k}>
                {justify(b.items, ratios, target, b.lead).map((row, ri) => (
                  <div className="jrow" key={ri} style={{ aspectRatio: row.reduce((a, x) => a + x.r, 0) }}>
                    {row.map(({ m, i, r }) => (
                      <button type="button" className="tile" key={m.src} style={{ flex: `${r} 1 0%` }} onClick={() => setOpen(i)} aria-label={`Open piece ${i + 1}`}>
                        <img src={m.thumb || m.src} alt="" decoding="async" />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            );
          }
          return (
            <Swell key={k}>
              <button type="button" className="vband" onClick={() => setOpen(b.item.i)} aria-label="Open video">
                <video src={b.item.m.src} muted loop autoPlay playsInline preload="metadata" />
              </button>
            </Swell>
          );
        })}
      </section>

      {current && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          {current.type === "video" ? (
            <video src={current.full || current.src} controls autoPlay loop playsInline onClick={(e) => e.stopPropagation()} />
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
          <li><b>Email:</b><a href="mailto:contact@coolkidstheagency.com">contact@coolkidstheagency.com</a></li>
          <li><b>Phone:</b><a href="tel:+447385794068">07385 794068</a></li>
        </ul>
      </section>
      <footer>© 2026 Cool Kids The Agency</footer>
    </>
  );
}
