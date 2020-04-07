declare var require;
import * as PIXI from 'pixi.js';
import {Board} from 'pixigamelib';
import { AtlasMap } from 'pixigamelib/dist/atlas';
import {State} from '../index';
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    resizeTo:window
});

const atlasmap:AtlasMap = {
    0:{width:16, height:16, texture:PIXI.BaseTexture.from(require('./assets/tiles.png'))},
    1:{width:2, height:2, texture:PIXI.BaseTexture.from(require('./assets/player.png'))},
}

const board = new Board(atlasmap);
let state:State = {
    things:{
        "0":{
            atlas:1,
            frame:0,
            order:1,
            radius:1,
            x:10,
            y:10
        }
    },
    tilemap:{
        width:0,
        height:0,
        layers:[]
    }
}

board.scale.set(32);

app.stage.addChild(board);

app.ticker.add(()=>
{
    board.tick(app.ticker, state);
});

document.body.append(app.view);
