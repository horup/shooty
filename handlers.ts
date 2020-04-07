import {State, Command} from '.';
import {Handler} from 'cmdserverclient';

export const setThingsHandler:Handler<State, Command> = (s,c,p)=>
{
    if (c.setThings)
    {
        s.things = {...s.things, ...c.setThings};
    }
}

export const deleteThingsHandler:Handler<State, Command> = (s,c,p)=>
{
    if (c.deleteThings)
    {
        let things = {...s.things};
        for (let id of c.deleteThings)
        {
            delete things[id];
        }

        s.things = things;
    }
}