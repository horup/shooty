const port = process.env.PORT || 8080;
import * as express from 'express';
const app = express();

app.use(express.static('./client'));
app.use(express.static('./dist/client'));



app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})
