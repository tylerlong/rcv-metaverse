import * as BABYLON from 'babylonjs';

import Square from '../square';
import {uuid} from '../utils';
import screenImage from '../images/player.jpg';

export const createScreen = (square: Square, scene: BABYLON.Scene) => {
  const columns = 6; // 6 columns
  const rows = 4; // 4 rows

  const faceUV = new Array(6);

  //set all values to zero
  for (let i = 0; i < 6; i++) {
    faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
  }

  //overwrite wanted face with sprite coordinates
  faceUV[1] = new BABYLON.Vector4(3 / columns, 0, (3 + 1) / columns, 1 / rows);
  const screen = BABYLON.MeshBuilder.CreateBox(
    uuid(),
    {
      width: 8,
      height: 8,
      depth: 1,
      faceUV,
    },
    scene
  );
  screen.position = new BABYLON.Vector3(0, 5, (square.size - 1) / 2 - 1);
  const screenMaterial = new BABYLON.StandardMaterial(uuid(), scene);
  screenMaterial.diffuseTexture = new BABYLON.Texture(screenImage, scene);
  (screenMaterial.diffuseTexture as BABYLON.Texture).uScale =
    (square.size - 1) / 2;
  (screenMaterial.diffuseTexture as BABYLON.Texture).vScale =
    (square.size - 1) / 2;
  screen.material = screenMaterial;
  screen.physicsImpostor = new BABYLON.PhysicsImpostor(
    screen,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {mass: 1, friction: 1},
    scene
  );
  return screen;
};
