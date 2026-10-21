import * as THREE from 'three';

export function createTrees(
  woodPostMat: THREE.Material,
  treeFoliageMat1: THREE.Material,
  treeFoliageMat2: THREE.Material
): {
  group: THREE.Group;
  disposables: THREE.BufferGeometry[];
} {
  const group = new THREE.Group();
  const disposables: THREE.BufferGeometry[] = [];

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
  disposables.push(trunkGeo, cone1Geo, cone2Geo, cone3Geo);

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
    group.add(treeGroup);
  });

  return { group, disposables };
}

export function createRocksAndFlowers(
  rockMat: THREE.Material,
  stemMat: THREE.Material,
  flowerPetalMat1: THREE.Material,
  flowerPetalMat2: THREE.Material
): {
  group: THREE.Group;
  disposables: THREE.BufferGeometry[];
} {
  const group = new THREE.Group();
  const disposables: THREE.BufferGeometry[] = [];

  const rockGeo = new THREE.DodecahedronGeometry(0.24, 0);
  disposables.push(rockGeo);

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
    group.add(rock);
  });

  const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6);
  const flowerHeadGeo = new THREE.SphereGeometry(0.065, 8, 8);
  disposables.push(stemGeo, flowerHeadGeo);

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

    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.11;
    const head = new THREE.Mesh(flowerHeadGeo, fc.mat);
    head.position.y = 0.23;

    flower.add(stem, head);
    group.add(flower);
  });

  return { group, disposables };
}
