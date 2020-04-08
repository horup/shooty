import { BoardState, BoardTileMap, BoardThing, BoardTile } from "pixigamelib";

export interface Thing extends BoardThing
{
    /** The id of the owner of he thing */
    owner?:string;
}

export interface Tile extends BoardTile
{

}

export interface State extends BoardState
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
    deleteThings?:string[];
    playerConnected?:{id:string};
    clientDisconnected?:{id:string};
    serverTick?:{};
    clientTick?:{id:string};
    input?:{x:number, y:number};
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