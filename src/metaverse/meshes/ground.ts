import * as BABYLON from 'babylonjs';

import concreteImage from '../images/ground.png';
import Square from '../square';
import {uuid} from '../utils';

export const createGround = (square: Square, scene: BABYLON.Scene) => {
  const ground = BABYLON.MeshBuilder.CreateGround(
    uuid(),
    {width: square.size, height: square.size, updatable: false},
    scene
  );
  const groundMaterial = new BABYLON.StandardMaterial(uuid(), scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture(concreteImage, scene);
  (groundMaterial.diffuseTexture as BABYLON.Texture).uScale =
    (square.size - 1) / 2;
  (groundMaterial.diffuseTexture as BABYLON.Texture).vScale =
    (square.size - 1) / 2;
  ground.material = groundMaterial;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {mass: 0, friction: 1},
    scene
  );
  return ground;
};
