import React, { useEffect, useRef, Suspense, useState } from 'react';
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
    const texture = textureLoader.load('/public/thrasher-cards1.png');

    loader.load(url, (fbx) => {
      fbx.scale.set(0.02, 0.02, 0.02);
      fbx.position.set(0, -1, 0);
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
  const videoRef = useRef(null);
  const [graffitiVisible, setGraffitiVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

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
    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trail-container';
    document.body.appendChild(trailContainer);

    const graffitiImages = [
      '/images/topka1.jpg',
      '/images/topka2.jpg',
      '/images/topka3.jpg',
      '/images/topka4.jpg',
      '/images/topka5.jpg',
      '/images/topka6.jpg',
      '/images/topka7.jpg',
    ];

    let index = 0;
    const trail = [];
    const maxLength = 20;

    const createImageTrail = (x, y) => {
      const img = document.createElement('img');
      img.src = graffitiImages[index];
      img.className = 'cursor-image';
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;

      trailContainer.appendChild(img);
      trail.push(img);

      if (trail.length > maxLength) {
        const removed = trail.shift();
        trailContainer.removeChild(removed);
      }

      setTimeout(() => {
        img.style.opacity = 0;
      }, 500); // delay opacity fade a bit longer

      setTimeout(() => {
        if (trailContainer.contains(img)) {
          trailContainer.removeChild(img);
        }
      }, 2000); // longer removal

      index = (index + 1) % graffitiImages.length;
    };

    const moveHandler = (e) => createImageTrail(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      document.body.removeChild(trailContainer);
    };
  }, []);

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleHoverStart = () => setGraffitiVisible(true);
  const handleHoverEnd = () => setGraffitiVisible(false);

  return (
    <div className="app-container" onMouseMove={handleMouseMove}>
      <nav className="navbar">
        <div className="navbar-left" ref={nameRef}>Samuil Dimov</div>
        <div className="navbar-right">
          <span className="navbar-date">&lt;date&gt; February–May, 2025 &lt;/date&gt;</span>
        </div>
      </nav>

      <div className="landing-section">
        <div className="text-column">
          <h1 className="hero-title" ref={titleRef}>Creative Developer & Visual Storyteller</h1>
          <p className="hero-subtitle">Building immersive, interactive digital experiences.</p>
          <a href="#work" className="cta-button" ref={buttonRef}>View My Work</a>
        </div>
        <div className="model-column">
          <Canvas shadows camera={{ position: [0, 1, 3], fov: 60 }}>
            <hemisphereLight intensity={0.8} groundColor="#444" />
            <directionalLight position={[3, 5, 3]} intensity={2} castShadow />
            <ambientLight intensity={0.4} />
            <Suspense fallback={null}>
              <FBXModel url="/thrashercards.fbx" />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
      </div>

      <footer className="bottom-nav">
        {['Home', 'My Work', 'About', 'Contact'].map((text, index) => (
          <a
            key={index}
            href={`#${text.toLowerCase().replace(/ /g, '')}`}
            className="nav-item"
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          >
            {text}
          </a>
        ))}
      </footer>

      {graffitiVisible && (
        <img
          src="/images/94f90dff-e592-4b1d-8077-55912b8221a7.png"
          alt="Graffiti Hover"
          className="graffiti-image"
          style={{ top: cursorPos.y + 10, left: cursorPos.x + 10 }}
        />
      )}
    </div>
  );
}

export default App;
