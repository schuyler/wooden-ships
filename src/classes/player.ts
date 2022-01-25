import { GameObjects, Input, Math } from 'phaser';
import { Math_ } from '../helpers/math';
import { PX_PER_KNOT } from '../helpers/scale';
import { Actor } from './actor';
import { Vessel } from './vessel';
import { Wind } from './weather';

const turningRate = 60; // º per sec
const speed = 100;

export class Player extends Actor {
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private vessel: Vessel;
    private readout!: GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, readout: GameObjects.Text) {
        super(scene, x, y, 'ships', 'ship (2).png');

        this.vessel = new Vessel({body: this.getBody(), heading: Math_.PI/2});
        this.setVelocity(1.0 * PX_PER_KNOT);
        
        this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
        this.readout = readout;
    }

    update(wind: Wind): void {
        if (this.cursorKeys.left.isDown) {
            this.vessel.setRudder(-1.0);
        } else if (this.cursorKeys.right.isDown) {
            this.vessel.setRudder(1.0);
        } else {
            this.vessel.setRudder(0.0);
        }
        const f = this.vessel.update(wind);
        this.setRotation(this.vessel.heading() - Math_.PI/2);
        this.readout.setText(this.vessel.debugMotion(f));
    }
}