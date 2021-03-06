import { Scene, GameObjects, Physics, Input, Math } from 'phaser';
import { Wind, Vessel, DefaultSpecs } from '../../classes';
import { Math_, _r, _d } from '../../helpers/math';

type ArrowKeys = Record<"W" | "A" | "S" | "D" | 
                       "UP" | "DOWN" | "LEFT" | "RIGHT", Input.Keyboard.Key>;


export class LabScene extends Scene {
    private ship!: Physics.Arcade.Sprite;
    private arrow!: Physics.Arcade.Sprite;
    private keys!: ArrowKeys;
    private readout!: GameObjects.Text;

    private wind: Wind;
    private vessel!: Vessel;
    private shipSpeed: number = 0;
    private arrowCenter: Math.Vector2;
    private arrowDistance: number = 0;
 
    constructor() {
        super('lab-scene');
        this.wind = new Wind(45, 10);
        this.arrowCenter = new Math.Vector2;
    }

    preload(): void {
        this.load.baseURL = 'assets/';
        this.load.atlasXML({
            key: 'ships',
            textureURL: 'spritesheets/shipsMiscellaneous_sheet.png',
            atlasURL: 'spritesheets/shipsMiscellaneous_sheet.xml'
        });
        this.load.image('arrow', 'images/arrow.png');
    }

    create(): void {
        let midPoint = new Math.Vector2(this.game.scale.width/2, this.game.scale.height/2);
        let shipAnchor = new Math.Vector2(midPoint.x / 2, midPoint.y);
        let radius = shipAnchor.x / 2;
        
        this.add.circle(shipAnchor.x, shipAnchor.y, radius, 0xffffff, 224);

        const textOffset = radius + 32;
        const textFormat = {align: "center"};
        this.add.text(shipAnchor.x + textOffset, shipAnchor.y, "0º", textFormat).setOrigin(0.5);
        this.add.text(shipAnchor.x, shipAnchor.y + textOffset, "90º", textFormat).setOrigin(0.5);
        this.add.text(shipAnchor.x - textOffset, shipAnchor.y, "180º", textFormat).setOrigin(0.5);
        this.add.text(shipAnchor.x, shipAnchor.y - textOffset, "270º", textFormat).setOrigin(0.5);

        this.arrow = this.physics.add.sprite(shipAnchor.x, shipAnchor.y, 'arrow');
        this.arrowCenter = shipAnchor.clone();
        this.arrowDistance = shipAnchor.x - this.arrow.width + 8;
        this.showWindOrigin();

        this.ship = this.physics.add.sprite(shipAnchor.x, shipAnchor.y, 'ships', 'ship (1).png');
        this.keys = this.input.keyboard.addKeys('W,S,A,D,UP,DOWN,LEFT,RIGHT') as ArrowKeys;

        this.readout = this.add.text(midPoint.x * 5/4, midPoint.y, '', {align: "left"});
        this.readout.setOrigin(0, 0.5);

        this.vessel = new Vessel({
            body: this.ship.body as Physics.Arcade.Body,
            heading: 0,
            specs: DefaultSpecs
        });
    }

    showWindOrigin(): void {
        const point = this.arrowCenter.clone();
        const angle = Math.Angle.Reverse(this.arrow.rotation);
        Math.RotateAroundDistance(point, this.arrowCenter.x, this.arrowCenter.y, angle, this.arrowDistance);
        this.arrow.setPosition(point.x, point.y);
    }

    updateReadout(): void {
        const shipVelocity = new Math.Vector2(this.shipSpeed, 0),
              shipRotation = Math.Angle.Normalize(this.ship.rotation + Math_.PI/2);
        shipVelocity.rotate(shipRotation);

        const f = this.vessel.computeForces(this.wind, this.ship.rotation, shipVelocity);
        this.readout.setText(this.vessel.debugMotion(f));
    }

    update(time: number, delta: number): void {
        const turnRate = 60, linearRate = 0.1;

        if (this.keys.D.isDown) {
            this.arrow.setAngularVelocity(turnRate);
        } else if (this.keys.A.isDown) {
            this.arrow.setAngularVelocity(-turnRate);
        } else {
            this.arrow.setAngularVelocity(0);
        }

        if (this.keys.W.isDown) {
            this.wind.setSpeed(this.wind.speed() + linearRate);
        } else if (this.keys.S.isDown) {
            this.wind.setSpeed(this.wind.speed() - linearRate);
        }

        if (this.keys.RIGHT.isDown) {
            this.ship.setAngularVelocity(turnRate);
        } else if (this.keys.LEFT.isDown) {
            this.ship.setAngularVelocity(-turnRate);
        } else {
            this.ship.setAngularVelocity(0);
        }

        if (this.keys.UP.isDown) {
            this.shipSpeed += linearRate;
        } else if (this.keys.DOWN.isDown) {
            this.shipSpeed -= linearRate;
        }
        this.shipSpeed = Math.Clamp(this.shipSpeed, 0, 100);

        this.wind.setDirection(_d(Math.Angle.Reverse(this.arrow.rotation)));

        this.showWindOrigin();
        this.updateReadout();
    }
}