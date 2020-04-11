import {Handler} from 'cmdserverclient';
import {Command, getThingsOfOwner, State} from '../..';
import {TickrateCalculator, interpolateLinear} from 'pixigamelib';
import { Context } from '..';

const keys = {};
document.onkeydown = (e=>{
    keys[e.code] = true;
    console.log(e.code);
});

document.onkeyup = (e=>{
    delete keys[e.code];
});

const server = new TickrateCalculator(5);
const client = new TickrateCalculator(60);
export const tickHandler:Handler<State, Command, Context> = (s, c, p, o, context) =>
{
    if (c.deleteThings)
        context.sprites.removeSprites(c.deleteThings);

    if (c.serverTick)
    {
        Object.values(s.things).forEach(t=>{
            t.prevPosition = {...t.position};
        })
        server.tick();
    }
    
    if (c.clientTick)
        tickClient(s, c, context, p);
}

function tickClient(s: State, c: Command, context: Context, p:(cmd:Command, transmit:boolean)=>any) 
{
    Object.values(s.things).forEach(t => {
        if (!t.client)
            t.client = { x: t.position.x, y: t.position.y, zIndex: t.position.y };
    });
    const myId = c.clientTick.id;
    client.tick();
    let f = client.factor(server);
    const thing = getThingsOfOwner(s, myId)[0];
    if (thing != null) {
        const speed = 0.1;
        const t = thing[1];
            if (keys["KeyW"])
                t.client.y -= speed;
            else if (keys["KeyS"])
                t.client.y += speed;
            if (keys["KeyA"])
                t.client.x -= speed;
            else if (keys["KeyD"])
                t.client.x += speed;
            p({
                input:{
                    x:t.client.x,
                    y:t.client.y
                }
            }, true);
    }
    Object.entries(s.things).forEach(e => {
        const t = e[1];
        const id = e[0];
        if (t.owner != myId) {
            // interpolate things that are not mine
            t.client.x = interpolateLinear(t.prevPosition.x, t.position.x, f);
            t.client.y = interpolateLinear(t.prevPosition.y, t.position.y, f);
            t.client.zIndex = t.client.y;
        }
        else {
            // mutate based upon input queue
            // t.x = t.position.x;
            // t.y = t.position.y;
        }
        context.sprites.setSprites({
            [id]: { ...t.client, frame: t.frame, atlas: t.atlas }
        });
    });
}
