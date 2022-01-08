import { Input } from 'phaser';
import { Actor } from './actor';


export class Player extends Actor {
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ships', 'ship (2).png');

        this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
        // this.getBody().setSize(32, 32);
        // this.getBody().setOffset(8, 0);
    }

    update(): void {
        const body = this.getBody();
        if (this.cursorKeys.left.isDown) {
            body.angularVelocity = -200
        } else if (this.cursorKeys.right.isDown) {
            body.angularVelocity = 200
        } else {
            body.angularVelocity = 0;
        }

        if (this.cursorKeys.up.isDown) {
            this.scene.physics.velocityFromAngle(this.angle + 90, 200, body.acceleration);
        } else {
            body.setAcceleration(0, 0);
        }

        // this.scene.physics.world.wrap(this);
    }
}