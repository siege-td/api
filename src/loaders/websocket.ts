import { Application } from "express";
import http from 'http'
import { Server, Socket } from "socket.io";

export default async (expressApp: Application) => {
    const httpServer = http.createServer(expressApp)

    const socketServer = new Server(httpServer, {
        cors: { origin: '*' }
    })

    socketServer.on('connection', (socket: Socket) => {
        socket.send('Radadiiiii')
    })

    httpServer.listen(process.env.WS_PORT)
}