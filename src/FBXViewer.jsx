import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

function FBXModel({ url }) {
  const group = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load(url, (fbx) => {
      fbx.scale.set(0.01, 0.01, 0.01); // adjust scale to fit screen
      group.current.add(fbx);
    });
  }, [url]);

  // Optional: slowly rotate the model
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return <group ref={group} />;
}

export default function FBXViewer() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <FBXModel url="/thrashercards.fbx" /> {/* Place in public/ folder */}
        </Suspense>
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
