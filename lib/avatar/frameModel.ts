import * as THREE from "three";

/** Scale + center a loaded GLB so feet sit on y=0 and height matches target. */
export function frameModel(root: THREE.Object3D, targetHeight: number) {
  root.updateWorldMatrix(true, true);

  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const scale = targetHeight / Math.max(size.y, 1e-6);
  root.scale.setScalar(scale);

  root.updateWorldMatrix(true, true);
  const framed = new THREE.Box3().setFromObject(root);

  root.position.x -= (framed.min.x + framed.max.x) * 0.5;
  root.position.y -= framed.min.y;
  root.position.z -= (framed.min.z + framed.max.z) * 0.5;
}

export function prepareModel(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const geo = mesh.geometry;
    if (geo && !geo.attributes.normal) geo.computeVertexNormals();
    geo?.computeBoundingSphere();

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (!mat) continue;
      if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
        const m = mat as THREE.MeshStandardMaterial;
        m.flatShading = false;
        m.roughness = Math.min(m.roughness ?? 0.72, 0.78);
        m.metalness = Math.min(m.metalness ?? 0, 0.08);
        m.envMapIntensity = Math.max(m.envMapIntensity ?? 1, 1.2);
        m.needsUpdate = true;
      } else if ((mat as THREE.MeshBasicMaterial).isMeshBasicMaterial) {
        const m = mat as THREE.MeshBasicMaterial;
        m.toneMapped = true;
        m.needsUpdate = true;
      }
    }
  });
}
