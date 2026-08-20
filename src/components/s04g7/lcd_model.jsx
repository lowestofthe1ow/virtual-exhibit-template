import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CanvasTexture, RepeatWrapping } from "three";

const canvasWrapper = {
    width: "100%",
    maxWidth: "820px",
    height: "400px",
};

function BacklightSheet({ z, type, layout, selectedPart, setSelectedPart }) {
    const planeRef = useRef(null);
    const elements = [];

    useFrame((state) => {
        if (!planeRef.current) return;
        if (selectedPart === type) {
            const pulse = 0.2 + 0.2 * Math.sin(state.clock.elapsedTime * 3);
            planeRef.current.material.emissiveIntensity = pulse;
        } else {
            planeRef.current.material.emissiveIntensity = 0;
        }
    });
    if (type === 'led') {
        if (layout === 'edge-lit') {
            for (let col = 0; col < 11; col++) {
                const x = -1.65 + col * 0.33;
                elements.push(
                    <mesh position={[x, 1.35, 0.1]}>
                        <boxGeometry args={[0.12, 0.1, 0.04]} />
                        <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                    </mesh>,
                    <mesh position={[x, -1.35, 0.1]}>
                        <boxGeometry args={[0.12, 0.1, 0.04]} />
                        <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                    </mesh>
                );
            }
            for (let row = 0; row < 8; row++) {
                const y = -1.15 + row * 0.33;
                elements.push(
                    <mesh position={[-1.85, y, 0.1]}>
                        <boxGeometry args={[0.12, 0.1, 0.04]} />
                        <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                    </mesh>,
                    <mesh position={[1.85, y, 0.1]}>
                        <boxGeometry args={[0.12, 0.1, 0.04]} />
                        <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                    </mesh>
                );
            }
        } else {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 11; col++) {
                    const x = -1.65 + col * 0.33;
                    const y = -1.15 + row * 0.33;
                    elements.push(
                        <mesh position={[x, y, 0.1]}>
                            <boxGeometry args={[0.12, 0.1, 0.04]} />
                            <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                        </mesh>
                    );
                }
            }
        }
    } else if (type === 'miniled') {
        if (layout === 'edge-lit') {
            for (let col = 0; col < 19; col++) {
                const x = -1.8 + col * 0.2;
                elements.push(
                    <mesh position={[x, 1.4, 0.1]}>
                        <boxGeometry args={[0.06, 0.05, 0.025]} />
                        <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                    </mesh>,
                    <mesh position={[x, -1.4, 0.1]}>
                        <boxGeometry args={[0.06, 0.05, 0.025]} />
                        <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                    </mesh>
                );
            }
            for (let row = 0; row < 14; row++) {
                const y = -1.3 + row * 0.2;
                elements.push(
                    <mesh position={[-1.9, y, 0.1]}>
                        <boxGeometry args={[0.06, 0.05, 0.025]} />
                        <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                    </mesh>,
                    <mesh position={[1.9, y, 0.1]}>
                        <boxGeometry args={[0.06, 0.05, 0.025]} />
                        <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                    </mesh>
                );
            }
        } else {
            for (let row = 0; row < 15; row++) {
                for (let col = 0; col < 20; col++) {
                    const x = -1.9 + col * 0.2;
                    const y = -1.4 + row * 0.2;
                    elements.push(
                        <mesh position={[x, y, 0.1]}>
                            <boxGeometry args={[0.06, 0.05, 0.025]} />
                            <meshStandardMaterial color="white" emissive="#eeffff" emissiveIntensity={1.5} />
                        </mesh>
                    );
                }
            }
        }
    } else if (type === 'qdled') {
        if (layout === 'edge-lit') {
            for (let col = 0; col < 11; col++) {
                const x = -1.65 + col * 0.33;
                elements.push(
                    <mesh position={[x, 1.35, 0.1]}>
                        <boxGeometry args={[0.06, 0.05, 0.025]} />
                        <meshStandardMaterial color="#0044ff" emissive="#0044ff" emissiveIntensity={1.5} />
                    </mesh>,
                    <mesh position={[x, -1.35, 0.1]}>
                        <boxGeometry args={[0.06, 0.05, 0.025]} />
                        <meshStandardMaterial color="#0044ff" emissive="#0044ff" emissiveIntensity={1.5} />
                    </mesh>
                );
            }
            for (let row = 0; row < 8; row++) {
                const y = -1.15 + row * 0.33;
                elements.push(
                    <mesh position={[-1.85, y, 0.1]}>
                        <boxGeometry args={[0.06, 0.05, 0.025]} />
                        <meshStandardMaterial color="#0044ff" emissive="#0044ff" emissiveIntensity={1.5} />
                    </mesh>,
                    <mesh position={[1.85, y, 0.1]}>
                        <boxGeometry args={[0.06, 0.05, 0.025]} />
                        <meshStandardMaterial color="#0044ff" emissive="#0044ff" emissiveIntensity={1.5} />
                    </mesh>
                );
            }
        } else {
            for (let row = 0; row < 15; row++) {
                for (let col = 0; col < 20; col++) {
                    const x = -1.9 + col * 0.2;
                    const y = -1.4 + row * 0.2;
                    elements.push(
                        <mesh position={[x, y, 0.1]}>
                            <boxGeometry args={[0.06, 0.05, 0.025]} />
                            <meshStandardMaterial color="#0044ff" emissive="#0044ff" emissiveIntensity={1.5} />
                        </mesh>
                    );
                }
            }
        }
    } else {
        const isEdgeLit = layout === 'edge-lit';
        const positions = isEdgeLit
            ? [[-1.9, -0.9], [-1.9, 0], [-1.9, 0.9], [1.9, -0.9], [1.9, 0], [1.9, 0.9]]
            : [[-1.3, -0.7], [0, -0.7], [1.3, -0.7],
               [-1.3, 0], [0, 0], [1.3, 0],
               [-1.3, 0.7], [0, 0.7], [1.3, 0.7]];
        const height = isEdgeLit ? 0.8 : 1.2;
        positions.forEach(([x, y]) => {
            elements.push(
                <mesh position={[x, y, 0.1]} rotation={isEdgeLit ? [0, 0, 0] : [0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.08, 0.08, height, 12]} />
                    <meshStandardMaterial color="white" emissive="#ffffee" emissiveIntensity={1.5} />
                </mesh>
            );
        });
    }

    return (
        <group position={[0, 0, z]}
            onClick={() => setSelectedPart(type)}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
            <mesh ref={planeRef}>
                <planeGeometry args={[4, 3]} />
                <meshStandardMaterial color="white" side={2} emissive="#4488ff" emissiveIntensity={0} />
            </mesh>
            {elements}
        </group>
    );
}

function Polarizer({ z, rotation = 0, selectedPart, setSelectedPart, partId }) {
    const meshRef = useRef(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        if (selectedPart === partId) {
            const pulse = 0.2 + 0.2 * Math.sin(state.clock.elapsedTime * 3);
            meshRef.current.material.emissiveIntensity = pulse;
        } else {
            meshRef.current.material.emissiveIntensity = 0;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, z]} rotation={[0, 0, rotation]}
            onClick={() => setSelectedPart(partId)}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
            <boxGeometry args={[3.8, 2.8, 0.05]} />
            <meshStandardMaterial color="#333" transparent opacity={0.6} emissive="#4488ff" emissiveIntensity={0} />
        </mesh>
    );
}

function LiquidCrystalLayer({ z, selectedPart, setSelectedPart }) {
    const meshRef = useRef(null);
    const texture = useMemo(() => {
        const size = 512;
        const cellSize = 32;

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cx = Math.floor(x / cellSize);
                const cy = Math.floor(y / cellSize);
                const h = ((cx * 374761393 + cy * 668265263) >>> 0);
                const hash = ((h ^ (h >> 13)) * 1274126177) >>> 0;
                const val = (hash & 0xFF) / 255;

                const i = (y * size + x) * 4;
                const b = 180 + Math.floor(val * 60);
                data[i] = b + 20;
                data[i + 1] = b + 10;
                data[i + 2] = b + 30;
                data[i + 3] = 150 + Math.floor(val * 80);
            }
        }

        imageData.data.set(data);
        ctx.putImageData(imageData, 0, 0);

        const tex = new CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = RepeatWrapping;
        tex.repeat.set(4, 4);
        return tex;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        if (selectedPart === 'crystal') {
            const pulse = 0.2 + 0.2 * Math.sin(state.clock.elapsedTime * 3);
            meshRef.current.material.emissiveIntensity = pulse;
        } else {
            meshRef.current.material.emissiveIntensity = 0;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, z]}
            onClick={() => setSelectedPart('crystal')}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
            <boxGeometry args={[3.8, 2.8, 0.15]} />
            <meshStandardMaterial map={texture} transparent opacity={0.8} roughness={0.6} emissive="#4488ff" emissiveIntensity={0} />
        </mesh>
    );
}

function RgbColorFilters({ z, selectedPart, setSelectedPart }) {
    const meshRef = useRef(null);
    const texture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        const stripeW = canvas.width / 3;
        ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
        ctx.fillRect(0, 0, stripeW, canvas.height);
        ctx.fillStyle = "rgba(0, 255, 0, 0.7)";
        ctx.fillRect(stripeW, 0, stripeW, canvas.height);
        ctx.fillStyle = "rgba(0, 0, 255, 0.7)";
        ctx.fillRect(stripeW * 2, 0, stripeW, canvas.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(stripeW - 2, 0, 4, canvas.height);
        ctx.fillRect(stripeW * 2 - 2, 0, 4, canvas.height);

        return new CanvasTexture(canvas);
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        if (selectedPart === 'rgb') {
            const pulse = 0.2 + 0.2 * Math.sin(state.clock.elapsedTime * 3);
            meshRef.current.material.emissiveIntensity = pulse;
        } else {
            meshRef.current.material.emissiveIntensity = 0;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, z]}
            onClick={() => setSelectedPart('rgb')}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
            <planeGeometry args={[3.6, 2.6]} />
            <meshStandardMaterial map={texture} transparent opacity={0.8} side={2} emissive="#4488ff" emissiveIntensity={0} />
        </mesh>
    );
}

function LcdPanel({ z }) {
    return (
        <mesh position={[0, 0, z]}>
            <planeGeometry args={[3.6, 2.6]} />
            <meshStandardMaterial color="#1a1a1a" transparent opacity={0.85} roughness={0.1} metalness={0.05} side={2} />
        </mesh>
    );
}

function LightBeam({ gap, animate, x = 0, y = 0, startZ: startZProp, endZ: endZProp, travelStart = 0, travelEnd = 0.7, radius = 0.06, glowRadius = 0.14, color = "#7fd8ff", glowColor = "#ffffff" }) {
    const beamRef = useRef(null);
    const glowRef = useRef(null);
    const bz = startZProp !== undefined ? startZProp : -5 * gap;
    const sz = endZProp !== undefined ? endZProp : 0;
    const span = sz - bz;

    useFrame((state) => {
        if (!animate) {
            if (beamRef.current) { beamRef.current.material.opacity = 0; beamRef.current.visible = false; }
            if (glowRef.current) { glowRef.current.material.opacity = 0; glowRef.current.visible = false; }
            return;
        }
        if (beamRef.current) beamRef.current.visible = true;
        if (glowRef.current) glowRef.current.visible = true;

        const globalT = (state.clock.elapsedTime * 0.7) % 1;

        if (globalT < travelStart) {
            if (beamRef.current) beamRef.current.material.opacity = 0;
            if (glowRef.current) glowRef.current.material.opacity = 0;
            return;
        }

        const local = (globalT - travelStart) / (1 - travelStart);
        const travelNorm = (travelEnd - travelStart) / (1 - travelStart);
        const fadeNorm = (0.85 - travelStart) / (1 - travelStart);

        const pTravel = Math.min(local / travelNorm, 1);
        const beamT = local < travelNorm ? pTravel : 1;
        const beamOpacity = local > fadeNorm ? Math.max(0, 1 - (local - fadeNorm) / ((1 - fadeNorm) || 0.001)) : 1;

        const frontZ = bz + beamT * span;
        const midpoint = (bz + frontZ) / 2;

        if (beamRef.current) {
            beamRef.current.position.set(x, y, midpoint);
            beamRef.current.scale.y = beamT;
            beamRef.current.material.opacity = beamOpacity * 0.7;
        }
        const contactOpacity = beamT >= 1 ? 1 : 0;
        if (glowRef.current) {
            glowRef.current.position.set(x, y, frontZ);
            const pulse = 0.4 + 0.6 * (Math.sin(state.clock.elapsedTime * 10) * 0.5 + 0.5);
            glowRef.current.material.opacity = beamOpacity * pulse * contactOpacity;
        }
    });

    return (
        <group>
            <mesh ref={beamRef} position={[x, y, bz + span / 2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[radius, radius, span, 8]} />
                <meshBasicMaterial color={color} transparent opacity={0} />
            </mesh>
            <mesh ref={glowRef} position={[x, y, bz]}>
                <sphereGeometry args={[glowRadius, 8, 8]} />
                <meshBasicMaterial color={glowColor} transparent opacity={0} />
            </mesh>
        </group>
    );
}

function LightBeamArray({ gap, animate, positions, radius, glowRadius }) {
    return (
        <group>
            {positions.map(([x, y], i) => (
                <LightBeam key={i} gap={gap} animate={animate} x={x} y={y}
                    radius={radius} glowRadius={glowRadius} />
            ))}
        </group>
    );
}

function EdgeLitLightBeam({ gap, animate, edgePositions, entryRadius = 0.06, entryGlowRadius = 0.14 }) {
    const lgpZ = -4.5 * gap;
    const edges = edgePositions || [[-1.9, -0.9], [-1.9, 0], [-1.9, 0.9], [1.9, -0.9], [1.9, 0], [1.9, 0.9]];
    const scattered = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 11; col++) {
            scattered.push([-1.65 + col * 0.33, -1.15 + row * 0.33]);
        }
    }

    return (
        <group>
            {edges.map(([x, y], i) => (
                <LightBeam key={`edge-${i}`} gap={gap} animate={animate}
                    x={x} y={y} startZ={-5 * gap} endZ={lgpZ}
                    travelStart={0} travelEnd={0.25}
                    radius={entryRadius} glowRadius={entryGlowRadius} />
            ))}
            {scattered.map(([x, y], i) => (
                <LightBeam key={`scatter-${i}`} gap={gap} animate={animate}
                    x={x} y={y} startZ={lgpZ} endZ={0}
                    travelStart={0.25} travelEnd={0.7}
                    radius={0.025} glowRadius={0.05} />
            ))}
        </group>
    );
}

function LightGuidePlate({ z }) {
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 384;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(200, 210, 240, 0.15)';
        ctx.fillRect(0, 0, 512, 384);

        const cx = 256, cy = 192, maxR = 280;
        for (let i = 0; i < 1200; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 384;
            const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxR;
            const scatterChance = 0.15 + dist * 0.6;
            if (Math.random() < scatterChance) {
                const r = 1 + Math.random() * 2.5;
                const br = 190 + Math.floor(Math.random() * 65);
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${br}, ${br + 5}, 255, ${0.15 + Math.random() * 0.35})`;
                ctx.fill();
            }
        }

        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxR);
        grad.addColorStop(0, 'rgba(200, 210, 255, 0.15)');
        grad.addColorStop(0.5, 'rgba(200, 210, 255, 0.35)');
        grad.addColorStop(1, 'rgba(220, 230, 255, 0.7)');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillRect(0, 0, 512, 384);

        return new CanvasTexture(canvas);
    }, []);

    return (
        <mesh position={[0, 0, z]}>
            <planeGeometry args={[3.8, 2.8]} />
            <meshStandardMaterial map={texture} transparent opacity={0.85} side={2} />
        </mesh>
    );
}

function QuantumDotLayer({ z }) {
    return (
        <mesh position={[0, 0, z]}>
            <planeGeometry args={[3.8, 2.8]} />
            <meshStandardMaterial color="#8844cc" transparent opacity={0.25} side={2} />
        </mesh>
    );
}

function QdEdgeLitLightBeam({ gap, animate }) {
    const qdZ = -4.65 * gap;
    const lgpZ = -4.5 * gap;
    const edgePositions = [[-1.9, -0.9], [-1.9, 0], [-1.9, 0.9], [1.9, -0.9], [1.9, 0], [1.9, 0.9]];
    const scattered = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 11; col++) {
            scattered.push([-1.65 + col * 0.33, -1.15 + row * 0.33]);
        }
    }

    return (
        <group>
            {edgePositions.map(([x, y], i) => (
                <LightBeam key={`edge-${i}`} gap={gap} animate={animate}
                    x={x} y={y} startZ={-5 * gap} endZ={qdZ}
                    travelStart={0} travelEnd={0.2}
                    radius={0.04} glowRadius={0.08}
                    color="#0055ff" glowColor="#4488ff" />
            ))}
            {edgePositions.map(([x, y], i) => {
                const c = ['#0066ff', '#ff4444', '#44ff44'][i % 3];
                return (
                    <LightBeam key={`qd-${i}`} gap={gap} animate={animate}
                        x={x} y={y} startZ={qdZ} endZ={lgpZ}
                        travelStart={0.2} travelEnd={0.35}
                        radius={0.04} glowRadius={0.08}
                        color={c} glowColor={c} />
                );
            })}
            {scattered.map(([x, y], i) => {
                const c = ['#0066ff', '#ff4444', '#44ff44'][i % 3];
                return (
                    <LightBeam key={`scatter-${i}`} gap={gap} animate={animate}
                        x={x} y={y} startZ={lgpZ} endZ={0}
                        travelStart={0.35} travelEnd={0.8}
                        radius={0.015} glowRadius={0.04}
                        color={c} glowColor={c} />
                );
            })}
        </group>
    );
}

function QdLightBeamArray({ gap, animate, positions, qdZ }) {
    const phaseColors = ['#0066ff', '#ff4444', '#44ff44'];
    return (
        <group>
            {positions.map(([x, y], i) => {
                const c = phaseColors[i % 3];
                return (
                    <group key={i}>
                        <LightBeam gap={gap} animate={animate} x={x} y={y}
                            startZ={-5 * gap} endZ={qdZ}
                            travelStart={0} travelEnd={0.3}
                            radius={0.015} glowRadius={0.04}
                            color="#0055ff" glowColor="#4488ff" />
                        <LightBeam gap={gap} animate={animate} x={x} y={y}
                            startZ={qdZ} endZ={0}
                            travelStart={0.3} travelEnd={0.8}
                            radius={0.015} glowRadius={0.04}
                            color={c} glowColor={c} />
                    </group>
                );
            })}
        </group>
    );
}

export default function LcdModel({ backlightType, layout, animateLight, selectedPart, setSelectedPart }) {
    const gap = 0.7;

    return (
        <div style={canvasWrapper}>
            <Canvas camera={{ position: [0, 1, 4], fov: 80 }} gl={{ preserveDrawingBuffer: true, antialias: true }} dpr={[1, 2]}>
                <color attach="background" args={["#4d5352"]} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[2, 3, 5]} intensity={0.8} />

                <group position={[0, 0, 1.5]}>
                    <BacklightSheet z={-5 * gap} type={backlightType} layout={layout} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
                    {layout === 'edge-lit' && (backlightType === 'ccfl' || backlightType === 'led' || backlightType === 'miniled' || backlightType === 'qdled') && <LightGuidePlate z={-4.5 * gap} />}
                    {backlightType === 'qdled' && <QuantumDotLayer z={layout === 'edge-lit' ? -4.65 * gap : -4.35 * gap} />}
                    <Polarizer z={-4 * gap} rotation={0} selectedPart={selectedPart} setSelectedPart={setSelectedPart} partId="firstfilter" />
                    <LiquidCrystalLayer z={-3 * gap} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
                    <Polarizer z={-2 * gap} rotation={Math.PI / 2} selectedPart={selectedPart} setSelectedPart={setSelectedPart} partId="secondfilter" />
                    <RgbColorFilters z={-1 * gap} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
                    <LcdPanel z={0} />
                    {backlightType === 'ccfl' && layout === 'direct-lit'
                        ? <LightBeamArray gap={gap} animate={animateLight} positions={[[-0.9, -0.7], [0, -0.7], [0.9, -0.7], [-0.9, 0], [0, 0], [0.9, 0], [-0.9, 0.7], [0, 0.7], [0.9, 0.7]]} />
                        : backlightType === 'ccfl' && layout === 'edge-lit'
                        ? <EdgeLitLightBeam gap={gap} animate={animateLight} />
                        : backlightType === 'led' && layout === 'edge-lit'
                        ? <EdgeLitLightBeam gap={gap} animate={animateLight}
                            edgePositions={Array.from({ length: 38 }, (_, i) => {
                                if (i < 11) return [-1.65 + i * 0.33, 1.35];
                                if (i < 22) return [-1.65 + (i - 11) * 0.33, -1.35];
                                if (i < 30) return [-1.85, -1.15 + (i - 22) * 0.33];
                                return [1.85, -1.15 + (i - 30) * 0.33];
                            })}
                            entryRadius={0.04} entryGlowRadius={0.08} />
                        : backlightType === 'miniled' && layout === 'edge-lit'
                        ? <EdgeLitLightBeam gap={gap} animate={animateLight}
                            edgePositions={Array.from({ length: 66 }, (_, i) => {
                                if (i < 19) return [-1.8 + i * 0.2, 1.4];
                                if (i < 38) return [-1.8 + (i - 19) * 0.2, -1.4];
                                if (i < 52) return [-1.9, -1.3 + (i - 38) * 0.2];
                                return [1.9, -1.3 + (i - 52) * 0.2];
                            })}
                            entryRadius={0.02} entryGlowRadius={0.04} />
                        : backlightType === 'led' && layout === 'direct-lit'
                        ? <LightBeamArray gap={gap} animate={animateLight} positions={Array.from({ length: 88 }, (_, i) => [-1.65 + (i % 11) * 0.33, -1.15 + Math.floor(i / 11) * 0.33])} />
                        : backlightType === 'miniled' && layout === 'direct-lit'
                        ? <LightBeamArray gap={gap} animate={animateLight} positions={Array.from({ length: 300 }, (_, i) => [-1.9 + (i % 20) * 0.2, -1.4 + Math.floor(i / 20) * 0.2])} radius={0.015} glowRadius={0.04} />
                        : backlightType === 'qdled' && layout === 'edge-lit'
                        ? <QdEdgeLitLightBeam gap={gap} animate={animateLight} />
                        : backlightType === 'qdled'
                        ? <QdLightBeamArray gap={gap} animate={animateLight} qdZ={-4.35 * gap}
                            positions={Array.from({ length: 300 }, (_, i) => [-1.9 + (i % 20) * 0.2, -1.4 + Math.floor(i / 20) * 0.2])} />
                        : <LightBeam gap={gap} animate={animateLight} />}
                </group>

                <OrbitControls enableDamping={false} target={[0, 0, 1.5 - 2.5 * gap]} />
            </Canvas>
        </div>
    );
}
