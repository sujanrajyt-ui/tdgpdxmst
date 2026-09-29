import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function makeScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 560;
    const context = canvas.getContext('2d');
    if (!context) return new THREE.CanvasTexture(canvas);

    const gradient = context.createLinearGradient(0, 0, 900, 560);
    gradient.addColorStop(0, '#15251c');
    gradient.addColorStop(0.56, '#355741');
    gradient.addColorStop(1, '#8ca292');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 900, 560);
    context.fillStyle = '#ffffff';
    context.font = '600 64px system-ui, sans-serif';
    context.fillText('Relore', 70, 150);
    context.fillStyle = '#e4eee5';
    context.font = '32px system-ui, sans-serif';
    context.fillText('A product with a history.', 74, 208);
    context.fillStyle = '#dce9df';
    context.beginPath();
    context.roundRect(72, 290, 260, 88, 16);
    context.fill();
    context.fillStyle = '#1c382b';
    context.font = '600 27px system-ui, sans-serif';
    context.fillText('VIEW PASSPORT', 100, 345);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function LaptopModel() {
    const model = useRef<THREE.Group>(null);
    const screenTexture = useMemo(makeScreenTexture, []);
    const { pointer } = useThree();
    const keys = useMemo(() => Array.from({ length: 60 }, (_, index) => ({
        x: (index % 10 - 4.5) * 0.285,
        z: (Math.floor(index / 10) - 1.5) * 0.22 - 0.12,
    })), []);

    useFrame(({ clock }, delta) => {
        if (!model.current) return;
        const targetY = -0.38 + pointer.x * 0.24;
        const targetX = 0.14 - pointer.y * 0.13;
        model.current.rotation.y = THREE.MathUtils.damp(model.current.rotation.y, targetY, 3, delta);
        model.current.rotation.x = THREE.MathUtils.damp(model.current.rotation.x, targetX, 3, delta);
        model.current.position.y = 0.05 + Math.sin(clock.elapsedTime * 0.8) * 0.055;
    });

    return (
        <group ref={model} rotation={[0.14, -0.38, 0]}>
            {/* One original low-poly laptop model, assembled from Three.js shapes. */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.7, 0.16, 2.45]} />
                <meshStandardMaterial color="#b9c2ba" metalness={0.72} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0.087, 0.04]}>
                <boxGeometry args={[3.48, 0.025, 2.18]} />
                <meshStandardMaterial color="#202822" metalness={0.18} roughness={0.6} />
            </mesh>
            {keys.map((key, index) => (
                <mesh key={index} position={[key.x, 0.11, key.z]}>
                    <boxGeometry args={[0.21, 0.025, 0.15]} />
                    <meshStandardMaterial color="#69766c" metalness={0.16} roughness={0.45} />
                </mesh>
            ))}
            <mesh position={[0, 0.108, 0.76]}>
                <boxGeometry args={[0.9, 0.018, 0.52]} />
                <meshStandardMaterial color="#9ba69c" metalness={0.52} roughness={0.35} />
            </mesh>
            <group position={[0, 0.08, -1.15]}>
                <mesh position={[0, 1.26, 0]} castShadow>
                    <boxGeometry args={[3.72, 2.55, 0.12]} />
                    <meshStandardMaterial color="#19221c" metalness={0.55} roughness={0.26} />
                </mesh>
                <mesh position={[0, 1.26, 0.066]}>
                    <planeGeometry args={[3.5, 2.33]} />
                    <meshBasicMaterial map={screenTexture} toneMapped={false} />
                </mesh>
                <mesh position={[0, 2.49, 0.066]}>
                    <sphereGeometry args={[0.035, 12, 8]} />
                    <meshStandardMaterial color="#718078" />
                </mesh>
            </group>
        </group>
    );
}

function CssLaptopFallback() {
    const [tilt, setTilt] = useState({ x: 7, y: -17 });

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'touch') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        setTilt({
            x: 7 + ((event.clientY - bounds.top) / bounds.height - 0.5) * -13,
            y: -17 + ((event.clientX - bounds.left) / bounds.width - 0.5) * 20,
        });
    };

    return (
        <div className="shop-home-css-fallback" onPointerMove={handlePointerMove} onPointerLeave={() => setTilt({ x: 7, y: -17 })}>
            <div className="shop-home-css-laptop" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(-3deg)` }}>
                <div className="shop-home-css-screen-frame">
                    <div className="shop-home-css-screen">
                        <strong>Relore</strong>
                        <span>Good devices deserve another life.</span>
                        <i>PRODUCT PASSPORT INCLUDED</i>
                    </div>
                </div>
                <div className="shop-home-css-laptop-base">
                    <div className="shop-home-css-keys" />
                    <div className="shop-home-css-trackpad" />
                </div>
            </div>
        </div>
    );
}

export default function ReloreProductScene3D() {
    return (
        <Canvas
            className="shop-home-product-canvas"
            camera={{ position: [4.7, 3.6, 6.2], fov: 34 }}
            dpr={[1, 1.5]}
            shadows
            fallback={<CssLaptopFallback />}
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
            <ambientLight intensity={1.5} />
            <directionalLight position={[4, 7, 5]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
            <pointLight position={[-4, 2, -3]} intensity={1.1} color="#b7cfb9" />
            <LaptopModel />
        </Canvas>
    );
}
