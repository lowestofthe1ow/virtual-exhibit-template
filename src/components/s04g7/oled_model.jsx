import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader, CanvasTexture, RepeatWrapping } from "three";
import oledTextureSrc from "../../assets/s04g7/oled.jpg";

const canvasWrapper = {
    width: "100%",
    maxWidth: "820px",
    height: "400px",
};

// Shared highlight behavior for all layers
function useHighlight(ref, selectedPart, partId) {
    useFrame((state) => {
        if (!ref.current) return;
        const mat = ref.current.material;
        if (selectedPart === partId) {
            const pulse = 0.2 + 0.2 * Math.sin(state.clock.elapsedTime * 3);
            mat.emissiveIntensity = pulse;
        } else {
            mat.emissiveIntensity = 0;
        }
    });
}

// 1. Substrate Layer
function Substrate({ z, selectedPart, setSelectedPart }) {
    const meshRef = useRef(null);
    useHighlight(meshRef, selectedPart, "substrate");

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, z]}
            onClick={() => setSelectedPart("substrate")}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
            <boxGeometry args={[3.9, 2.9, 0.12]} />
            <meshStandardMaterial color="#e8edf2" roughness={0.9} emissive="#4488ff" emissiveIntensity={0} />
        </mesh>
    );
}

// 2. Anode Layer
function Anode({ z, selectedPart, setSelectedPart }) {
    const meshRef = useRef(null);
    useHighlight(meshRef, selectedPart, "anode");

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, z]}
            onClick={() => setSelectedPart("anode")}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
            <boxGeometry args={[3.85, 2.85, 0.05]} />
            <meshStandardMaterial color="#c8d8f0" transparent opacity={0.65} roughness={0.3} emissive="#4488ff" emissiveIntensity={0} />
        </mesh>
    );
}

// 3. Hole Transport Layer (HTL)
function HoleTransportLayer({ z, selectedPart, setSelectedPart }) {
    const meshRef = useRef(null);
    useHighlight(meshRef, selectedPart, "htl");

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, z]}
            onClick={() => setSelectedPart("htl")}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
            <boxGeometry args={[3.82, 2.82, 0.04]} />
            <meshStandardMaterial color="#b8c8e8" transparent opacity={0.7} roughness={0.4} emissive="#4488ff" emissiveIntensity={0} />
        </mesh>
    );
}

// 4. Emissive Layer (EML)
function EmissiveLayer({ z, selectedPart, setSelectedPart, animateLight }) {
    const meshRef = useRef(null);
    useHighlight(meshRef, selectedPart, "eml");

    // Pixel texture
    const pixelTexture = useMemo(() => {
        const size = 512;
        const cell = 16;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d");

        for (let y = 0; y < size; y += cell) {
            for (let x = 0; x < size; x += cell * 3) {
                ctx.fillStyle = "rgba(255, 20, 0, 0.95)";
                ctx.fillRect(x, y, cell, cell);
                ctx.fillStyle = "rgba(0, 255, 30, 0.95)";
                ctx.fillRect(x + cell, y, cell, cell);
                ctx.fillStyle = "rgba(0, 60, 255, 0.95)";
                ctx.fillRect(x + cell * 2, y, cell, cell);
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                ctx.fillRect(x + cell - 1, y, 2, cell);
                ctx.fillRect(x + cell * 2 - 1, y, 2, cell);
            }
        }

        const tex = new CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = RepeatWrapping;
        tex.repeat.set(6, 6);
        return tex;
    }, []);

    // Brightness when animating
    useFrame((state) => {
        if (!meshRef.current) return;
        const mat = meshRef.current.material;
        const base = animateLight ? 0.9 : 0.15;
        const flicker = animateLight ? 0.15 * Math.sin(state.clock.elapsedTime * 5) : 0;
        mat.emissiveIntensity = base + flicker;
    });

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, z]}
            onClick={() => setSelectedPart("eml")}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
            <boxGeometry args={[3.8, 2.8, 0.04]} />
            <meshStandardMaterial
                map={pixelTexture}
                emissiveMap={pixelTexture}
                emissive="#ffffff"
                emissiveIntensity={0.2}
                transparent
                opacity={0.95}
                roughness={0.7}
            />
        </mesh>
    );
}

// 5. Electron Transport Layer (ETL)
function ElectronTransportLayer({ z, selectedPart, setSelectedPart }) {
    const meshRef = useRef(null);
    useHighlight(meshRef, selectedPart, "etl");

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, z]}
            onClick={() => setSelectedPart("etl")}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
            <boxGeometry args={[3.82, 2.82, 0.04]} />
            <meshStandardMaterial color="#a8b8e0" transparent opacity={0.7} roughness={0.4} emissive="#4488ff" emissiveIntensity={0} />
        </mesh>
    );
}

// 6. Cathode Layer
function Cathode({ z, selectedPart, setSelectedPart }) {
    const meshRef = useRef(null);
    useHighlight(meshRef, selectedPart, "cathode");

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, z]}
            onClick={() => setSelectedPart("cathode")}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
            <boxGeometry args={[3.85, 2.85, 0.05]} />
            <meshStandardMaterial color="#999999" metalness={0.6} roughness={0.4} transparent opacity={0.85} emissive="#4488ff" emissiveIntensity={0} />
        </mesh>
    );
}

// 7. Encapsulation Layer
function Encapsulation({ z, selectedPart, setSelectedPart }) {
    const meshRef = useRef(null);
    useHighlight(meshRef, selectedPart, "encapsulation");

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, z]}
            onClick={() => setSelectedPart("encapsulation")}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
            <boxGeometry args={[3.9, 2.9, 0.08]} />
            <meshStandardMaterial color="#cce0ff" transparent opacity={0.35} roughness={0.15} emissive="#4488ff" emissiveIntensity={0} />
        </mesh>
    );
}

// Final Top Glass
function OledPanel({ z }) {
    const textureSrc = typeof oledTextureSrc === "string" ? oledTextureSrc : oledTextureSrc.src;
    const texture = useLoader(TextureLoader, textureSrc);

    return (
        <mesh position={[0, 0, z]}>
            <planeGeometry args={[3.6, 2.6]} />
            <meshStandardMaterial
                map={texture}
                transparent
                opacity={0.92}
                roughness={0.08}
                metalness={0.1}
                side={2}
            />
        </mesh>
    );
}

// Main Export
export default function OledModel({ animateLight, selectedPart, setSelectedPart }) {
    const gap = 0.12; // small gap between layers
    const baseZ = -6 * gap;

    return (
        <div style={canvasWrapper}>
            <Canvas
                camera={{ position: [0, 1, 4], fov: 80 }}
                gl={{ preserveDrawingBuffer: true, antialias: true }}
                dpr={[1, 2]}
            >
                <color attach="background" args={["#222830"]} />
                <ambientLight intensity={0.3} />
                <directionalLight position={[2, 3, 5]} intensity={0.6} />

                <group position={[0, 0, 1.5]}>
                    {/* Stack layers from bottom to top */}
                    <Substrate z={baseZ} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
                    <Anode z={baseZ + gap} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
                    <HoleTransportLayer z={baseZ + gap * 2} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
                    <EmissiveLayer z={baseZ + gap * 3} selectedPart={selectedPart} setSelectedPart={setSelectedPart} animateLight={animateLight} />
                    <ElectronTransportLayer z={baseZ + gap * 4} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
                    <Cathode z={baseZ + gap * 5} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
                    <Encapsulation z={baseZ + gap * 6} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
                    <OledPanel z={0} />
                </group>

                <OrbitControls enableDamping={false} target={[0, 0, 1.5 - 3 * gap]} />
            </Canvas>
        </div>
    );
}