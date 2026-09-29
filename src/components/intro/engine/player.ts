/**
 * Procedural Character (Kid) & Skeletal Sine-Wave Animation Engine
 * 100% Code-Driven — Zero External 3D Models (No GLB)
 * Uses Three.js primitives with hierarchical joint pivots for fluid walk & idle cycles.
 */

import * as THREE from "three";
import { InputVector } from "./controls";
import { ProceduralAudio } from "./audio";

export class PlayerCharacter {
  public mesh: THREE.Group;
  public position: THREE.Vector3;

  private bodyGroup: THREE.Group;
  private headGroup: THREE.Group;
  private leftArmGroup: THREE.Group;
  private rightArmGroup: THREE.Group;
  private leftLegGroup: THREE.Group;
  private rightLegGroup: THREE.Group;
  private shadowMesh: THREE.Mesh;

  private walkCycle: number = 0;
  private idleTime: number = 0;
  private currentFacingAngle: number = 0;
  private speed: number = 3.6; // Units per second
  private lastStepSign: number = 1;

  // Materials & Geometries kept for complete disposal
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

  constructor(startPos: THREE.Vector3 = new THREE.Vector3(0, 0, 7.5)) {
    this.position = startPos.clone();
    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);

    // Color Palette matching DESIGN.md
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf5d0be,
      roughness: 0.8,
      metalness: 0.05,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x3d271d,
      roughness: 0.9,
    });
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0x136846, // Deep Emerald
      roughness: 0.6,
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x284435, // Dark Pine
      roughness: 0.8,
    });
    const shoesMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Soft off-white
      roughness: 0.5,
    });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0.6 });

    this.disposables.push(skinMat, hairMat, shirtMat, pantsMat, shoesMat, eyeMat, blushMat);

    // 1. Blob Shadow on ground
    const shadowGeo = new THREE.CircleGeometry(0.38, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x173827,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = 0.02;
    this.mesh.add(this.shadowMesh);
    this.disposables.push(shadowGeo, shadowMat);

    // 2. Upper Body Group (Torso + Head)
    this.bodyGroup = new THREE.Group();
    this.bodyGroup.position.y = 0.62;
    this.mesh.add(this.bodyGroup);

    // Torso (Sweater)
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.44, 16);
    const torsoMesh = new THREE.Mesh(torsoGeo, shirtMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.bodyGroup.add(torsoMesh);
    this.disposables.push(torsoGeo);

    // Collar detail
    const collarGeo = new THREE.TorusGeometry(0.14, 0.035, 8, 16);
    const collarMesh = new THREE.Mesh(collarGeo, shirtMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = 0.22;
    this.bodyGroup.add(collarMesh);
    this.disposables.push(collarGeo);

    // Head Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 0.38;
    this.bodyGroup.add(this.headGroup);

    // Head sphere
    const headGeo = new THREE.SphereGeometry(0.23, 20, 20);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);
    this.disposables.push(headGeo);

    // Hair cap
    const hairGeo = new THREE.SphereGeometry(0.245, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.rotation.x = -0.2;
    hairMesh.position.set(0, 0.03, -0.02);
    this.headGroup.add(hairMesh);
    this.disposables.push(hairGeo);

    // Cute stylized hair tuft in front
    const tuftGeo = new THREE.ConeGeometry(0.08, 0.16, 6);
    const tuftMesh = new THREE.Mesh(tuftGeo, hairMat);
    tuftMesh.rotation.z = 0.3;
    tuftMesh.rotation.x = 0.4;
    tuftMesh.position.set(0.08, 0.22, 0.14);
    this.headGroup.add(tuftMesh);
    this.disposables.push(tuftGeo);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.032, 10, 10);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.075, 0.02, 0.2);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.075, 0.02, 0.2);
    this.headGroup.add(leftEye, rightEye);
    this.disposables.push(eyeGeo);

    // Cheerful blush dots
    const blushGeo = new THREE.CircleGeometry(0.038, 12);
    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.11, -0.04, 0.19);
    leftBlush.rotation.y = -0.3;
    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.11, -0.04, 0.19);
    rightBlush.rotation.y = 0.3;
    this.headGroup.add(leftBlush, rightBlush);
    this.disposables.push(blushGeo);

    // 3. Arms (Pivoted at shoulders)
    const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.34, 10);
    const handGeo = new THREE.SphereGeometry(0.062, 10, 10);
    this.disposables.push(armGeo, handGeo);

    // Left Arm
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.3, 0.16, 0); // Shoulder pivot
    const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
    leftArmMesh.position.y = -0.16;
    leftArmMesh.castShadow = true;
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -0.33;
    this.leftArmGroup.add(leftArmMesh, leftHand);
    this.bodyGroup.add(this.leftArmGroup);

    // Right Arm
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.3, 0.16, 0); // Shoulder pivot
    const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
    rightArmMesh.position.y = -0.16;
    rightArmMesh.castShadow = true;
    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -0.33;
    this.rightArmGroup.add(rightArmMesh, rightHand);
    this.bodyGroup.add(this.rightArmGroup);

    // 4. Legs (Pivoted at hip)
    const legGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.38, 10);
    const shoeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.18);
    this.disposables.push(legGeo, shoeGeo);

    // Left Leg
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.12, 0.42, 0); // Hip pivot
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -0.18;
    leftLegMesh.castShadow = true;
    const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoe.position.set(0, -0.37, 0.04);
    leftShoe.castShadow = true;
    this.leftLegGroup.add(leftLegMesh, leftShoe);
    this.mesh.add(this.leftLegGroup);

    // Right Leg
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.12, 0.42, 0); // Hip pivot
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -0.18;
    rightLegMesh.castShadow = true;
    const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoe.position.set(0, -0.37, 0.04);
    rightShoe.castShadow = true;
    this.rightLegGroup.add(rightLegMesh, rightShoe);
    this.mesh.add(this.rightLegGroup);
  }

  /**
   * Update character physics, smooth rotation, and procedural walk/idle cycles
   */
  public update(delta: number, input: InputVector, audio?: ProceduralAudio | null) {
    if (input.isMoving) {
      this.walkCycle += delta * 9.5;

      // 1. Arm & Leg Pendulum Swing (Phase Inversion)
      const legAngle = Math.sin(this.walkCycle) * 0.7;
      const armAngle = -Math.sin(this.walkCycle) * 0.65;

      this.leftLegGroup.rotation.x = legAngle;
      this.rightLegGroup.rotation.x = -legAngle;

      this.leftArmGroup.rotation.x = armAngle;
      this.rightArmGroup.rotation.x = -armAngle;

      // Slight natural side flare
      this.leftArmGroup.rotation.z = 0.12 + Math.abs(Math.sin(this.walkCycle)) * 0.08;
      this.rightArmGroup.rotation.z = -0.12 - Math.abs(Math.sin(this.walkCycle)) * 0.08;

      // 2. Torso Vertical Bobbing (double frequency)
      const bob = Math.abs(Math.sin(this.walkCycle)) * 0.065;
      this.bodyGroup.position.y = 0.62 + bob;

      // 3. Head Follow-through
      this.headGroup.rotation.x = -Math.sin(this.walkCycle) * 0.06;
      this.headGroup.rotation.z = Math.sin(this.walkCycle * 0.5) * 0.04;

      // 4. Smooth Rotation Lerp towards Movement Direction
      const targetAngle = Math.atan2(input.x, input.z);
      // Shortest angle difference
      let diff = targetAngle - this.currentFacingAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.currentFacingAngle += diff * Math.min(1, delta * 14);
      this.mesh.rotation.y = this.currentFacingAngle;

      // 5. Audio footstep trigger
      const currentSign = Math.sin(this.walkCycle) >= 0 ? 1 : -1;
      if (currentSign !== this.lastStepSign) {
        this.lastStepSign = currentSign;
        if (audio) {
          audio.playStep();
        }
      }
    } else {
      // Idle Animation: Gracefully lerp limbs back to zero
      this.idleTime += delta * 2.2;

      this.leftLegGroup.rotation.x *= Math.max(0, 1 - delta * 10);
      this.rightLegGroup.rotation.x *= Math.max(0, 1 - delta * 10);
      this.leftArmGroup.rotation.x *= Math.max(0, 1 - delta * 10);
      this.rightArmGroup.rotation.x *= Math.max(0, 1 - delta * 10);

      this.leftArmGroup.rotation.z = 0.12;
      this.rightArmGroup.rotation.z = -0.12;

      // Subtle breathing on torso & head
      const breath = Math.sin(this.idleTime) * 0.018;
      this.bodyGroup.position.y = 0.62 + breath;
      this.bodyGroup.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);
      this.headGroup.rotation.x = Math.sin(this.idleTime * 0.8) * 0.025;
      this.headGroup.rotation.z = 0;
    }

    // Shadow follows character position smoothly
    this.shadowMesh.scale.setScalar(input.isMoving ? 1 - Math.abs(Math.sin(this.walkCycle)) * 0.15 : 1);
  }

  public getSpeed(): number {
    return this.speed;
  }

  public setPosition(pos: THREE.Vector3) {
    this.position.copy(pos);
    this.mesh.position.copy(pos);
  }

  public dispose() {
    this.disposables.forEach((item) => {
      try {
        item.dispose();
      } catch {}
    });
    this.disposables = [];
  }
}
