declare var require;
import * as PIXI from 'pixi.js';
import {Board} from 'pixigamelib';
import { AtlasMap } from 'pixigamelib/dist/atlas';
import {State, initialState, Command} from '..';
import {Client} from 'cmdserverclient';
import { setThingsHandler, deleteThingsHandler } from '../handlers';
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    resizeTo:window
});

const atlasmap:AtlasMap = {
    0:{width:16, height:16, texture:PIXI.BaseTexture.from(require('./assets/tiles.png'))},
    1:{width:2, height:2, texture:PIXI.BaseTexture.from(require('./assets/player.png'))},
}

const board = new Board(atlasmap);

board.scale.set(32);
app.stage.addChild(board);
document.body.append(app.view);

const client = new Client<State, Command>({
    info:(s)=>console.log(s)
});

client.handlers = [
    setThingsHandler,
    deleteThingsHandler
]
client.connect("ws://localhost:8080").catch(r=>
{

});

app.ticker.add(()=>
{
    if (client.state != null)
    {
        board.tick(app.ticker, client.state);
    }
});
