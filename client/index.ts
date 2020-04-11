declare var require;
import * as PIXI from 'pixi.js';
import {AtlasSpriteContainer, AtlasMap, CenteredText} from 'pixigamelib';
import {State, initialState, Command, getThingsOfOwner} from '..';
import {Client} from 'cmdserverclient';
import { setThingsHandler, deleteThingsHandler } from '../handlers';
import { tickHandler } from './handlers';
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    resizeTo:window
});
document.body.append(app.view);

const stage = new PIXI.Container();
app.stage.addChild(stage);
const status = new CenteredText(app.view, "Loading...", {fill:'white'});
app.stage.addChild(status);


const loader = PIXI.Loader.shared
.add("tiles", require('./assets/tiles.png'))
.add("player", require('./assets/player.png'))
.load()
.on('complete', ()=>
{
    const res = loader.resources;
    const atlasmap:AtlasMap = {
        0:{columns:16, rows:16, texture:res.tiles.texture.baseTexture},
        1:{columns:2, rows:2, texture:res.player.texture.baseTexture}
    }
    
    const sprites = new AtlasSpriteContainer(atlasmap);
    stage.addChild(sprites);
    stage.scale.set(32);
    
    const client = new Client<State, Command>({
        info:(s)=>console.log(s)
    });
    
    client.handlers = [
        tickHandler,
        setThingsHandler,
        deleteThingsHandler
    ]
    client.connect("ws://localhost:8080").catch(r=>
    {
    
    });
    
    
    
    let iterations = 0;
    app.ticker.add(()=>
    {
        const dt = app.ticker.deltaTime / 1000;
        if (client.state != null)
        {
            client.pushCommand({
                clientTick:{id:client.id}
            }, false);
        }
    
        iterations++;
    });




});


