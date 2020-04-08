const port = process.env.PORT || 8080;
import * as express from 'express';
import {Server} from 'cmdserverclient';
import {State, Command, initialState} from '..';
import { setThingsHandler, deleteThingsHandler } from '../handlers';
import { spawnHandler, inputHandler as inputHandler, tickHandler } from './handlers';
const app = express();

app.use(express.static('./dist/client'));

const httpServer = app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});


const server = new Server<State, Command>(initialState, {
    info:(s)=>console.log(s)
});

server.handlers = [
    tickHandler,
    spawnHandler,
    setThingsHandler,
    deleteThingsHandler
]

server.clientHandlers = [
    inputHandler
]

server.onClientConnected = (id)=>
{
    server.pushCommand({
        playerConnected:{id:id}
    }, true)
}

server.onClientDisconnected = (id)=>
{
    server.pushCommand({
        clientDisconnected:{id:id}
    }, true)
}

server.attach(httpServer);
setInterval(()=>{
    server.pushCommand({
        serverTick:{}
    }, true);
}, 500);

