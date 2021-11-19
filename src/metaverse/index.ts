import * as BABYLON from 'babylonjs';
import * as CANNON from 'cannon-es';

import Scene from './scene';

(global as unknown as {CANNON: typeof CANNON}).CANNON = CANNON;

class Metaverse {
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  scene: Scene;

  constructor() {
    this.canvas = document.getElementById(
      'metaverse-canvas'
    ) as HTMLCanvasElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    this.windowResizeListener = this.windowResizeListener.bind(this);
    window.addEventListener('resize', this.windowResizeListener);

    this.scene = new Scene(this.engine, 101);
    this.engine.runRenderLoop(() => this.scene.render());
  }

  windowResizeListener() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.engine.resize();
  }

  dispose() {
    this.engine.stopRenderLoop();
    this.scene.dispose();
    window.removeEventListener('resize', this.windowResizeListener);
    this.engine.dispose();
    this.canvas.remove();
  }
}

export default Metaverse;
