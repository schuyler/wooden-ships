import { Scene, GameObjects, Tilemaps } from 'phaser';
import { Player } from '../../classes/player';
import { Wind } from '../../classes/weather';

export class MainScene extends Scene {
    private player!: GameObjects.Sprite;
    private wind: Wind;

    private map!: Tilemaps.Tilemap;
    private tileset!: Tilemaps.Tileset;
    private oceanLayer!: Tilemaps.TilemapLayer;
    private shallowsLayer!: Tilemaps.TilemapLayer;
    private islandsLayer!: Tilemaps.TilemapLayer;

    constructor() {
        super('main-scene');
        this.wind = new Wind(45, 10);
    }

    preload(): void {
        this.load.baseURL = 'assets/';
        this.load.atlasXML({
            key: 'ships',
            textureURL: 'spritesheets/shipsMiscellaneous_sheet.png',
            atlasURL: 'spritesheets/shipsMiscellaneous_sheet.xml'
        });

        this.load.image({
            key: 'tiles',
            url: 'tilemaps/tiles_sheet.png',
        });
        this.load.tilemapTiledJSON('level-0', 'tilemaps/level-0.json');
    }

    private initMap(): void {
        this.map = this.make.tilemap({ key: 'level-0' });
        this.tileset = this.map.addTilesetImage('tiles', 'tiles');
        this.oceanLayer = this.map.createLayer('Ocean', this.tileset, 0, 0);
        this.shallowsLayer = this.map.createLayer('Shallows', this.tileset, 0, 0);
        this.islandsLayer = this.map.createLayer('Islands', this.tileset, 0, 0);
        this.islandsLayer.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(0, 0, this.islandsLayer.width, this.islandsLayer.height);
    }

    private initCamera(): void {
        const bounds = this.physics.world.bounds;
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
        this.cameras.main.setBounds(0, 0, bounds.width, bounds.height);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        // this.cameras.main.setZoom(0.5);
    }

    create(): void {
        this.initMap();
        this.player = new Player(this, 100, 100);
        this.physics.add.collider(this.player, this.islandsLayer);
        this.initCamera();
    }

    update(time: number, delta: number): void {
        this.player.update(this.wind);
    }
}