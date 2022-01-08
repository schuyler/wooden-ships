import { Scene, GameObjects } from 'phaser';
import { Player } from '../../classes/player';

export class MainScene extends Scene {
    private player!: GameObjects.Sprite;

    constructor() {
        super('main-scene');
    }

    preload(): void {
        this.load.baseURL = 'assets/';
        this.load.atlasXML({
            key: 'ships',
            textureURL: 'spritesheets/shipsMiscellaneous_sheet.png',
            atlasURL: 'spritesheets/shipsMiscellaneous_sheet.xml'
        });
    }

    create(): void {
        this.player = new Player(this, 100, 100);
    }

    update(): void {
        this.player.update();
    }
}