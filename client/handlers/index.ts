import {Handler} from 'cmdserverclient';
import {State, Command, getThingsOfOwner} from '../..';
import {TickrateCalculator, interpolateLinear} from 'pixigamelib';

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
export const tickHandler:Handler<State, Command> = (s, c, p) =>
{
    if (c.serverTick)
        server.tick();
    if (!c.clientTick)
        return;
    const myId = c.clientTick.id;
    client.tick();
    let f = client.factor(server);
    const thing = getThingsOfOwner(s, myId)[0];
    if (thing != null)
    {
        const speed = 0.1;
        const t = thing[1];
        if (keys["KeyW"])
            t.y -= speed;
        else if (keys["KeyS"])
            t.y += speed;
        if (keys["KeyA"])
            t.x -= speed;
        else if (keys["KeyD"])
            t.x += speed;
        p({
            input:{
                x:t.x,
                y:t.y
            }
        }, true);
    }

    Object.values(s.things).forEach(t=>{
        if (t.owner != myId)
        {
            // interpolate things that are not mine
            t.x = interpolateLinear(t.prevPosition.x, t.position.x, f);
            t.y = interpolateLinear(t.prevPosition.y, t.position.y, f);
        }
        else
        {
            // mutate based upon input queue
           // t.x = t.position.x;
           // t.y = t.position.y;
        }
    });
}