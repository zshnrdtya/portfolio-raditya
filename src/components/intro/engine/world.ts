/**
 * Procedural Stylized World Environment
 * 100% Code-Driven
 * Creates the grass yard, stone walkway, perimeter picket fences, trees, flowers, rocks, and the Z-Project signpost.
 */

import * as THREE from 'three';
import { createSignpost } from './signpost';
import { createTrees, createRocksAndFlowers } from './foliage';

interface FallingLeaf {
  mesh: THREE.Mesh;
  fallSpeed: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  swayFreq: number;
  swayAmp: number;
  phase: number;
}

export class WorldEnvironment {
  public mesh: THREE.Group;
  private leaves: FallingLeaf[] = [];
  private leafTime: number = 0;
  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  constructor() {
    this.mesh = new THREE.Group();

    // 1. Materials
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0xb5dac5,
      roughness: 0.9,
      metalness: 0.05,
    });
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xd4e2da,
      roughness: 0.85,
    });
    const pathDarkMat = new THREE.MeshStandardMaterial({
      color: 0xc1d5cb,
      roughness: 0.9,
    });
    const fenceMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.7,
    });
    const woodPostMat = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.8,
    });
    const treeFoliageMat1 = new THREE.MeshStandardMaterial({
      color: 0x136846,
      roughness: 0.75,
      flatShading: true,
    });
    const treeFoliageMat2 = new THREE.MeshStandardMaterial({
      color: 0x1b7d56,
      roughness: 0.75,
      flatShading: true,
    });
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x889890,
      roughness: 0.95,
      flatShading: true,
    });
    const flowerPetalMat1 = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const flowerPetalMat2 = new THREE.MeshBasicMaterial({ color: 0xfb7185 });

    this.disposables.push(
      grassMat, pathMat, pathDarkMat, fenceMat, woodPostMat,
      treeFoliageMat1, treeFoliageMat2, rockMat, flowerPetalMat1, flowerPetalMat2
    );

    // 2. Main Ground Plane
    const groundGeo = new THREE.PlaneGeometry(36, 44, 24, 24);
    const ground = new THREE.Mesh(groundGeo, grassMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.mesh.add(ground);
    this.disposables.push(groundGeo);

    // 3. Garden Stone Path leading to House (from z = 8.8 down to z = -5.5)
    const steppingStoneGeo = new THREE.BoxGeometry(0.7, 0.05, 0.45);
    this.disposables.push(steppingStoneGeo);

    for (let z = 8.5; z >= -5.2; z -= 0.68) {
      const jitterX = Math.sin(z * 1.8) * 0.12;
      const isLeft = Math.cos(z * 3) > 0;
      const stone = new THREE.Mesh(steppingStoneGeo, isLeft ? pathMat : pathDarkMat);
      stone.position.set(jitterX + (isLeft ? -0.22 : 0.22), 0.03, z);
      stone.rotation.y = Math.sin(z * 4) * 0.15;
      stone.receiveShadow = true;
      this.mesh.add(stone);
    }

    // 4. Low-Poly Trees
    const trees = createTrees(woodPostMat, treeFoliageMat1, treeFoliageMat2);
    this.mesh.add(trees.group);
    this.disposables.push(...trees.disposables);

    // 5. White Picket Fences
    const picketGeo = new THREE.BoxGeometry(0.1, 0.9, 0.04);
    const railGeo = new THREE.BoxGeometry(0.06, 0.06, 1.0);
    this.disposables.push(picketGeo, railGeo);

    for (let z = -7.5; z <= 8.5; z += 0.45) {
      const picketLeft = new THREE.Mesh(picketGeo, fenceMat);
      picketLeft.position.set(-5.6, 0.45, z);
      picketLeft.castShadow = true;
      this.mesh.add(picketLeft);

      const picketRight = new THREE.Mesh(picketGeo, fenceMat);
      picketRight.position.set(5.6, 0.45, z);
      picketRight.castShadow = true;
      this.mesh.add(picketRight);
    }

    const frontPicketGeo = new THREE.BoxGeometry(0.04, 0.9, 0.1);
    this.disposables.push(frontPicketGeo);
    for (let x = -5.6; x <= -1.4; x += 0.45) {
      const picket = new THREE.Mesh(frontPicketGeo, fenceMat);
      picket.position.set(x, 0.45, 8.8);
      picket.castShadow = true;
      this.mesh.add(picket);
    }
    for (let x = 1.4; x <= 5.6; x += 0.45) {
      const picket = new THREE.Mesh(frontPicketGeo, fenceMat);
      picket.position.set(x, 0.45, 8.8);
      picket.castShadow = true;
      this.mesh.add(picket);
    }

    // 6 & 7. Rocks & Wildflowers
    const rocksFlowers = createRocksAndFlowers(rockMat, treeFoliageMat1, flowerPetalMat1, flowerPetalMat2);
    this.mesh.add(rocksFlowers.group);
    this.disposables.push(...rocksFlowers.disposables);

    // 8. Signpost Plaque
    const signpost = createSignpost();
    this.mesh.add(signpost.group);
    this.disposables.push(...signpost.disposables);

    // 9. Floating / Falling Autumn Leaves in yard
    const leafGeo = new THREE.PlaneGeometry(0.12, 0.16);
    this.disposables.push(leafGeo);

    const leafMats = [0x86b29b, 0xcd7f32, 0xdf9b28].map((color) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.8,
        side: THREE.DoubleSide,
      });
      this.disposables.push(mat);
      return mat;
    });

    for (let i = 0; i < 16; i++) {
      const leafMesh = new THREE.Mesh(leafGeo, leafMats[i % leafMats.length]);
      const x = ((i % 8) - 3.5) * 1.1 + (i % 2 === 0 ? 0.4 : -0.4);
      const y = 0.5 + ((i * 0.28) % 3.8);
      const z = -6.0 + (i * 0.95);

      leafMesh.position.set(x, y, z);
      leafMesh.rotation.set((i * 0.4) % Math.PI, (i * 0.7) % Math.PI, (i * 0.5) % Math.PI);
      this.mesh.add(leafMesh);

      this.leaves.push({
        mesh: leafMesh,
        fallSpeed: 0.32 + (i % 4) * 0.07,
        rotSpeedX: 1.0 + (i % 3) * 0.4,
        rotSpeedY: 0.8 + (i % 2) * 0.5,
        rotSpeedZ: 0.9 + (i % 4) * 0.3,
        swayFreq: 1.4 + (i % 3) * 0.3,
        swayAmp: 0.22 + (i % 2) * 0.08,
        phase: (i * Math.PI) / 8,
      });
    }
  }

  public update(delta: number) {
    this.leafTime += delta;

    for (let i = 0; i < this.leaves.length; i++) {
      const leaf = this.leaves[i];
      leaf.mesh.position.y -= delta * leaf.fallSpeed;

      const sway = Math.sin(this.leafTime * leaf.swayFreq + leaf.phase) * leaf.swayAmp * delta;
      leaf.mesh.position.x += sway;
      leaf.mesh.position.z += sway * 0.35;

      leaf.mesh.rotation.x += delta * leaf.rotSpeedX;
      leaf.mesh.rotation.y += delta * leaf.rotSpeedY;
      leaf.mesh.rotation.z += delta * leaf.rotSpeedZ;

      if (leaf.mesh.position.y <= 0.05) {
        leaf.mesh.position.y = 3.6 + (i % 4) * 0.35;
        leaf.mesh.position.x = ((i % 7) - 3) * 1.15;
        leaf.mesh.position.z = -6.2 + (i * 0.9) % 14.0;
      }
    }
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
