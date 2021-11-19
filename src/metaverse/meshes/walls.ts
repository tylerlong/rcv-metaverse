import * as BABYLON from 'babylonjs';

import stoneImage from '../images/wall.png';
import Square from '../square';
import {uuid} from '../utils';

export const createWalls = (square: Square, scene: BABYLON.Scene) => {
  const boxes: BABYLON.Mesh[] = [];
  for (let x = 0; x < square.size; x++) {
    for (let z = 0; z < square.size; z++) {
      if (
        x === 0 ||
        z === 0 ||
        x === square.size - 1 ||
        z === square.size - 1
      ) {
        const wall = createWall(
          {
            id: `${x}-${z}`,
            x: x - (square.size - 1) / 2,
            z: z - (square.size - 1) / 2,
          },
          scene
        );
        boxes.push(wall);
      }
    }
  }
  const walls = BABYLON.Mesh.MergeMeshes(boxes)!;
  const wallMaterial = new BABYLON.StandardMaterial(uuid(), scene);
  wallMaterial.diffuseTexture = new BABYLON.Texture(stoneImage, scene);
  walls.material = wallMaterial;
  walls.physicsImpostor = new BABYLON.PhysicsImpostor(
    walls,
    BABYLON.PhysicsImpostor.MeshImpostor,
    {mass: 0},
    scene
  );
  return walls;
};

const createWall = (
  options: {id: string; z: number; x: number},
  scene: BABYLON.Scene
) => {
  const wall = BABYLON.MeshBuilder.CreateBox(
    uuid(),
    {
      size: 1,
    },
    scene
  );
  wall.position.z += options.z;
  wall.position.y += 0.5;
  wall.position.x += options.x;
  return wall;
};
