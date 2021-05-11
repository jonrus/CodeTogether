import express from "express";
import expressWs from "express-ws";
import RoomMember from "./RoomMember";

//App
export const {app} = expressWs(express());

//Serve static files
// app.use(express.static('static/'));

console.log(__dirname);
//*Websocket Routes
app.ws("/rooms/:ID", function (ws, req, next) {
    try {
        const owner = req.params.owner ? true : false;
        const user = new RoomMember(
            ws.send.bind(ws),
            req.params.ID,
            req.params.name,
            owner)

        //Set up socket handlers
        ws.on('message', function(data) {
            try {
                user.handleNewChatMsg(data)
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