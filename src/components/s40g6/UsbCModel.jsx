import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

export default function UsbCModel({ modelSrc }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const W = el.clientWidth || 680;
    const H = 460;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a22);

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const key = new THREE.DirectionalLight(0xfff8f0, 2.0);
    key.position.set(5, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd0e8ff, 1.0);
    fill.position.set(-6, 2, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(0, -4, -6);
    scene.add(rim);

    const pivot = new THREE.Object3D();
    scene.add(pivot);
    let ready = false;

    // resolve src — handles string or Astro image object
    const src = typeof modelSrc === "string"
      ? modelSrc
      : (modelSrc?.src ?? modelSrc?.href ?? String(modelSrc));

    const loader = new GLTFLoader();
    loader.load(
      src,
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        model.scale.setScalar(4.5 / Math.max(size.x, size.y, size.z));

        const box2 = new THREE.Box3().setFromObject(model);
        const center2 = box2.getCenter(new THREE.Vector3());
        model.position.y -= center2.y;
        model.position.x -= center2.x;

        pivot.rotation.x = 0.2;
        pivot.rotation.y = 0.4;
        pivot.add(model);
        ready = true;
      },
      undefined,
      (err) => console.error("GLB load error:", err)
    );

    let drag = false, px = 0, py = 0;
    const onDown = e => { drag = true; px = e.clientX; py = e.clientY; };
    const onUp = () => { drag = false; };
    const onMove = e => {
      if (!drag || !ready) return;
      pivot.rotation.y += (e.clientX - px) * 0.011;
      pivot.rotation.x += (e.clientY - py) * 0.011;
      px = e.clientX; py = e.clientY;
    };
    const onWheel = e => {
      camera.position.z = Math.max(3, Math.min(18, camera.position.z + e.deltaY * 0.014));
      e.preventDefault();
    };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    el.addEventListener('wheel', onWheel, { passive: false });

    let tx = 0, ty = 0;
    const onTouchStart = e => {
      if (e.touches.length === 1) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }
    };
    const onTouchMove = e => {
      if (e.touches.length === 1 && ready) {
        pivot.rotation.y += (e.touches[0].clientX - tx) * 0.011;
        pivot.rotation.x += (e.touches[0].clientY - ty) * 0.011;
        tx = e.touches[0].clientX; ty = e.touches[0].clientY;
      }
      e.preventDefault();
    };
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove, { passive: false });

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!drag && ready) pivot.rotation.y += 0.004;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "460px", borderRadius: "12px", overflow: "hidden" }}
    />
  );
}