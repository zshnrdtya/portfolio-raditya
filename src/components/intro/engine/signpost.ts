import * as THREE from 'three';

export function createSignpost(): {
  group: THREE.Group;
  disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[];
} {
  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];
  const signPostGroup = new THREE.Group();
  signPostGroup.position.set(1.7, 0, 1.2);
  signPostGroup.rotation.y = -0.28;

  const woodPostMat = new THREE.MeshStandardMaterial({
    color: 0x5c4033,
    roughness: 0.8,
  });
  disposables.push(woodPostMat);

  const postGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.64, 10);
  const post = new THREE.Mesh(postGeo, woodPostMat);
  post.position.set(0, 0.32, 0);
  post.castShadow = true;
  signPostGroup.add(post);

  const backPostGeo = new THREE.BoxGeometry(0.08, 0.62, 0.04);
  const backPost = new THREE.Mesh(backPostGeo, woodPostMat);
  backPost.position.set(0, 0.95, -0.04);
  backPost.castShadow = true;
  signPostGroup.add(backPost);

  const boardGeo = new THREE.BoxGeometry(1.30, 0.68, 0.06);
  const boardMat = new THREE.MeshStandardMaterial({
    color: 0x284435,
    roughness: 0.7,
  });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 0.95, 0);
  board.castShadow = true;
  signPostGroup.add(board);

  const textCanvas = document.createElement('canvas');
  textCanvas.width = 1024;
  textCanvas.height = 512;
  const textCtx = textCanvas.getContext('2d');

  if (textCtx) {
    textCtx.fillStyle = '#136846';
    textCtx.fillRect(0, 0, 1024, 512);

    textCtx.strokeStyle = '#C6E0D2';
    textCtx.lineWidth = 26;
    textCtx.strokeRect(22, 22, 980, 468);

    textCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    textCtx.lineWidth = 6;
    textCtx.strokeRect(48, 48, 928, 416);

    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';

    textCtx.fillStyle = '#E0F2FE';
    textCtx.font = "bold 60px 'Poppins', Inter, system-ui, sans-serif";
    textCtx.fillText('✨ WELCOME TO HOME ✨', 512, 175);

    textCtx.fillStyle = '#FEF08A';
    textCtx.font = "900 96px 'Poppins', Inter, system-ui, sans-serif";
    textCtx.fillText('RADITYA RZ!', 512, 325);
  }

  const textTexture = new THREE.CanvasTexture(textCanvas);
  textTexture.colorSpace = THREE.SRGBColorSpace;
  textTexture.anisotropy = 4;

  const textMat = new THREE.MeshStandardMaterial({
    map: textTexture,
    roughness: 0.45,
    metalness: 0.05,
  });

  const textPlaneGeo = new THREE.PlaneGeometry(1.22, 0.60);
  const textMesh = new THREE.Mesh(textPlaneGeo, textMat);
  textMesh.position.set(0, 0.95, 0.031);
  signPostGroup.add(textMesh);

  disposables.push(
    postGeo,
    backPostGeo,
    boardGeo,
    boardMat,
    textPlaneGeo,
    textMat,
    textTexture
  );

  return { group: signPostGroup, disposables };
}
