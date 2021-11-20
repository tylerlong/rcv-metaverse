import * as BABYLON from 'babylonjs';

import concreteImage from '../images/grass.jpg';
import Square from '../square';
import {uuid} from '../utils';

export const createGround = (square: Square, scene: BABYLON.Scene) => {
  const ground = BABYLON.MeshBuilder.CreateGround(
    uuid(),
    {width: square.width, height: square.height, updatable: false},
    scene
  );
  ground.position = new BABYLON.Vector3(
    ground.position.x + square.width / 2, // set the origin of the world
    ground.position.y,
    ground.position.z + square.height / 2 // set the origin of the world
  );
  const groundMaterial = new BABYLON.StandardMaterial(uuid(), scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture(concreteImage, scene);
  (groundMaterial.diffuseTexture as BABYLON.Texture).uScale = square.width;
  (groundMaterial.diffuseTexture as BABYLON.Texture).vScale = square.height;
  ground.material = groundMaterial;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {mass: 0, friction: 1},
    scene
  );
  return ground;
};
