import {State, Command, Thing} from '.';
import {Handler} from 'cmdserverclient';

export const setThingsHandler:Handler<State, Command> = (s,c,p)=>
{
    if (c.setThings)
    {
        s.things = {...s.things, ...c.setThings};
    }
    else if (c.spreadThings)
    {
        let things:{[id:string]:Thing} = {}
        for (let id in c.spreadThings)
        {
            if (s.things[id])
            {
                things[id] = {...s.things[id], ...c.spreadThings[id]};
            }
        }

        s.things = {...s.things, ...things};
    }
}

export const deleteThingsHandler:Handler<State, Command> = (s,c,p)=>
{
    if (c.deleteThings)
    {
        let things = {...s.things};
        for (let id in c.deleteThings)
        {

            delete things[id];
        }

        s.things = things;
    }
}