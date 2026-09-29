/**
 * Transition Controller for "Walk to the House" 3D Intro
 * Orchestrates door opening, auto-walk through the door, camera cinematic zoom, and fade-to-portfolio
 */

import * as THREE from "three";
import { HouseStructure } from "./house";
import { PlayerCharacter } from "./player";
import { ProceduralAudio } from "./audio";

export interface TransitionState {
  isTriggered: boolean;
  isComplete: boolean;
  fadeOpacity: number; // 0 (clear) to 1 (full white/warm glow)
}

export class TransitionController {
  private isTriggered: boolean = false;
  private isComplete: boolean = false;
  private timer: number = 0;
  private fadeOpacity: number = 0;
  private onCompleteCallback: () => void;

  constructor(onComplete: () => void) {
    this.onCompleteCallback = onComplete;
  }

  public trigger(house: HouseStructure, audio?: ProceduralAudio | null) {
    if (this.isTriggered) return;
    this.isTriggered = true;

    // 1. Play warm chime / door open sound
    if (audio) {
      audio.playDoorOpen();
      // Begin gentle audio fade out
      audio.fadeOutAndStop(2.0);
    }

    // 2. Open the house door
    house.openDoor();
  }

  public update(
    delta: number,
    player: PlayerCharacter
  ): TransitionState {
    if (!this.isTriggered) {
      return { isTriggered: false, isComplete: false, fadeOpacity: 0 };
    }

    this.timer += delta;

    // Step the character forward into the warm doorway
    const currentPos = player.position;
    if (currentPos.z > -6.8) {
      const stepDelta = delta * 1.6;
      player.setPosition(new THREE.Vector3(
        THREE.MathUtils.lerp(currentPos.x, 0, delta * 3),
        currentPos.y,
        currentPos.z - stepDelta
      ));
      // Keep walk cycle moving gently
      player.update(delta, { x: 0, z: -1, isMoving: true });
    } else {
      player.update(delta, { x: 0, z: 0, isMoving: false });
    }

    // After 1.2s, start white/warm fade ramp up
    if (this.timer > 1.0) {
      this.fadeOpacity = Math.min(1, (this.timer - 1.0) / 1.1);
    }

    // Transition complete after ~2.4 seconds
    if (this.timer >= 2.3 && !this.isComplete) {
      this.isComplete = true;
      this.onCompleteCallback();
    }

    return {
      isTriggered: true,
      isComplete: this.isComplete,
      fadeOpacity: this.fadeOpacity,
    };
  }

  public getFadeOpacity(): number {
    return this.fadeOpacity;
  }

  public isActive(): boolean {
    return this.isTriggered && !this.isComplete;
  }
}
