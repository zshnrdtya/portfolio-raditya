/**
 * Procedural Stylized House & Interactive Hinged Door Engine
 * 100% Code-Driven — Zero External Assets
 * Built from Three.js primitives with warm porch lantern, windows, and animated door.
 */

import * as THREE from "three";

export class HouseStructure {
  public mesh: THREE.Group;
  public doorPivot: THREE.Group;
  public porchLight: THREE.PointLight;

  private isDoorOpening: boolean = false;
  private doorProgress: number = 0;
  private targetDoorAngle: number = -Math.PI * 0.55;
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

  constructor(position: THREE.Vector3 = new THREE.Vector3(0, 0, -8.2)) {
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    // Architectural Color Palette (Soft Mint & Warm Scandinavian)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf3f6f4, // Warm off-white
      roughness: 0.85,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x136846, // Deep Emerald
      roughness: 0.6,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5c4033, // Warm dark timber
      roughness: 0.75,
    });
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x284435, // Dark Pine Green
      roughness: 0.7,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Polished brass
      metalness: 0.7,
      roughness: 0.3,
    });
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a, // Warm light yellow glow
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Slate cobblestone
      roughness: 0.9,
    });

    this.disposables.push(wallMat, roofMat, woodMat, doorMat, brassMat, windowMat, stoneMat);

    // 1. House Main Body (Width: 7, Height: 3.4, Depth: 4.8)
    const bodyGeo = new THREE.BoxGeometry(6.8, 3.2, 4.6);
    const bodyMesh = new THREE.Mesh(bodyGeo, wallMat);
    bodyMesh.position.y = 1.6;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.mesh.add(bodyMesh);
    this.disposables.push(bodyGeo);

    // 2. Gable Roof (Triangular Extrusion / Slanted Slabs)
    const roofLeftGeo = new THREE.BoxGeometry(4.2, 0.22, 5.0);
    const roofLeft = new THREE.Mesh(roofLeftGeo, roofMat);
    roofLeft.rotation.z = Math.PI * 0.19;
    roofLeft.position.set(-1.8, 3.8, 0);
    roofLeft.castShadow = true;
    this.mesh.add(roofLeft);

    const roofRightGeo = new THREE.BoxGeometry(4.2, 0.22, 5.0);
    const roofRight = new THREE.Mesh(roofRightGeo, roofMat);
    roofRight.rotation.z = -Math.PI * 0.19;
    roofRight.position.set(1.8, 3.8, 0);
    roofRight.castShadow = true;
    this.mesh.add(roofRight);

    // Roof ridge cap
    const ridgeGeo = new THREE.BoxGeometry(0.35, 0.25, 5.1);
    const ridge = new THREE.Mesh(ridgeGeo, woodMat);
    ridge.position.set(0, 4.48, 0);
    this.mesh.add(ridge);
    this.disposables.push(roofLeftGeo, roofRightGeo, ridgeGeo);

    // Gable Triangular Fillers (Front and Back)
    const gableShape = new THREE.Shape();
    gableShape.moveTo(-3.4, 0);
    gableShape.lineTo(3.4, 0);
    gableShape.lineTo(0, 1.3);
    gableShape.closePath();
    const gableGeo = new THREE.ShapeGeometry(gableShape);
    const frontGable = new THREE.Mesh(gableGeo, wallMat);
    frontGable.position.set(0, 3.2, 2.301);
    const backGable = new THREE.Mesh(gableGeo, wallMat);
    backGable.position.set(0, 3.2, -2.301);
    backGable.rotation.y = Math.PI;
    this.mesh.add(frontGable, backGable);
    this.disposables.push(gableGeo);

    // Chimney
    const chimneyGeo = new THREE.BoxGeometry(0.65, 1.6, 0.65);
    const chimney = new THREE.Mesh(chimneyGeo, stoneMat);
    chimney.position.set(1.8, 4.4, -0.6);
    chimney.castShadow = true;
    this.mesh.add(chimney);
    this.disposables.push(chimneyGeo);

    // 3. Front Porch & Steps (Cobblestone entrance)
    const porchStepGeo1 = new THREE.BoxGeometry(2.6, 0.16, 1.6);
    const porchStep1 = new THREE.Mesh(porchStepGeo1, stoneMat);
    porchStep1.position.set(0, 0.08, 2.6);
    porchStep1.receiveShadow = true;

    const porchStepGeo2 = new THREE.BoxGeometry(2.2, 0.16, 1.2);
    const porchStep2 = new THREE.Mesh(porchStepGeo2, stoneMat);
    porchStep2.position.set(0, 0.24, 2.7);
    porchStep2.receiveShadow = true;
    this.mesh.add(porchStep1, porchStep2);
    this.disposables.push(porchStepGeo1, porchStepGeo2);

    // Porch Overhang Canopy
    const canopyGeo = new THREE.BoxGeometry(2.4, 0.12, 1.4);
    const canopy = new THREE.Mesh(canopyGeo, roofMat);
    canopy.position.set(0, 2.65, 2.7);
    canopy.rotation.x = 0.12;
    canopy.castShadow = true;
    this.mesh.add(canopy);
    this.disposables.push(canopyGeo);

    // Porch Wooden Support Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.065, 0.065, 2.4, 8);
    const leftPillar = new THREE.Mesh(pillarGeo, woodMat);
    leftPillar.position.set(-1.0, 1.25, 3.2);
    const rightPillar = new THREE.Mesh(pillarGeo, woodMat);
    rightPillar.position.set(1.0, 1.25, 3.2);
    this.mesh.add(leftPillar, rightPillar);
    this.disposables.push(pillarGeo);

    // 4. Doorway Entrance & Animated Door
    const doorWidth = 1.1;
    const doorHeight = 2.1;

    // Door frame
    const frameGeo = new THREE.BoxGeometry(doorWidth + 0.18, doorHeight + 0.1, 0.14);
    const frameMesh = new THREE.Mesh(frameGeo, woodMat);
    frameMesh.position.set(0, 1.1, 2.31);
    this.mesh.add(frameMesh);
    this.disposables.push(frameGeo);

    // Black doorway interior well
    const interiorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, 0.4);
    const interiorMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const interiorMesh = new THREE.Mesh(interiorGeo, interiorMat);
    interiorMesh.position.set(0, 1.05, 2.15);
    this.mesh.add(interiorMesh);
    this.disposables.push(interiorGeo, interiorMat);

    // Door Hinged Pivot (pivoted at left edge: x = -doorWidth / 2)
    this.doorPivot = new THREE.Group();
    this.doorPivot.position.set(-doorWidth / 2, 0, 2.32);
    this.mesh.add(this.doorPivot);

    // Door Panel (shifted by half-width relative to pivot)
    const doorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, 0.08);
    const doorMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMesh.position.set(doorWidth / 2, 1.05, 0);
    doorMesh.castShadow = true;
    this.doorPivot.add(doorMesh);
    this.disposables.push(doorGeo);

    // Door Brass Knob
    const knobGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const knob = new THREE.Mesh(knobGeo, brassMat);
    knob.position.set(doorWidth - 0.15, 1.05, 0.06);
    this.doorPivot.add(knob);
    this.disposables.push(knobGeo);

    // Door Window Pane
    const doorWindowGeo = new THREE.BoxGeometry(0.55, 0.55, 0.09);
    const doorWindow = new THREE.Mesh(doorWindowGeo, windowMat);
    doorWindow.position.set(doorWidth / 2, 1.5, 0);
    this.doorPivot.add(doorWindow);
    this.disposables.push(doorWindowGeo);

    // 5. Windows on Front Wall (Left and Right)
    const windowGeo = new THREE.BoxGeometry(1.2, 1.2, 0.12);
    const leftWindow = new THREE.Mesh(windowGeo, windowMat);
    leftWindow.position.set(-2.2, 1.8, 2.31);
    const rightWindow = new THREE.Mesh(windowGeo, windowMat);
    rightWindow.position.set(2.2, 1.8, 2.31);
    this.mesh.add(leftWindow, rightWindow);

    // Window Cross Frames
    const crossBarV = new THREE.BoxGeometry(0.06, 1.22, 0.14);
    const crossBarH = new THREE.BoxGeometry(1.22, 0.06, 0.14);
    const leftV = new THREE.Mesh(crossBarV, woodMat);
    leftV.position.copy(leftWindow.position);
    const leftH = new THREE.Mesh(crossBarH, woodMat);
    leftH.position.copy(leftWindow.position);
    const rightV = new THREE.Mesh(crossBarV, woodMat);
    rightV.position.copy(rightWindow.position);
    const rightH = new THREE.Mesh(crossBarH, woodMat);
    rightH.position.copy(rightWindow.position);
    this.mesh.add(leftV, leftH, rightV, rightH);
    this.disposables.push(windowGeo, crossBarV, crossBarH);

    // 6. Warm Porch Light Lantern
    this.porchLight = new THREE.PointLight(0xfef08a, 2.4, 7, 1.2);
    this.porchLight.position.set(0, 2.45, 2.85);
    this.porchLight.castShadow = true;
    this.mesh.add(this.porchLight);

    const lanternCapGeo = new THREE.ConeGeometry(0.12, 0.09, 6);
    const lanternCap = new THREE.Mesh(lanternCapGeo, woodMat);
    lanternCap.position.set(0, 2.52, 2.85);
    const lanternBulbGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const lanternBulb = new THREE.Mesh(lanternBulbGeo, windowMat);
    lanternBulb.position.set(0, 2.45, 2.85);
    this.mesh.add(lanternCap, lanternBulb);
    this.disposables.push(lanternCapGeo, lanternBulbGeo);
  }

  public openDoor() {
    this.isDoorOpening = true;
  }

  public update(delta: number) {
    if (this.isDoorOpening) {
      this.doorProgress = Math.min(1, this.doorProgress + delta * 2.2);
      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - this.doorProgress, 3);
      this.doorPivot.rotation.y = ease * this.targetDoorAngle;

      // Glow brightens as door opens into the home
      this.porchLight.intensity = 2.4 + ease * 1.8;
    }
  }

  public isFullyOpen(): boolean {
    return this.doorProgress >= 0.95;
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
