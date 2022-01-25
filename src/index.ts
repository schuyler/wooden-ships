import { Game, Types } from 'phaser';
import { LabScene, MainScene } from './scenes';

interface Window {
    sizeChanged: () => void;
    game: Phaser.Game;
}

const gameConfig: Types.Core.GameConfig = {
    title: 'Wooden Ships!',
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#002244',
    scale: {
        // mode: Phaser.Scale.ScaleModes.NONE,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    // render: {
    //     antialiasGL: false,
    //     pixelArt: true,
    // },
    callbacks: {
        postBoot: () => {
            sizeChanged();
        },
    },
    canvasStyle: `display: block; width: 100%; height: 100%;`,
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    scene: [MainScene, LabScene],
};

function sizeChanged(): void {
    if (game.isBooted) {
        setTimeout(() => {
            game.scale.resize(window.innerWidth, window.innerHeight);
            game.canvas.setAttribute(
                'style',
                `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
            );
        }, 100);
    }
};
window.onresize = () => sizeChanged();

const game = new Game(gameConfig);