import { Input, Math } from 'phaser';
import { Actor } from './actor';
import { Vessel } from './vessel';
import { Wind } from './weather';

const turningRate = 60; // º per sec
const speed = 100;

export class Player extends Actor {
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    //private vessel: Vessel;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ships', 'ship (2).png');

        //this.vessel = new Vessel({body: this.getBody()});
        
        this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
        // this.getBody().setSize(32, 32);
        // this.getBody().setOffset(8, 0);

        this.setAngularDrag(turningRate);
        this.setDrag(speed);
    }

    update(wind: Wind): void {
        // if (this.cursorKeys.left.isDown) {
        //     this.vessel.turn(-1.0);
        // } else if (this.cursorKeys.right.isDown) {
        //     this.vessel.turn(1.0);
        // } else {
        //     this.vessel.turn(0.0);
        // }
        //this.vessel.update(wind);

        if (this.cursorKeys.left.isDown) {
            this.setAngularAcceleration(-turningRate);
        } else if (this.cursorKeys.right.isDown) {
            this.setAngularAcceleration(turningRate);
        } else {
            this.setAngularAcceleration(0);  
        }

        if (this.cursorKeys.up.isDown) {
            const direction = new Math.Vector2(speed, 0);
            direction.setAngle(this.rotation + Math.DegToRad(90));
            console.log("rotation=", Math.RadToDeg(this.rotation), "direction=", direction);
            this.setAcceleration(direction.x, direction.y);
        } else {
            this.setAcceleration(0.0);
        }
    }
}