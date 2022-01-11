import { Input } from 'phaser';
import { Actor } from './actor';
import { Vessel } from './vessel';
import { Wind } from './weather';

export class Player extends Actor {
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private vessel: Vessel;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ships', 'ship (2).png');

        this.vessel = new Vessel({body: this.getBody()});
        
        this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
        // this.getBody().setSize(32, 32);
        // this.getBody().setOffset(8, 0);
    }

    update(wind: Wind): void {
        if (this.cursorKeys.left.isDown) {
            this.vessel.turn(-1.0);
        } else if (this.cursorKeys.right.isDown) {
            this.vessel.turn(1.0);
        } else {
            this.vessel.turn(0.0);
        }
        this.vessel.update(wind);
    }
}