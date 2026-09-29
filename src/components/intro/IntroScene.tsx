"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useIntro } from "./IntroProvider";
import { createScene, SceneContext } from "./engine/createScene";
import { PlayerCharacter } from "./engine/player";
import { HouseStructure } from "./engine/house";
import { WorldEnvironment } from "./engine/world";
import { CollisionSystem } from "./engine/collision";
import { ControlsManager } from "./engine/controls";
import { ProceduralAudio } from "./engine/audio";
import { TransitionController } from "./engine/transition";
import SkipButton from "./ui/SkipButton";
import MuteButton from "./ui/MuteButton";
import DPad from "./ui/DPad";
import LoadingOverlay from "./ui/LoadingOverlay";

export default function IntroScene() {
  const { introStatus, skipIntro, completeIntro, isAudioMuted, setIsAudioMuted } = useIntro();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const [fadeOpacity, setFadeOpacity] = useState<number>(0);

  // References to engine instances
  const audioRef = useRef<ProceduralAudio | null>(null);
  const controlsRef = useRef<ControlsManager | null>(null);
  const initialMutedRef = useRef(isAudioMuted);

  // Sync mute state changes to audio engine without restarting Three.js scene
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.setMuted(isAudioMuted);
    }
  }, [isAudioMuted]);

  // Lock body scroll while 3D intro is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Only render if playing or transitioning
  const shouldRender = introStatus === "playing" || introStatus === "transitioning";

  useEffect(() => {
    if (!shouldRender || !canvasRef.current) return;

    const canvas = canvasRef.current;
    let animFrameId: number;
    let isDisposed = false;

    // 1. Audio instance
    const audio = new ProceduralAudio();
    audio.setMuted(initialMutedRef.current);
    audioRef.current = audio;

    // 2. Controls instance
    const controls = new ControlsManager(() => {
      // Audio starts on first user input (WASD or Touch)
      audio.start();
      setHasMoved(true);
    });
    controlsRef.current = controls;

    // 3. Collision System
    const collision = new CollisionSystem();

    // 4. Three.js Scene Setup
    const sceneContext: SceneContext = createScene(canvas);
    const { scene, camera, renderer, updateCamera } = sceneContext;

    // 5. World Environment (Grass, Path, Trees, Fences, Flowers, Rocks, Signpost)
    const world = new WorldEnvironment();
    scene.add(world.mesh);

    // 6. House Structure with animated door
    const house = new HouseStructure(new THREE.Vector3(0, 0, -8.2));
    scene.add(house.mesh);

    // 7. Player Character
    const startPosition = new THREE.Vector3(0, 0, 7.5);
    const player = new PlayerCharacter(startPosition);
    scene.add(player.mesh);

    // 8. Transition Controller
    const transition = new TransitionController(() => {
      // Callback when walk-through is finished
      completeIntro();
    });

    // Handle window resize
    const handleResize = () => {
      if (!canvas || isDisposed) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Mark scene loaded
    setIsLoading(false);

    // Animation Loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (isDisposed) return;

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Only update if tab is visible
      if (!document.hidden) {
        // 1. Read movement input
        const input = controls.getInput();
        if (input.isMoving) {
          setHasMoved((prev) => (prev ? prev : true));
        }

        // 2. Resolve physics & movement if not currently locked in transition
        if (!transition.isActive()) {
          const moveSpeed = player.getSpeed();
          const desiredPos = player.position.clone().add(
            new THREE.Vector3(input.x * moveSpeed * delta, 0, input.z * moveSpeed * delta)
          );

          const allowedPos = collision.resolveMovement(player.position, desiredPos, 0.35);
          player.setPosition(allowedPos);

          // Update character limb animations
          player.update(delta, input, audio);

          // Check if entered front door trigger zone
          if (collision.isAtDoorTrigger(player.position)) {
            controls.lock();
            transition.trigger(house, audio);
          }
        }

        // 3. Update transition sequence if active
        const transState = transition.update(delta, player);
        if (transState.isTriggered) {
          setFadeOpacity(transState.fadeOpacity);
        }

        // 4. Update house door swing animation
        house.update(delta);

        // 5. Update camera follow
        updateCamera(player.position, delta, transState.isTriggered);

        // 6. Render frame
        renderer.render(scene, camera);
      }

      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);

    // Cleanup lifecycle
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);

      controls.dispose();
      audio.dispose();
      player.dispose();
      house.dispose();
      world.dispose();
      sceneContext.dispose();

      audioRef.current = null;
      controlsRef.current = null;
    };
  }, [shouldRender, completeIntro]);

  // Audio mute toggle handler
  const handleToggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.setMuted(nextMuted);
    }
  };

  // D-Pad direction change handler for mobile
  const handleDPadChange = (x: number, z: number) => {
    if (controlsRef.current) {
      controlsRef.current.setDPad(x, z);
    }
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden bg-[#C6E0D2] select-none"
      style={{ touchAction: "none" }}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Top Bar Controls (Skip & Mute) */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-3">
        <MuteButton isMuted={isAudioMuted} onToggle={handleToggleMute} />
        <SkipButton onSkip={skipIntro} />
      </div>

      {/* Atmospheric Branding Title (Top Left) */}
      <div className="absolute top-6 left-6 z-30 pointer-events-none select-none">
        <span className="inline-block px-4 py-2 rounded-full bg-[#C6E0D2]/90 backdrop-blur-sm shadow-[4px_4px_10px_rgba(150,175,161,0.7),-4px_-4px_10px_rgba(255,255,255,0.8)] border border-white/40 text-xs font-poppins font-bold text-[#284435] tracking-wide">
          Walk to the House
        </span>
      </div>

      {/* Controls Hint Banner (Fades out once character moves) */}
      {!hasMoved && !isLoading && (
        <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center px-4 max-w-sm sm:max-w-md animate-bounce duration-1000">
          <div className="inline-block px-5 py-3 rounded-2xl bg-[#C6E0D2]/95 backdrop-blur-md shadow-[8px_8px_18px_rgba(150,175,161,0.8),-8px_-8px_18px_rgba(255,255,255,0.95)] border border-white/50">
            <p className="font-poppins font-semibold text-xs sm:text-sm text-[#284435]">
              <span className="hidden md:inline">Gunakan tombol <strong>W, A, S, D</strong> atau <strong>Panah</strong></span>
              <span className="md:hidden">Gunakan tombol arah di layar</span> untuk berjalan ke rumah 🏡
            </p>
          </div>
        </div>
      )}

      {/* Mobile On-Screen D-Pad */}
      <DPad onDirectionChange={handleDPadChange} />

      {/* Screen Fade Overlay (Fade to warm white when entering the doorway) */}
      <div
        className="absolute inset-0 bg-[#F5FBF7] pointer-events-none transition-opacity duration-150 ease-out z-50"
        style={{ opacity: fadeOpacity }}
      />
    </div>
  );
}
