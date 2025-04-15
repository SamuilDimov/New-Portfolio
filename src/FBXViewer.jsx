import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { gsap } from 'gsap';
import './App.css';

const loadFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

function FBXModel({ url }) {
  const group = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const loader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/textures/thrasher-cards1.png');

    loader.load(url, (fbx) => {
      fbx.scale.set(0.01, 0.01, 0.01);
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
          });
          child.material.needsUpdate = true;
        }
      });
      group.current.add(fbx);
    });
  }, [url]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return <group ref={group} />;
}

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

          {/* FBX Model viewer embedded here */}
          <div className="three-container" style={{ width: '100%', height: '60vh', marginTop: '50px' }}>
            <Canvas shadows camera={{ position: [0, 1, 5], fov: 50 }}>
              <hemisphereLight intensity={0.8} groundColor="#444" />
              <directionalLight position={[3, 5, 3]} intensity={2} castShadow />
              <ambientLight intensity={0.4} />
              <Suspense fallback={null}>
                <FBXModel url="/thrashercards.fbx" />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
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
