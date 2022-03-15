import { Application } from "express";
import http from 'http'
import { Server, Socket } from "socket.io";

interface INewLobby {
    pin: number
    lobby: string | string[]
}

export default async (expressApp: Application) => {
    const httpServer = http.createServer(expressApp)

    const socketServer = new Server(httpServer, {
        cors: { origin: '*' }
    })

    const socketRooms: Map<number, string | string[]> = new Map()

    socketServer.on('connection', (socketConnection: Socket) => {
        console.log(`Socket: ${socketConnection.id} connected`)

        socketConnection.on('new_lobby', (newLobby: INewLobby) => {
            socketRooms.set(newLobby.pin, newLobby.lobby)
            socketConnection.join(socketRooms.get(newLobby.pin)!)
            console.log(socketRooms.get(newLobby.pin))
        })

        socketConnection.on('join_lobby', (pin: number) => {
            socketConnection.join(socketRooms.get(pin)!)
            console.log(socketRooms.get(pin))
        })
    })

    httpServer.listen(process.env.WS_PORT)
}