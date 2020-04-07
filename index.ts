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
}

export interface Command
{
    setThings?:{[id:string]:Thing};
    deleteThings?:string[];
    playerConnected?:{id:string};
    clientDisconnected?:{id:string};
    tick?:{};
}

export const initialState:State = {
    things:{},
    tilemap:{width:0, height:0, layers:[]}
}

export * from './handlers';