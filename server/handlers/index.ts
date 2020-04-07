
import {State, Command, Thing, getThingsOfOwner} from '../..';
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


export const inputHandler:Handler<State, Command> = (s, c, p, o)=>
{
    if (c.input)
    {
        if (s.input[o] == null)
            s.input[o] = [];
        s.input[o].push(c.input);
    }
}

export const tickHandler:Handler<State, Command> = (s, c, p)=>
{
    if (c.tick)
    {
        for (let id in s.input)
        {
            let thing = getThingsOfOwner(s, id)[0];
            if (thing != null)
            {
                let t = {...thing[1]};
                let inputs = s.input[id];
                for (let input of inputs)
                {
                    // no validation
                    t.x = input.x;
                    t.y = input.y;
                }

                if (t.x != thing[1].x || t.y != thing[1].y)
                {
                    p({
                        setThings:{
                            [thing[0]]:t
                        }
                    }, true);
                }
            } 
        }

        s.input = {};
    }
}