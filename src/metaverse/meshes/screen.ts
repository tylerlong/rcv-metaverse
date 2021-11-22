import * as BABYLON from 'babylonjs';

import Square from '../square';
import {uuid} from '../utils';

export const createScreens = (
  square: Square,
  scene: BABYLON.Scene,
  count: number
) => {
  const result: BABYLON.Mesh[] = [];
  for (let i = 0; i < count; i++) {
    const screen = BABYLON.MeshBuilder.CreatePlane(
      uuid(),
      {width: 8, height: 4.5},
      scene
    );
    screen.rotate(BABYLON.Axis.Z, Math.PI, BABYLON.Space.WORLD);
    screen.position = new BABYLON.Vector3(
      ((i * 2 + 1) * square.width) / count / 2,
      4.5 / 2,
      square.height - 2
    );
    const screenMaterial = new BABYLON.StandardMaterial(uuid(), scene);
    const videoTexture = new BABYLON.VideoTexture(
      uuid(),
      document.getElementById(`video-${i + 1}`) as HTMLVideoElement,
      scene,
      true,
      true
    );
    videoTexture.uScale = -1;
    screenMaterial.diffuseTexture = videoTexture;
    screen.material = screenMaterial;
    result.push(screen);
  }
  return result;
};
