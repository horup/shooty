declare var require;
import * as PIXI from 'pixi.js';
import {Board} from 'pixigamelib';
import { AtlasMap } from 'pixigamelib/dist/atlas';
import {State, initialState, Command, getThingsOfOwner} from '..';
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

const keys = {};
document.onkeydown = (e=>{
    keys[e.code] = true;
    console.log(e.code);
});

document.onkeyup = (e=>{
    delete keys[e.code];
});

PIXI.settings.TARGET_FPMS = 20;

let iterations = 0;
app.ticker.add(()=>
{
    const dt = app.ticker.deltaTime / 1000;
    if (client.state != null)
    {
        const thing = getThingsOfOwner(client.state, client.id)[0];
        if (thing != null)
        {
            const speed = 0.1;
            const t = thing[1];
            if (keys["KeyW"])
                t.y -= speed * dt;
            else if (keys["KeyS"])
                t.y += speed * dt;
            if (keys["KeyA"])
                t.x -= speed * dt;
            else if (keys["KeyD"])
                t.x += speed * dt;
  
            client.pushCommand({
                input:{
                    x:t.x,
                    y:t.y
                }
            }, true);
        }

        Object.values(client.state.things).forEach(t=>t.order = t.y);
        board.tick(app.ticker, client.state);
    }

    iterations++;
});
