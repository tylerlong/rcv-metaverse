import * as BABYLON from 'babylonjs';

import Square from '../square';
import {uuid} from '../utils';
import playerImage from '../images/player.jpg';

export const createPlayer = (square: Square, scene: BABYLON.Scene) => {
  const player = BABYLON.MeshBuilder.CreateSphere(
    uuid(),
    {segments: 16, diameter: 0.4, sideOrientation: BABYLON.Mesh.FRONTSIDE},
    scene
  );
  player.position = new BABYLON.Vector3(
    square.player.x - (square.size - 1) / 2,
    0.2,
    square.player.z - (square.size - 1) / 2
  );
  const playerMaterial = new BABYLON.StandardMaterial(uuid(), scene);
  playerMaterial.diffuseTexture = new BABYLON.Texture(playerImage, scene);
  player.material = playerMaterial;
  player.physicsImpostor = new BABYLON.PhysicsImpostor(
    player,
    BABYLON.PhysicsImpostor.SphereImpostor,
    {mass: 1, friction: 1},
    scene
  );
  return player;
};
