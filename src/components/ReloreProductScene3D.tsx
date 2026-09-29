import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, PresentationControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
import { loadScrollTrigger } from '../core/gsap';

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

function ProductRig({ scrollProgress, children }: { scrollProgress: React.MutableRefObject<number>; children: React.ReactNode }) {
    const rig = useRef<THREE.Group>(null);
    const reducedMotion = useRef(false);

    React.useEffect(() => {
        reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    useFrame((state, delta) => {
        if (!rig.current) return;
        const scrollTurn = scrollProgress.current * 2.1;
        const idleTurn = reducedMotion.current ? 0 : state.clock.elapsedTime * 0.12;
        rig.current.rotation.y = THREE.MathUtils.damp(
            rig.current.rotation.y,
            -0.27 + scrollTurn + idleTurn + state.pointer.x * 0.14,
            2.5,
            delta,
        );
        rig.current.rotation.x = THREE.MathUtils.damp(
            rig.current.rotation.x,
            0.1 + state.pointer.y * 0.12 + scrollProgress.current * 0.16,
            2.5,
            delta,
        );
    });

    return <group ref={rig}>{children}</group>;
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
    const applyRotationRef = useRef<() => void>(() => undefined);
    const scrollProgress = useRef(0);
    const pointerTilt = useRef({ x: 0, y: 0 });
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
            applyRotationRef.current();
            resize();
            setLoaded(true);
        }, undefined, () => setFailed(true));

        const hero = document.querySelector('.shop-home-hero');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let cancelled = false;
        let killScrollTrigger: (() => void) | undefined;
        if (hero && !reducedMotion) {
            void loadScrollTrigger().then(({ ScrollTrigger }) => {
                if (cancelled) return;
                const trigger = ScrollTrigger.create({
                    trigger: hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.7,
                    onUpdate: self => {
                        scrollProgress.current = self.progress;
                        applyRotationRef.current();
                    },
                });
                killScrollTrigger = () => trigger.kill();
            });
        }

        applyRotationRef.current = () => {
            if (!modelRef.current) return;
            modelRef.current.rotation.x = 0.1 + pointerTilt.current.x + scrollProgress.current * 0.16;
            modelRef.current.rotation.y = -0.27 + pointerTilt.current.y + scrollProgress.current * 2.1;
            renderRef.current();
        };

        return () => {
            cancelled = true;
            killScrollTrigger?.();
            observer.disconnect();
            draco.dispose();
            renderRef.current = () => undefined;
            renderer.domElement.remove();
        };
    }, []);

    const rotateModel = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!modelRef.current) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerTilt.current.x = ((event.clientY - bounds.top) / bounds.height - 0.5) * -0.34;
        pointerTilt.current.y = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.8;
        applyRotationRef.current();
    };

    return (
        <div className="shop-home-svg-fallback" onPointerMove={rotateModel} onPointerLeave={() => {
            pointerTilt.current = { x: 0, y: 0 };
            applyRotationRef.current();
        }}>
            <div ref={mount} className="shop-home-svg-mount" />
            {!loaded && !failed && <div className="shop-home-stage-loading">Loading the MacBook 3D model…</div>}
            {failed && <CssLaptopFallback />}
        </div>
    );
}

export default function ReloreProductScene3D() {
    const scrollProgress = useRef(0);
    const [reducedMotion, setReducedMotion] = useState(false);

    React.useEffect(() => {
        setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    React.useEffect(() => {
        const hero = document.querySelector('.shop-home-hero');
        if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let cancelled = false;
        let killScrollTrigger: (() => void) | undefined;
        void loadScrollTrigger().then(({ ScrollTrigger }) => {
            if (cancelled) return;
            const trigger = ScrollTrigger.create({
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.7,
                onUpdate: self => { scrollProgress.current = self.progress; },
            });
            killScrollTrigger = () => trigger.kill();
        });
        return () => { cancelled = true; killScrollTrigger?.(); };
    }, []);

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
                <ProductRig scrollProgress={scrollProgress}>
                    <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.07} floatIntensity={reducedMotion ? 0 : 0.16}>
                        <MacbookModel />
                    </Float>
                </ProductRig>
            </PresentationControls>
        </Canvas>
    );
}

useGLTF.preload(MODEL_PATH, '/draco/gltf/');
