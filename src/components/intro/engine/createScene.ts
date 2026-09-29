/**
 * Scene, Camera & Lighting Setup for "Walk to the House" 3D Intro
 * Configures WebGLRenderer, cinematic camera follow, atmospheric soft mint fog, and calibrated lighting.
 */

import * as THREE from "three";

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  dirLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  dispose: () => void;
  updateCamera: (targetPos: THREE.Vector3, delta: number, isEnteringDoor?: boolean) => void;
}

export function createScene(canvas: HTMLCanvasElement): SceneContext {
  // 1. Scene with atmospheric soft mint fog
  const scene = new THREE.Scene();
  const skyColor = new THREE.Color(0xc6e0d2); // Soft Mint / Sage Green (matches --color-surface)
  scene.background = skyColor;
  scene.fog = new THREE.Fog(0xc6e0d2, 14, 36);

  // 2. Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    70
  );
  camera.position.set(0, 3.4, 12.5);

  // 3. Renderer with performance optimizations
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
    alpha: false,
    stencil: false,
  });

  // Cap pixel ratio to 2 for battery & high-DPI performance
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // 4. Lighting
  // Soft Hemisphere light (Sky soft blue, ground sage)
  const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xb8d8c6, 0.9);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  // Warm sunlight casting soft directional shadows
  const dirLight = new THREE.DirectionalLight(0xfffaea, 1.35);
  dirLight.position.set(8, 14, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 35;
  dirLight.shadow.camera.left = -9;
  dirLight.shadow.camera.right = 9;
  dirLight.shadow.camera.top = 9;
  dirLight.shadow.camera.bottom = -9;
  dirLight.shadow.bias = -0.0004;
  scene.add(dirLight);

  // Ambient fill
  const ambientLight = new THREE.AmbientLight(0xc6e0d2, 0.4);
  scene.add(ambientLight);

  // 5. Camera follow smoother
  const cameraOffset = new THREE.Vector3(0, 2.4, 4.8);
  const lookTarget = new THREE.Vector3(0, 1.0, 0);

  const updateCamera = (
    playerPos: THREE.Vector3,
    delta: number,
    isEnteringDoor: boolean = false
  ) => {
    if (isEnteringDoor) {
      // Zoom smoothly into the open doorway
      const doorwayTarget = new THREE.Vector3(0, 1.8, -7.5);
      camera.position.lerp(doorwayTarget, Math.min(1, delta * 3.0));
      lookTarget.lerp(new THREE.Vector3(0, 1.4, -9.0), Math.min(1, delta * 3.5));
      camera.lookAt(lookTarget);
    } else {
      // Standard smooth third-person follow
      const desiredPos = playerPos.clone().add(cameraOffset);
      // Soft damping
      camera.position.lerp(desiredPos, Math.min(1, delta * 5.5));

      const desiredLook = new THREE.Vector3(playerPos.x, playerPos.y + 0.85, playerPos.z - 0.5);
      lookTarget.lerp(desiredLook, Math.min(1, delta * 6.5));
      camera.lookAt(lookTarget);
    }
  };

  // 6. Dispose cleanup
  const dispose = () => {
    try {
      scene.remove(dirLight);
      scene.remove(hemiLight);
      scene.remove(ambientLight);
      dirLight.dispose();
      renderer.dispose();
    } catch (e) {
      console.warn("[createScene] Error during dispose:", e);
    }
  };

  return {
    scene,
    camera,
    renderer,
    dirLight,
    hemiLight,
    dispose,
    updateCamera,
  };
}
