"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { AnimationMixer, Group, Material, Mesh, Object3D, Texture, WebGLRenderer } from "three";

const MODEL_PATH = "/assets/models/lex-character.glb?v=20260705-18mb";
const HEAD_NODE_PATTERN = /head|neck|face|skull|mixamorigHead|mixamorigNeck|头|頭|颈|頸/i;

type LoadState = "idle" | "ready" | "error";

function disposeObject(root: Object3D, renderer: WebGLRenderer) {
  root.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.isMesh) return;

    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      const record = material as Material & Record<string, Texture | unknown>;
      Object.values(record).forEach((value) => {
        if (value && typeof value === "object" && "isTexture" in value) {
          (value as Texture).dispose();
        }
      });
      material.dispose();
    });
  });

  renderer.dispose();
}

function findHeadTarget(root: Object3D): Object3D | null {
  let target: Object3D | null = null;
  root.traverse((node) => {
    if (!target && HEAD_NODE_PATTERN.test(node.name)) target = node;
  });
  return target;
}

export function LexCharacterCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<LoadState>("idle");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const mountElement = mount;

    let disposed = false;
    let frameId = 0;
    let mixer: AnimationMixer | null = null;
    let model: Group | null = null;
    let renderer: WebGLRenderer | null = null;
    const pointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };
    const scrollTone = { value: 0 };
    let isPageVisible = true;
    let needsRender = true;

    const handlePointer = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
      needsRender = true;
    };

    const handleScroll = () => {
      const progress = Math.min(1, window.scrollY / Math.max(window.innerHeight, 1));
      scrollTone.value = progress;
      needsRender = true;
    };

    const handleVisibility = () => {
      isPageVisible = document.visibilityState === "visible";
      needsRender = true;
    };

    async function init() {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      if (disposed) return;
      const isCompact = window.innerWidth < 640;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(15, 1, 0.1, 100);
      camera.position.set(0, isCompact ? 0.08 : 0.04, isCompact ? 10.8 : 11.4);

      const maxPixelRatio = isCompact ? 1.15 : 1.45;
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isCompact && window.devicePixelRatio < 2,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      mountElement.appendChild(renderer.domElement);

      const ambient = new THREE.HemisphereLight(0xffffff, 0x27163f, 2.4);
      const key = new THREE.DirectionalLight(0xf7f1ff, 3.8);
      const cyan = new THREE.DirectionalLight(0x4cecff, 2.6);
      const violet = new THREE.DirectionalLight(0xc29cff, 3.2);
      key.position.set(2.5, 4, 5);
      cyan.position.set(-4, 2.5, 2);
      violet.position.set(4, 1.4, -2);
      scene.add(ambient, key, cyan, violet);

      const resize = () => {
        const rect = mountElement.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        renderer?.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();

      const gltf = await new GLTFLoader().loadAsync(MODEL_PATH);
      if (disposed) {
        if (renderer) disposeObject(gltf.scene, renderer);
        return;
      }

      model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      const scale = (isCompact ? 1.9 : 1.82) / Math.max(size.y, 1);
      model.scale.setScalar(scale);
      model.position.x = isCompact ? -0.02 : -0.08;
      model.position.y = isCompact ? -0.02 : -0.04;
      model.rotation.set(0.02, 0.06, 0);
      scene.add(model);
      const headTarget = findHeadTarget(model);

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const clip =
          gltf.animations.find((item) => /idle|breath|blink/i.test(item.name)) ??
          gltf.animations[0];
        const action = mixer.clipAction(clip);
        action.enabled = true;
        action.play();
      }

      let lastTime = performance.now();
      let elapsed = 0;
      const baseRotation = { x: model.rotation.x, y: model.rotation.y };
      const baseLookRotation = headTarget
        ? { x: headTarget.rotation.x, y: headTarget.rotation.y }
        : null;
      const basePosition = { y: model.position.y };
      const targetFrameMs = isCompact ? 1000 / 24 : 1000 / 30;
      setState("ready");

      const tick = (now = performance.now()) => {
        frameId = window.requestAnimationFrame(tick);
        if (!isPageVisible) {
          lastTime = now;
          return;
        }

        if (now - lastTime < targetFrameMs && !needsRender) return;
        const delta = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        elapsed += delta;
        mixer?.update(delta);

        if (model && !reduceMotion) {
          currentPointer.x = THREE.MathUtils.lerp(currentPointer.x, pointer.x, 0.12);
          currentPointer.y = THREE.MathUtils.lerp(currentPointer.y, pointer.y, 0.11);
          const pageDepth = THREE.MathUtils.lerp(1, 0.75, scrollTone.value);
          if (headTarget && baseLookRotation) {
            headTarget.rotation.y = THREE.MathUtils.lerp(
              headTarget.rotation.y,
              baseLookRotation.y + currentPointer.x * 0.85,
              0.1,
            );
            headTarget.rotation.x = THREE.MathUtils.lerp(
              headTarget.rotation.x,
              baseLookRotation.x - currentPointer.y * 0.22,
              0.1,
            );
            model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, baseRotation.y + currentPointer.x * 0.14 * pageDepth, 0.045);
          } else {
            model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, baseRotation.y + currentPointer.x * 0.72 * pageDepth, 0.08);
            model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, baseRotation.x - currentPointer.y * 0.14 * pageDepth, 0.07);
          }
          model.position.y = basePosition.y + Math.sin(elapsed * 1.2) * 0.025;
        }

        renderer?.render(scene, camera);
        needsRender = false;
      };

      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", handlePointer);
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("visibilitychange", handleVisibility);
      handleScroll();
      tick();

      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", handlePointer);
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }

    let cleanup: (() => void) | undefined;
    init()
      .then((disposeListeners) => {
        cleanup = disposeListeners;
      })
      .catch(() => {
        if (!disposed) setState("error");
      });

    return () => {
      disposed = true;
      cleanup?.();
      if (frameId) window.cancelAnimationFrame(frameId);
      if (model && renderer) disposeObject(model, renderer);
      if (mountElement.firstChild) {
        const canvas = mountElement.firstChild;
        mountElement.removeChild(canvas);
      }
    };
  }, [reduceMotion]);

  return (
    <div
      ref={mountRef}
      className={`lex-character-canvas lex-character-canvas--${state}`}
      aria-hidden
    />
  );
}
