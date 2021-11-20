import * as BABYLON from 'babylonjs';

import Square from '../square';
import {uuid} from '../utils';

export const createScreen = (square: Square, scene: BABYLON.Scene) => {
  const screen = BABYLON.MeshBuilder.CreatePlane(
    uuid(),
    {width: 8, height: 4.5},
    scene
  );
  screen.rotate(BABYLON.Axis.Z, Math.PI, BABYLON.Space.WORLD);
  screen.position = new BABYLON.Vector3(0, 4.5 / 2, (square.size - 1) / 2 - 1);
  const screenMaterial = new BABYLON.StandardMaterial(uuid(), scene);
  const videoTexture = new BABYLON.VideoTexture(
    uuid(),
    document.getElementById('video-1') as HTMLVideoElement,
    scene,
    true,
    true
  );
  screenMaterial.diffuseTexture = videoTexture;
  screen.material = screenMaterial;
  return screen;
};
