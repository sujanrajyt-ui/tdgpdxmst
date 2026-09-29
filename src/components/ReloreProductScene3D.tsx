import React, { useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, Lightformer, PresentationControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';

const MODEL_PATH = '/models/macbook-16-transformed.glb';

function MacbookModel() {
    const { scene } = useGLTF(MODEL_PATH, '/draco/gltf/');
    const model = useMemo(() => {
        const copy = scene.clone(true);
        copy.traverse(object => {
            if (!(object instanceof THREE.Mesh)) return;
            object.castShadow = true;
            object.receiveShadow = true;
            if (Array.isArray(object.material)) {
                object.material = object.material.map(material => material.clone());
            } else {
                object.material = object.material.clone();
            }
        });
        return copy;
    }, [scene]);

    return <primitive object={model} position={[0, -0.3, 0]} rotation={[Math.PI / 2, Math.PI, 0]} scale={0.06} dispose={null} />;
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

function SvgLaptopFallback() {
    const mount = useRef<HTMLDivElement>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const renderRef = useRef<() => void>(() => undefined);
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    React.useEffect(() => {
        const container = mount.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(47, 1, 0.1, 100);
        camera.position.set(0, 1.8, 5.2);
        camera.lookAt(0, 0, 0);
        scene.add(new THREE.AmbientLight('#ffffff', 2.1));
        const keyLight = new THREE.DirectionalLight('#ffffff', 2.8);
        keyLight.position.set(-3, 6, 5);
        scene.add(keyLight);

        const renderer = new SVGRenderer();
        renderer.setQuality('high');
        renderer.setClearColor(new THREE.Color('#ffffff'), 0);
        const resize = () => {
            const width = Math.max(1, container.clientWidth);
            const height = Math.max(1, container.clientHeight);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            if (modelRef.current) renderer.render(scene, camera);
        };
        renderRef.current = () => renderer.render(scene, camera);
        container.appendChild(renderer.domElement);
        const observer = new ResizeObserver(resize);
        observer.observe(container);
        resize();

        const draco = new DRACOLoader();
        draco.setDecoderPath('/draco/gltf/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);
        loader.load(MODEL_PATH, ({ scene: source }) => {
            const laptop = source.clone(true);
            laptop.rotation.x = Math.PI / 2;
            laptop.rotation.y = Math.PI;
            laptop.position.y = -0.3;
            laptop.scale.setScalar(0.06);
            laptop.traverse(object => {
                if (!(object instanceof THREE.Mesh)) return;
                object.material = Array.isArray(object.material)
                    ? object.material.map(material => material.clone())
                    : object.material.clone();
            });

            const model = new THREE.Group();
            model.rotation.set(0.1, -0.27, 0);
            model.add(laptop);
            modelRef.current = model;
            scene.add(model);
            resize();
            setLoaded(true);
        }, undefined, () => setFailed(true));

        return () => {
            observer.disconnect();
            draco.dispose();
            renderRef.current = () => undefined;
            renderer.domElement.remove();
        };
    }, []);

    const rotateModel = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!modelRef.current) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        modelRef.current.rotation.x = 0.1 + ((event.clientY - bounds.top) / bounds.height - 0.5) * -0.34;
        modelRef.current.rotation.y = -0.27 + ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.8;
        renderRef.current();
    };

    return (
        <div className="shop-home-svg-fallback" onPointerMove={rotateModel} onPointerLeave={() => {
            if (modelRef.current) modelRef.current.rotation.set(0.1, -0.27, 0);
            renderRef.current();
        }}>
            <div ref={mount} className="shop-home-svg-mount" />
            {!loaded && !failed && <div className="shop-home-stage-loading">Loading the MacBook 3D model…</div>}
            {failed && <CssLaptopFallback />}
        </div>
    );
}

export default function ReloreProductScene3D() {
    return (
        <Canvas
            className="shop-home-product-canvas"
            camera={{ position: [0, 1.9, 5], fov: 50, near: 0.1, far: 100 }}
            dpr={[1, 1.5]}
            shadows
            fallback={<SvgLaptopFallback />}
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
            <ambientLight intensity={0.7} />
            <directionalLight position={[-2, 10, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
            <spotLight position={[0, 8, 5]} angle={0.28} penumbra={0.7} intensity={2.4} />
            <Environment resolution={128}>
                <Lightformer form="rect" intensity={4} position={[-5, 3, -2]} scale={6} />
                <Lightformer form="rect" intensity={3} position={[5, 1, 2]} scale={5} />
            </Environment>
            <PresentationControls global snap={false} speed={1} zoom={1} rotation={[0.04, -0.2, 0]} polar={[-0.18, 0.18]} azimuth={[-0.75, 0.75]} config={{ mass: 1, tension: 170, friction: 26 }}>
                <Float speed={1.2} rotationIntensity={0.07} floatIntensity={0.16}>
                    <MacbookModel />
                </Float>
            </PresentationControls>
        </Canvas>
    );
}

useGLTF.preload(MODEL_PATH, '/draco/gltf/');
