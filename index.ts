
export interface Thing
{
    /** The id of the owner of he thing */
    owner?:string;

    /** Server position of thing */
    position:{x:number, y:number};

    /** Prev position of thing */
    prevPosition:{x:number,y:number;}

    atlas:number;
    frame:number;

    client?:{
        x:number;
        y:number;
        zIndex:number;
    }
}


export interface Tile
{

}

export interface State
{
    things:{readonly [id:string]:Thing};
    tilemap: {
        readonly width:number;
        readonly height:number;
        readonly layers:Tile[][];
    };

    input:{[id:string]:{x:number, y:number}[]}
}


export interface Command
{
    setThings?:{[id:string]:Thing};
    spreadThings?:{[id:string]:Partial<Thing>}
    deleteThings?:{[id:string]:any};
    playerConnected?:{id:string};
    clientDisconnected?:{id:string};
    serverTick?:{};
    clientTick?:{id:string};
    clientMove?:{x:number, y:number};
}

export const initialState:State = {
    things:{},
    tilemap:{width:0, height:0, layers:[]},
    input:{}
}

export function getThingsOfOwner(state:State, owner:string)
{
    return Object.entries(state.things).filter(v=>v[1].owner == owner);
}

export * from './handlers';