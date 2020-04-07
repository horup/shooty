
import {State, Command, Thing} from '../..';
import {Handler} from 'cmdserverclient';
let nextId = 0;
export const spawnHandler:Handler<State, Command> = (s, c, p)=>
{
    if (c.playerConnected)
    {
        let thing:Thing = {
            atlas:1,
            frame:0,
            order:0,
            radius:1,
            x:Math.random()*10,
            y:Math.random()*10,
            owner:c.playerConnected.id
        }

        p({
            setThings:{
                [nextId++]:thing
            }
        }, true)
    }
    else if (c.clientDisconnected)
    {
        const my = Object.entries(s.things).filter(v=>v[1].owner == c.clientDisconnected.id);

        my.forEach(v=>p({deleteThings:[v[0]]}, true));
    }
    else if (c.tick)
    {
    }
}