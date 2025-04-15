import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './App.css';

const loadFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

function App() {
  const buttonRef = useRef(null);
  const titleRef = useRef(null);
  const nameRef = useRef(null);
  const tickerRef = useRef(null);
  const tickerTextRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    loadFonts();

    gsap.from([".hero-title", ".hero-subtitle", ".cta-button"], {
      opacity: 1,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      delay: 0.2
    });

    const el = buttonRef.current;
    const toggleScale = scale => gsap.to(el, { scale, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    el.addEventListener("pointerenter", () => toggleScale(1.1));
    el.addEventListener("pointerleave", () => toggleScale(1));

    return () => {
      el.removeEventListener("pointerenter", () => toggleScale(1.1));
      el.removeEventListener("pointerleave", () => toggleScale(1));
    };
  }, []);

  useEffect(() => {
    const titleEl = titleRef.current;
    const letters = titleEl.textContent.split("");
    titleEl.textContent = "";

    letters.forEach((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.display = "inline-block";
      span.style.transition = "transform 0.3s ease";
      titleEl.appendChild(span);
    });

    const spans = titleEl.querySelectorAll("span");
    titleEl.addEventListener("mouseenter", () => {
      spans.forEach((span, i) => {
        gsap.to(span, {
          y: -10,
          duration: 0.3,
          ease: "power1.out",
          delay: i * 0.03
        });
        gsap.to(span, {
          y: 0,
          duration: 0.3,
          ease: "power1.in",
          delay: 0.3 + i * 0.03
        });
      });
    });
  }, []);

  useEffect(() => {
    const nameEl = nameRef.current;

    nameEl.addEventListener("mouseenter", () => {
      gsap.to(nameEl, {
        scale: 1.2,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)"
      });
    });

    nameEl.addEventListener("mouseleave", () => {
      gsap.to(nameEl, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)"
      });
    });
  }, []);

  useEffect(() => {
    gsap.to(tickerRef.current, {
      x: '-100%',
      duration: 20,
      ease: 'linear',
      repeat: -1
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      const rotateX = y * 15;
      const rotateY = -x * 15;

      gsap.to(video, {
        scale: 1.08,
        rotateX: rotateX,
        rotateY: rotateY,
        transformOrigin: "center",
        transformPerspective: 1200,
        ease: "power2.out",
        duration: 0.4
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div className="app-container">
      <video
        ref={videoRef}
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
        src="/background.mp4"
      />

      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand" ref={nameRef}>Samuil</div>
          <ul className="navbar-links">
            <li><a href="#">Home</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <div className="ticker-wrapper">
        <div className="ticker" ref={tickerRef}>
          <strong ref={tickerTextRef}>
          •GOOD JOB TRYING GOOD JOB WINNING GOOD JOB FAILING•
          </strong>
        </div>
      </div>

      <div className="content-container">
        <section className="hero-section">
          <h1 className="hero-title" ref={titleRef}>Hi, I'm Samuil Dimov</h1>
          <p className="hero-subtitle">Creative Developer & Visual Storyteller</p>
          <a href="#work" className="cta-button" ref={buttonRef}>View My Work</a>
        </section>

        <section id="work" className="section">
          <h2>Selected Work</h2>
          <p>Portfolio projects will go here...</p>
        </section>

        <section id="about" className="section">
          <h2>About Me</h2>
          <p>Write something personal and professional about yourself here.</p>
        </section>

        <section id="contact" className="section">
          <h2>Contact</h2>
          <p>Drop me a line at <a href="mailto:you@example.com">you@example.com</a></p>
        </section>
      </div>
    </div>
  );
}

export default App;