/**
 * Controls Manager for "Walk to the House" 3D Intro
 * Supports Keyboard (WASD & Arrows) and Virtual D-pad (Touch / Mobile)
 */

export interface InputVector {
  x: number;
  z: number;
  isMoving: boolean;
}

export class ControlsManager {
  private keys: { [key: string]: boolean } = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  private dpadVector: { x: number; z: number } = { x: 0, z: 0 };
  private onFirstInteractionCallback: (() => void) | null = null;
  private hasInteracted: boolean = false;
  private isLocked: boolean = false;

  private onKeyDownBound: (e: KeyboardEvent) => void;
  private onKeyUpBound: (e: KeyboardEvent) => void;

  constructor(onFirstInteraction?: () => void) {
    this.onFirstInteractionCallback = onFirstInteraction || null;

    this.onKeyDownBound = this.handleKeyDown.bind(this);
    this.onKeyUpBound = this.handleKeyUp.bind(this);

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.onKeyDownBound, { passive: false });
      window.addEventListener("keyup", this.onKeyUpBound, { passive: true });
    }
  }

  private triggerFirstInteraction() {
    if (!this.hasInteracted) {
      this.hasInteracted = true;
      if (this.onFirstInteractionCallback) {
        this.onFirstInteractionCallback();
      }
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.isLocked) return;

    let recognized = false;

    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = true;
        recognized = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = true;
        recognized = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = true;
        recognized = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = true;
        recognized = true;
        break;
    }

    if (recognized) {
      this.triggerFirstInteraction();
      // Prevent default page scrolling when using arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = false;
        break;
    }
  }

  /**
   * Set D-Pad input from touch / on-screen buttons
   * @param x -1 (left), 1 (right), 0 (idle)
   * @param z -1 (forward/up), 1 (backward/down), 0 (idle)
   */
  public setDPad(x: number, z: number) {
    if (this.isLocked) return;
    this.dpadVector.x = x;
    this.dpadVector.z = z;

    if (x !== 0 || z !== 0) {
      this.triggerFirstInteraction();
    }
  }

  public getInput(): InputVector {
    if (this.isLocked) {
      return { x: 0, z: 0, isMoving: false };
    }

    let x = 0;
    let z = 0;

    // Keyboard contribution
    if (this.keys.forward) z -= 1;
    if (this.keys.backward) z += 1;
    if (this.keys.left) x -= 1;
    if (this.keys.right) x += 1;

    // D-pad contribution
    x += this.dpadVector.x;
    z += this.dpadVector.z;

    // Clamp and normalize
    x = Math.max(-1, Math.min(1, x));
    z = Math.max(-1, Math.min(1, z));

    const length = Math.sqrt(x * x + z * z);
    if (length > 0.001) {
      x /= Math.max(1, length);
      z /= Math.max(1, length);
      return { x, z, isMoving: true };
    }

    return { x: 0, z: 0, isMoving: false };
  }

  public lock() {
    this.isLocked = true;
    this.keys.forward = false;
    this.keys.backward = false;
    this.keys.left = false;
    this.keys.right = false;
    this.dpadVector = { x: 0, z: 0 };
  }

  public unlock() {
    this.isLocked = false;
  }

  public dispose() {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.onKeyDownBound);
      window.removeEventListener("keyup", this.onKeyUpBound);
    }
  }
}
