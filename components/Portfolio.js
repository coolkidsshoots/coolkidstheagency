export default function Portfolio({ media }) {
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

      <section className="gallery" id="work">
        {media.map((m, i) =>
          m.type === "video" ? (
            <video key={m.src} src={m.src} muted loop autoPlay playsInline preload="metadata" />
          ) : (
            <img key={m.src} src={m.src} alt="" loading={i < 2 ? "eager" : "lazy"} decoding="async" />
          )
        )}
      </section>

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
