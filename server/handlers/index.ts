
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
            prevPosition:{x:0, y:0},
            position:{x:Math.random()*10, y:Math.random()*10},
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
        let things = {};
        my.forEach(v=>things[v[0]]={});

        p({deleteThings:things}, true);
    }
    else if (c.serverTick)
    {
    }
}


export const inputHandler:Handler<State, Command> = (s, c, p, o)=>
{
    if (c.clientMove)
    {
        if (s.input[o] == null)
            s.input[o] = [];
        s.input[o].push(c.clientMove);
    }
}

export const tickHandler:Handler<State, Command> = (s, c, p)=>
{
    if (c.serverTick)
    {
        for (let id in s.input)
        {
            let thing = getThingsOfOwner(s, id)[0];
            if (thing != null)
            {
                let t = {...thing[1]};
                let inputs = s.input[id];
                t.prevPosition = thing[1].position;
                for (let input of inputs)
                {
                    // TODO: no validation yet
                    t.position = {x:input.x, y:input.y}
                }

                if (t.position.x != thing[1].position.x || t.position.y != thing[1].position.y)
                {
                    p({
                        spreadThings:{
                            [thing[0]]:{position:t.position}
                        }
                    }, true);
                  /*  p({
                        setThings:{
                            [thing[0]]:t
                        }
                    }, true);*/
                }
            } 
        }

        s.input = {};
    }
}