import { Scene, GameObjects, Math, Physics } from 'phaser';
import { Wind } from '../../classes/weather';

export class LabScene extends Scene {
    private ship!: GameObjects.Image;
    private arrow!: GameObjects.Image;
    private wind: Wind;
    private arrowCenter: Math.Vector2;
    private arrowDistance: number;

    constructor() {
        super('lab-scene');
        this.wind = new Wind(45, 10);
        this.arrowCenter = new Math.Vector2;
        this.arrowDistance = 0;
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
        let circle = this.add.circle(shipAnchor.x, shipAnchor.y, radius, 0xffffff, 224);

        const textOffset = radius + 32;
        const textFormat = {align: "center"};
        this.add.text(shipAnchor.x + textOffset - 16, shipAnchor.y, "0º", textFormat).setDisplayOrigin(0.5);
        this.add.text(shipAnchor.x - 16, shipAnchor.y + textOffset, "90º", textFormat).setDisplayOrigin(0.5, 0.5);
        this.add.text(shipAnchor.x - textOffset - 16, shipAnchor.y, "180º", textFormat).setDisplayOrigin(0.5, 0.5);
        this.add.text(shipAnchor.x - 16, shipAnchor.y - textOffset, "270º", textFormat).setDisplayOrigin(0.5, 0.5);

        this.arrow = this.add.image(shipAnchor.x, shipAnchor.y, 'arrow');
        this.arrow.setAngle(270);
        this.arrowCenter = shipAnchor.clone();
        this.arrowDistance = shipAnchor.x - this.arrow.width + 8;
        this.renderWindOrigin();

        this.ship = this.add.image(shipAnchor.x, shipAnchor.y, 'ships', 'ship (1).png');
    }

    renderWindOrigin(): void {
        const point = this.arrowCenter.clone();
        const angle = Math.Angle.Reverse(this.arrow.rotation);
        Math.RotateAroundDistance(point, this.arrowCenter.x, this.arrowCenter.y, angle, this.arrowDistance);
        console.log("angle=", Math.RadToDeg(angle), "center=", this.arrowCenter, "point=", point);
        this.arrow.setPosition(point.x, point.y);
    }

    update(time: number, delta: number): void {
    }
}