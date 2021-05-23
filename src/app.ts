import express from "express";
import expressWs from "express-ws";
import RoomMember from "./RoomMember";

//Routes
import APIRouter from "./routes/api";


//App
export const {app} = expressWs(express());

//Serve static files
app.use(express.static('static/'));
app.use(express.json());

//Set up routes
app.use("/api", APIRouter);


//*Websocket Routes
app.ws("/room/:ID", function (ws, req, next) {
    try {
        const owner = req.params.owner ? true : false;
        const user = new RoomMember(
            ws.send.bind(ws),
            req.params.ID,
            owner);

        //Set up socket handlers
        ws.on('message', function(data) {
            try {
                user.handleMessage(data)
            }
            catch (e) {
                console.error(e);
            }
        });

        ws.on('close', function() {
            try {
                user.handleCloseConnection();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    catch (e) {
        console.error(e);
    }
});

//TODO: Update to always serve the Frontend
app.get("/room/:ID", function(req, res, next) {
    res.sendFile(`${__dirname}/chat.html`);
});


//Error catch
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (process.env.NODE_ENV === "test") {
        console.error(err.stack);
    }
    const status = err.status || 500;
    
    return res.status(status).json({error: {message: err.message, status}});
});
