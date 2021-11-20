import * as BABYLON from 'babylonjs';

import Square from '../square';
import {uuid} from '../utils';
import screenImage from '../images/player.jpg';

export const createScreen = (square: Square, scene: BABYLON.Scene) => {
  const screen = BABYLON.MeshBuilder.CreateBox(uuid(), {size: 4}, scene);
  screen.position = new BABYLON.Vector3(0, 3, (square.size - 1) / 2);
  const screenMaterial = new BABYLON.StandardMaterial(uuid(), scene);
  screenMaterial.diffuseTexture = new BABYLON.Texture(screenImage, scene);
  screen.material = screenMaterial;
  screen.physicsImpostor = new BABYLON.PhysicsImpostor(
    screen,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {mass: 1, friction: 1},
    scene
  );
  return screen;
};
