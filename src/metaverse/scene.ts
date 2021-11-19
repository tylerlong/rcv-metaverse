import * as BABYLON from 'babylonjs';
import {createGround} from './meshes/ground';

import {createPlayer} from './meshes/player';
import {createWalls} from './meshes/walls';
import Square from './square';
import {uuid} from './utils';

class Scene {
  square: Square;
  scene: BABYLON.Scene;
  camera: BABYLON.FreeCamera;
  light: BABYLON.SpotLight;

  ground: BABYLON.Mesh;
  walls: BABYLON.Mesh;
  player: BABYLON.Mesh;

  constructor(engine: BABYLON.Engine, size: number) {
    this.square = new Square(size);
    this.scene = new BABYLON.Scene(engine);

    const gravityVector = new BABYLON.Vector3(0, -9.8, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();
    this.scene.enablePhysics(gravityVector, physicsPlugin);

    this.camera = new BABYLON.FreeCamera(
      uuid(),
      new BABYLON.Vector3(0, 6, -10),
      this.scene
    );

    this.light = new BABYLON.SpotLight(
      uuid(),
      new BABYLON.Vector3(0, 4, 0), // x, z will be override anyway
      new BABYLON.Vector3(0, -1, 0.5),
      Math.PI / 3,
      30,
      this.scene
    );

    this.ground = createGround(this.square, this.scene);
    this.walls = createWalls(this.square, this.scene)!;
    this.player = createPlayer(this.square, this.scene);
  }

  render() {}

  dispose() {}
}

export default Scene;
