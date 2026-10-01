/**
 * Procedural Stylized World Environment
 * 100% Code-Driven — Zero External Assets
 * Creates the grass yard, stone walkway, perimeter picket fences, low-poly pine trees, flowers, rocks, and the Z-Project signpost.
 */

import * as THREE from "three";

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
      color: 0xb5dac5, // Soft Mint Sage Grass
      roughness: 0.9,
      metalness: 0.05,
    });
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xd4e2da, // Light limestone cobblestone
      roughness: 0.85,
    });
    const pathDarkMat = new THREE.MeshStandardMaterial({
      color: 0xc1d5cb,
      roughness: 0.9,
    });
    const fenceMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Clean white picket fence
      roughness: 0.7,
    });
    const woodPostMat = new THREE.MeshStandardMaterial({
      color: 0x5c4033, // Earthy brown timber
      roughness: 0.8,
    });
    const treeFoliageMat1 = new THREE.MeshStandardMaterial({
      color: 0x136846, // Deep Emerald
      roughness: 0.75,
      flatShading: true,
    });
    const treeFoliageMat2 = new THREE.MeshStandardMaterial({
      color: 0x1b7d56, // Lush Forest Green
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
    const flowerCenterMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    this.disposables.push(
      grassMat,
      pathMat,
      pathDarkMat,
      fenceMat,
      woodPostMat,
      treeFoliageMat1,
      treeFoliageMat2,
      rockMat,
      flowerPetalMat1,
      flowerPetalMat2,
      flowerCenterMat
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
      // Gentle natural offset
      const jitterX = Math.sin(z * 1.8) * 0.12;
      const isLeft = Math.cos(z * 3) > 0;
      const stone = new THREE.Mesh(steppingStoneGeo, isLeft ? pathMat : pathDarkMat);
      stone.position.set(jitterX + (isLeft ? -0.22 : 0.22), 0.03, z);
      stone.rotation.y = Math.sin(z * 4) * 0.15;
      stone.receiveShadow = true;
      this.mesh.add(stone);
    }

    // 4. Low-Poly Trees along the perimeter
    const treePositions = [
      { x: -4.5, z: 6.5, scale: 1.1, mat: treeFoliageMat1 },
      { x: -4.8, z: 2.2, scale: 1.3, mat: treeFoliageMat2 },
      { x: -4.2, z: -2.0, scale: 1.0, mat: treeFoliageMat1 },
      { x: -5.0, z: -5.8, scale: 1.4, mat: treeFoliageMat2 },
      { x: 4.6, z: 6.0, scale: 1.0, mat: treeFoliageMat2 },
      { x: 4.8, z: 2.8, scale: 1.25, mat: treeFoliageMat1 },
      { x: 4.4, z: -1.8, scale: 1.15, mat: treeFoliageMat2 },
      { x: 5.0, z: -6.2, scale: 1.35, mat: treeFoliageMat1 },
    ];

    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.26, 1.4, 8);
    const cone1Geo = new THREE.ConeGeometry(1.3, 1.8, 7);
    const cone2Geo = new THREE.ConeGeometry(1.0, 1.5, 7);
    const cone3Geo = new THREE.ConeGeometry(0.7, 1.2, 7);
    this.disposables.push(trunkGeo, cone1Geo, cone2Geo, cone3Geo);

    treePositions.forEach((tp) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tp.x, 0, tp.z);
      treeGroup.scale.setScalar(tp.scale);

      const trunk = new THREE.Mesh(trunkGeo, woodPostMat);
      trunk.position.y = 0.7;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);

      const cone1 = new THREE.Mesh(cone1Geo, tp.mat);
      cone1.position.y = 1.7;
      cone1.castShadow = true;

      const cone2 = new THREE.Mesh(cone2Geo, tp.mat);
      cone2.position.y = 2.5;
      cone2.castShadow = true;

      const cone3 = new THREE.Mesh(cone3Geo, tp.mat);
      cone3.position.y = 3.2;
      cone3.castShadow = true;

      treeGroup.add(cone1, cone2, cone3);
      this.mesh.add(treeGroup);
    });

    // 5. White Picket Fences
    const picketGeo = new THREE.BoxGeometry(0.1, 0.9, 0.04);
    const railGeo = new THREE.BoxGeometry(0.06, 0.06, 1.0);
    this.disposables.push(picketGeo, railGeo);

    // Left fence line
    for (let z = -7.5; z <= 8.5; z += 0.45) {
      const picket = new THREE.Mesh(picketGeo, fenceMat);
      picket.position.set(-5.6, 0.45, z);
      picket.castShadow = true;
      this.mesh.add(picket);
    }
    // Right fence line
    for (let z = -7.5; z <= 8.5; z += 0.45) {
      const picket = new THREE.Mesh(picketGeo, fenceMat);
      picket.position.set(5.6, 0.45, z);
      picket.castShadow = true;
      this.mesh.add(picket);
    }

    // Front yard fence with entrance opening in the center (gap between -1.4 and 1.4)
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

    // 6. Natural Garden Rocks along the yard
    const rockGeo = new THREE.DodecahedronGeometry(0.24, 0);
    this.disposables.push(rockGeo);

    const rockCoords = [
      { x: -1.2, z: 5.5, s: 1.1 },
      { x: 1.3, z: 4.2, s: 0.9 },
      { x: -1.4, z: 2.1, s: 1.3 },
      { x: 1.2, z: 0.5, s: 0.8 },
      { x: -1.5, z: -2.8, s: 1.2 },
      { x: 1.4, z: -4.2, s: 1.0 },
    ];
    rockCoords.forEach((rc) => {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(rc.x, 0.14 * rc.s, rc.z);
      rock.scale.set(rc.s, rc.s * 0.7, rc.s);
      rock.rotation.set(rc.x * 2, rc.z, 0.3);
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.mesh.add(rock);
    });

    // 7. Small Wildflowers near rocks
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6);
    const flowerHeadGeo = new THREE.SphereGeometry(0.065, 8, 8);
    this.disposables.push(stemGeo, flowerHeadGeo);

    const flowerCoords = [
      { x: -1.5, z: 5.7, mat: flowerPetalMat1 },
      { x: -1.0, z: 5.3, mat: flowerPetalMat2 },
      { x: 1.5, z: 3.9, mat: flowerPetalMat1 },
      { x: -1.2, z: 1.8, mat: flowerPetalMat2 },
      { x: 1.5, z: 0.2, mat: flowerPetalMat1 },
      { x: -1.7, z: -2.5, mat: flowerPetalMat2 },
    ];
    flowerCoords.forEach((fc) => {
      const flower = new THREE.Group();
      flower.position.set(fc.x, 0, fc.z);

      const stem = new THREE.Mesh(stemGeo, treeFoliageMat1);
      stem.position.y = 0.11;
      const head = new THREE.Mesh(flowerHeadGeo, fc.mat);
      head.position.y = 0.23;

      flower.add(stem, head);
      this.mesh.add(flower);
    });

    // 8. Signpost: "Welcome to Home Raditya RZ!" Wooden Plaque
    const signPostGroup = new THREE.Group();
    signPostGroup.position.set(1.7, 0, 1.2);
    // Rotate the entire signpost unit together so board, text, and posts align naturally facing the path
    signPostGroup.rotation.y = -0.28;

    // Base wooden post: stands in the lawn and supports the board from underneath
    // Post top at y = 0.64 securely seats 3cm into the bottom of the board frame (y = 0.61)
    const postGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.64, 10);
    const post = new THREE.Mesh(postGeo, woodPostMat);
    post.position.set(0, 0.32, 0);
    post.castShadow = true;
    signPostGroup.add(post);

    // Rear wooden spine: supports the back of the sign board without obstructing the front
    const backPostGeo = new THREE.BoxGeometry(0.08, 0.62, 0.04);
    const backPost = new THREE.Mesh(backPostGeo, woodPostMat);
    backPost.position.set(0, 0.95, -0.04);
    backPost.castShadow = true;
    signPostGroup.add(backPost);

    // Frame board backing (Dark Pine Green rim)
    const boardGeo = new THREE.BoxGeometry(1.30, 0.68, 0.06);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x284435, // Dark Pine Green
      roughness: 0.7,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 0.95, 0);
    board.castShadow = true;
    signPostGroup.add(board);

    // High-Resolution 1024x512 Procedural Canvas Texture for crisp 3D text
    const textCanvas = document.createElement("canvas");
    textCanvas.width = 1024;
    textCanvas.height = 512;
    const textCtx = textCanvas.getContext("2d");

    if (textCtx) {
      // Solid Deep Emerald background (#136846)
      textCtx.fillStyle = "#136846";
      textCtx.fillRect(0, 0, 1024, 512);

      // Outer border in Soft Mint (#C6E0D2)
      textCtx.strokeStyle = "#C6E0D2";
      textCtx.lineWidth = 26;
      textCtx.strokeRect(22, 22, 980, 468);

      // Inner subtle border
      textCtx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      textCtx.lineWidth = 6;
      textCtx.strokeRect(48, 48, 928, 416);

      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";

      // Line 1: WELCOME TO HOME
      textCtx.fillStyle = "#E0F2FE";
      textCtx.font = "bold 60px 'Poppins', Inter, system-ui, sans-serif";
      textCtx.fillText("✨ WELCOME TO HOME ✨", 512, 175);

      // Line 2: RADITYA RZ!
      textCtx.fillStyle = "#FEF08A";
      textCtx.font = "900 96px 'Poppins', Inter, system-ui, sans-serif";
      textCtx.fillText("RADITYA RZ!", 512, 325);
    }

    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.colorSpace = THREE.SRGBColorSpace;
    textTexture.anisotropy = 4;

    const textMat = new THREE.MeshStandardMaterial({
      map: textTexture,
      roughness: 0.45,
      metalness: 0.05,
    });

    // Text plane sits flush on the front face of the board (z = 0.031)
    const textPlaneGeo = new THREE.PlaneGeometry(1.22, 0.60);
    const textMesh = new THREE.Mesh(textPlaneGeo, textMat);
    textMesh.position.set(0, 0.95, 0.031);
    signPostGroup.add(textMesh);

    this.mesh.add(signPostGroup);
    this.disposables.push(
      postGeo,
      backPostGeo,
      boardGeo,
      boardMat,
      textPlaneGeo,
      textMat,
      textTexture
    );

    // 9. Floating / Falling Autumn Leaves in yard
    const leafGeo = new THREE.PlaneGeometry(0.12, 0.16);
    this.disposables.push(leafGeo);

    const leafMatSage = new THREE.MeshStandardMaterial({
      color: 0x86b29b,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    const leafMatAmber = new THREE.MeshStandardMaterial({
      color: 0xcd7f32,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    const leafMatGold = new THREE.MeshStandardMaterial({
      color: 0xdf9b28,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    this.disposables.push(leafMatSage, leafMatAmber, leafMatGold);

    const leafMats = [leafMatSage, leafMatAmber, leafMatGold];
    const leafCount = 16;

    for (let i = 0; i < leafCount; i++) {
      const mat = leafMats[i % leafMats.length];
      const leafMesh = new THREE.Mesh(leafGeo, mat);

      const x = ((i % 8) - 3.5) * 1.1 + (i % 2 === 0 ? 0.4 : -0.4);
      const y = 0.5 + ((i * 0.28) % 3.8);
      const z = -6.0 + (i * 0.95);

      leafMesh.position.set(x, y, z);
      leafMesh.rotation.set(
        (i * 0.4) % Math.PI,
        (i * 0.7) % Math.PI,
        (i * 0.5) % Math.PI
      );
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

      // Descend smoothly
      leaf.mesh.position.y -= delta * leaf.fallSpeed;

      // Gentle horizontal flutter
      const sway = Math.sin(this.leafTime * leaf.swayFreq + leaf.phase) * leaf.swayAmp * delta;
      leaf.mesh.position.x += sway;
      leaf.mesh.position.z += sway * 0.35;

      // Tumbling rotation
      leaf.mesh.rotation.x += delta * leaf.rotSpeedX;
      leaf.mesh.rotation.y += delta * leaf.rotSpeedY;
      leaf.mesh.rotation.z += delta * leaf.rotSpeedZ;

      // Wrap back to canopy level once touching ground
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
