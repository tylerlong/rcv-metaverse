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
  light1: BABYLON.Light;
  light2: BABYLON.Light;

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
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );

    this.light1 = new BABYLON.DirectionalLight(
      uuid(),
      new BABYLON.Vector3(2, -1, 2),
      this.scene
    );
    this.light2 = new BABYLON.DirectionalLight(
      uuid(),
      new BABYLON.Vector3(-2, -1, -2),
      this.scene
    );

    this.ground = createGround(this.square, this.scene);
    this.walls = createWalls(this.square, this.scene)!;
    this.player = createPlayer(this.square, this.scene);

    this.keydownListener = this.keydownListener.bind(this);
    window.addEventListener('keydown', this.keydownListener);
  }

  render() {
    this.camera.position.x = this.player.position.x;
    this.camera.position.z = this.player.position.z - 1;
    this.camera.setTarget(
      new BABYLON.Vector3(
        this.player.position.x,
        this.camera.position.y,
        this.player.position.z
      )
    );
    this.scene.render();
  }

  dispose() {
    window.removeEventListener('keydown', this.keydownListener);
    this.player.dispose();
    this.camera.dispose();
    this.light1.dispose();
    this.light2.dispose();
    this.ground.dispose();
    this.walls.dispose();
    this.scene.dispose();
  }

  keydownListener(event: KeyboardEvent) {
    const speed = 3;
    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();
        this.player.physicsImpostor?.setLinearVelocity(
          new BABYLON.Vector3(-speed, 0, 0)
        );
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        this.player.physicsImpostor?.setLinearVelocity(
          new BABYLON.Vector3(speed, 0, 0)
        );
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        this.player.physicsImpostor?.setLinearVelocity(
          new BABYLON.Vector3(0, 0, speed)
        );
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        this.player.physicsImpostor?.setLinearVelocity(
          new BABYLON.Vector3(0, 0, -speed)
        );
        break;
      }
      default: {
        break;
      }
    }
  }
}

export default Scene;
