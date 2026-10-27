"use client";
import { useEffect, useRef, useState } from "react";

const PLACEHOLDERS = [
  ["#ff2e93", "#0d0a0c", "Photo 01"], ["#0d0a0c", "#ff2e93", "Video 02"],
  ["#fff3f9", "#0d0a0c", "Photo 03"], ["#ff2e93", "#fff3f9", "Video 04"],
];
const pad = (n) => (n < 10 ? "0" : "") + n;

export default function Portfolio({ media }) {
  const reelRef = useRef(null);
  const [cur, setCur] = useState(0);
  const total = media.length || PLACEHOLDERS.length;

  // Warm the cache with every photo up front so each cut is instant.
  useEffect(() => {
    media.filter((m) => m.type === "image").forEach((m) => {
      const im = new Image();
      im.decoding = "async";
      im.src = m.src;
    });
  }, [media]);

  useEffect(() => {
    const update = () => {
      const reel = reelRef.current;
      if (!reel) return;
      const r = reel.getBoundingClientRect();
      const span = reel.offsetHeight - window.innerHeight;
      const p = Math.min(Math.max(-r.top / span, 0), 0.9999);
      setCur(Math.floor(p * total));
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [total]);

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

      <div className="reel" id="work" ref={reelRef} style={{ height: `${total * 70 + 100}vh` }}>
        <div className="stage">
          <div className="lb t" /><div className="lb b" /><div className="grain" />
          <div className="hud"><span>Selected work</span><span>{pad(cur + 1)} / {pad(total)}</span></div>
          {media.length
            ? media.map((m, i) => (
                <div key={m.src} className={"slide" + (i === cur ? " on" : "")}>
                  {m.type === "video" ? (
                    Math.abs(i - cur) <= 1 ? <video src={m.src} muted loop autoPlay playsInline preload="auto" /> : null
                  ) : (
                    <img src={m.src} alt="" loading="eager" decoding="async" />
                  )}
                </div>
              ))
            : PLACEHOLDERS.map(([bg, fg, label], i) => (
                <div key={label} className={"slide" + (i === cur ? " on" : "")}>
                  <div className="ph" style={{ background: bg, color: fg }}>{label}</div>
                </div>
              ))}
        </div>
      </div>

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
