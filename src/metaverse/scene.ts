import * as BABYLON from 'babylonjs';
import {createGround} from './meshes/ground';

import {createScreen} from './meshes/screen';
import Square from './square';
import {uuid} from './utils';

class Scene {
  square: Square;
  scene: BABYLON.Scene;
  camera: BABYLON.FreeCamera;
  light1: BABYLON.Light;
  light2: BABYLON.Light;
  light3: BABYLON.Light;
  light4: BABYLON.Light;

  ground: BABYLON.Mesh;
  screen: BABYLON.Mesh;

  newCameraPosition: BABYLON.Vector3;

  constructor(engine: BABYLON.Engine, width: number, height: number) {
    this.square = new Square(width, height);
    this.scene = new BABYLON.Scene(engine);

    const gravityVector = new BABYLON.Vector3(0, -9.8, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();
    this.scene.enablePhysics(gravityVector, physicsPlugin);

    this.camera = new BABYLON.FreeCamera(
      uuid(),
      new BABYLON.Vector3(this.square.width / 2, 1, 2),
      this.scene
    );
    this.newCameraPosition = this.camera.position;

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
    this.light3 = new BABYLON.DirectionalLight(
      uuid(),
      new BABYLON.Vector3(2, -1, -2),
      this.scene
    );
    this.light4 = new BABYLON.DirectionalLight(
      uuid(),
      new BABYLON.Vector3(-2, -1, 2),
      this.scene
    );

    this.ground = createGround(this.square, this.scene);
    this.screen = createScreen(this.square, this.scene);

    this.keydownListener = this.keydownListener.bind(this);
    window.addEventListener('keydown', this.keydownListener);

    this.scene.registerBeforeRender(() => {
      this.camera.position = BABYLON.Vector3.Lerp(
        this.camera.position,
        this.newCameraPosition,
        0.05
      );
    });
  }

  render() {
    this.camera.setTarget(
      new BABYLON.Vector3(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z + 1
      )
    );
    this.scene.render();
  }

  dispose() {
    window.removeEventListener('keydown', this.keydownListener);
    this.screen.dispose();
    this.camera.dispose();
    this.light1.dispose();
    this.light2.dispose();
    this.light3.dispose();
    this.light4.dispose();
    this.ground.dispose();
    this.scene.dispose();
  }

  moveCamera(direction: 'left' | 'right' | 'forward' | 'backward') {
    const speed = 1;
    switch (direction) {
      case 'left': {
        this.newCameraPosition.x -= speed;
        if (this.newCameraPosition.x <= 2) {
          this.newCameraPosition.x = 2;
        }
        break;
      }
      case 'right': {
        this.newCameraPosition.x += speed;
        if (this.newCameraPosition.x >= this.square.width - 3) {
          this.newCameraPosition.x = this.square.width - 3;
        }
        break;
      }
      case 'forward': {
        this.newCameraPosition.z += speed;
        if (this.newCameraPosition.z >= this.square.height - 3) {
          this.newCameraPosition.z = this.square.height - 3;
        }
        break;
      }
      case 'backward': {
        this.newCameraPosition.z -= speed;
        if (this.newCameraPosition.z <= 2) {
          this.newCameraPosition.z = 2;
        }
        break;
      }
    }
  }

  keydownListener(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();
        this.moveCamera('left');
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        this.moveCamera('right');
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        this.moveCamera('forward');
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        this.moveCamera('backward');
        break;
      }
      default: {
        break;
      }
    }
  }
}

export default Scene;
