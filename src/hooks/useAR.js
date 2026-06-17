import { useEffect, useRef, useState } from 'react';

export default function useAR({ onMarkerFound, onMarkerLost }) {
  const containerRef = useRef(null);
  const mindarRef    = useRef(null);
  const rendererRef  = useRef(null);
  const [arReady, setArReady] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mindarThree = null;

    const startAR = async () => {
      try {
        const { MindARThree } = window;
        if (!MindARThree) throw new Error('MindAR belum load');

        mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: '/assets/markers/bottle.mind',
          maxTrack: 1,
          uiLoading: 'no',
          uiScanning: 'no',
          uiError: 'no',
        });

        const { renderer, scene, camera } = mindarThree;
        rendererRef.current = renderer;

        // ── 3D Object: Floating Ring + Particles ──
        const anchor = mindarThree.addAnchor(0);

        // Group utama
        const group = new window.THREE.Group();

        // Sphere tengah (objek utama)
        const sphereGeo  = new window.THREE.SphereGeometry(0.15, 32, 32);
        const sphereMat  = new window.THREE.MeshStandardMaterial({
          color: 0x52B788,
          emissive: 0x1a5c3a,
          roughness: 0.3,
          metalness: 0.6,
        });
        const sphere = new window.THREE.Mesh(sphereGeo, sphereMat);
        group.add(sphere);

        // Ring mengelilingi sphere
        const ringGeo = new window.THREE.TorusGeometry(0.25, 0.015, 16, 100);
        const ringMat = new window.THREE.MeshStandardMaterial({
          color: 0x40BFB0,
          emissive: 0x40BFB0,
          emissiveIntensity: 0.5,
        });
        const ring = new window.THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        // Ring kedua (miring)
        const ring2 = ring.clone();
        ring2.rotation.x = Math.PI / 4;
        ring2.rotation.y = Math.PI / 4;
        group.add(ring2);

        // Lighting
        const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const pointLight = new window.THREE.PointLight(0x52B788, 2, 5);
        pointLight.position.set(0, 1, 1);
        scene.add(pointLight);

        anchor.group.add(group);

        // ── Animasi ──
        let frame = 0;
        const animate = () => {
          frame += 0.02;
          // Float naik turun
          group.position.y = Math.sin(frame) * 0.05;
          // Rotate
          group.rotation.y += 0.01;
          // Ring pulse
          ring.scale.setScalar(1 + Math.sin(frame * 2) * 0.05);
        };

        // ── Event marker found/lost ──
        anchor.onTargetFound = () => {
          setArReady(true);
          onMarkerFound?.();
        };
        anchor.onTargetLost = () => {
          onMarkerLost?.();
        };

        // ── Start ──
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
          animate();
          renderer.render(scene, camera);
        });

      } catch (err) {
        console.error('AR Error:', err);
        setError(err.message);
      }
    };

    startAR();

    return () => {
      if (mindarThree) {
        mindarThree.stop();
        mindarThree.renderer?.setAnimationLoop(null);
      }
    };
  }, []);

  return { containerRef, arReady, error };
}