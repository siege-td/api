import { Application } from "express";
import http from 'http';
import { Server, Socket } from "socket.io";

interface IGameData {
    playerName: string
    hitpoints: number
    currency: number
    nextRound: boolean
}

export default async (expressApp: Application) => {
    const httpServer = http.createServer(expressApp)

    const socketServer = new Server(httpServer, {
        cors: { origin: '*' }
    })

    const socketRooms: Map<number, string | string[]> = new Map()
    const gameSessionsData: Map<number, IGameData[] | undefined> = new Map()

    socketServer.on('connection', (socketConnection: Socket) => {
        console.log(`Socket: ${socketConnection.id} connected`)

        socketConnection.on('new_lobby', (newPin: number) => {
            const roomName = `room${socketRooms.size}`
            socketConnection.join(roomName)
            // TODO: Add check for room that already exists
            for(let [key,] of socketRooms){
                if(newPin == key){
                    socketConnection.emit("create_pin_exists", { message: "Pin already exists" })
                    return
                }
            }
            socketRooms.set(newPin, roomName)
            gameSessionsData.set(newPin, [{
                playerName: socketConnection.id.substring(0, 6),
                hitpoints: 30,
                currency: 100,
                nextRound: true
            }])
            socketConnection.emit("create_pin_valid", { message: "Lobby created" })
            console.log(`Socket: ${socketConnection.id} created lobby with pin: ${newPin}`)
        })

        socketConnection.on('join_lobby', (pin: number) => {
             // First, check if room exists
             if (!socketRooms.get(pin)) {
                socketConnection.emit("join_pin_invalid", { message: "Pin invalid" })
                return
            }
            socketConnection.join(socketRooms.get(pin)!)
            socketConnection.emit("join_pin_valid", {message: "Pin valid"})
            const currentData = gameSessionsData.get(pin)
            
            currentData?.push({playerName: socketConnection.id.substring(0, 6),
                hitpoints: 30,
                currency: 100,
                nextRound: true
            })
            
            gameSessionsData.set(pin, currentData!)
            console.log(`Socket: ${socketConnection.id} joined lobby ${pin}, number in lobby: ${socketRooms.get(pin)?.length}`)
        })

        socketConnection.on('close_lobby', (pin: number) => {
            // Close socket room
            socketServer.in(socketRooms.get(pin)!).disconnectSockets(true)
            socketRooms.delete(pin)
            gameSessionsData.delete(pin)
        })

        socketConnection.on('update_game_data', (
            {
                pin, 
                playerName, 
                hitpoints, 
                currency,
                nextRound
            }: {
                pin: number, 
                playerName: string, 
                hitpoints: number, 
                currency: number,
                nextRound: boolean
            }) => {
            // First, check if room exists
            if (!socketRooms.get(pin)) {
                socketConnection.emit("error", { message: "Pin invalid" })
                return
            }
            // If exists, update data and emit
            const tempData = gameSessionsData.get(pin)

            if (tempData?.length === 1) {
                tempData[0] = { playerName, hitpoints, currency, nextRound }
                gameSessionsData.set(pin, tempData)
                console.log(`Updated data for socket: ${socketConnection.id}`)
            } else if (tempData !== undefined && tempData.length > 1) {
                for (let i = 0; i < tempData.length; i++) {
                    if (playerName === tempData[i].playerName) {
                        tempData[i] = { playerName, hitpoints, currency, nextRound }
                        gameSessionsData.set(pin, tempData)
                    }
                }
            }
            socketConnection.emit("updated_data", gameSessionsData.get(pin!))
            socketConnection.to(socketRooms.get(pin)!).emit("updated_data", gameSessionsData.get(pin!))
        })

        socketConnection.on("get_game_data_in_room", (pin: number) => {
            socketConnection.emit("game_data_in_room", gameSessionsData.get(pin))
        })

        socketConnection.on("start_game", (pin: number) => {
            socketConnection.to(socketRooms.get(pin)!).emit("game_started");
        })

        socketConnection.on("next_round", (pin: number) => {
            if(gameSessionsData.get(pin) == undefined){
                socketConnection.emit("next_round")
            } else {
                // set currents player nextround value to true
                let currData = gameSessionsData.get(pin)
                if (currData?.length === 1) {
                    currData[0].nextRound = true;
                } else if (currData!.length > 1) {
                    for (let i  = 0; i < currData!.length; i++) {
                        if (socketConnection.id.substring(0,5) === currData![i].playerName.substring(0,5)) {
                            currData![i].nextRound = true
                            gameSessionsData.set(pin, currData)
                        }
                    }
                }

                if(gameSessionsData.get(pin)?.every(v => v.nextRound === true)){

                    for(let value of gameSessionsData.get(pin)!){
                        value.nextRound = false
                    }
                    socketConnection.emit("next_round")
                    socketConnection.to(socketRooms.get(pin)!).emit("next_round")
                }
            }
        })
        socketConnection.on('disconnect', () => {
            for(let [key, value] of gameSessionsData){
                for(let i = 0; i < value!.length; i++){
                    if(socketConnection.id.substring(0,5) == value![i].playerName){
                        gameSessionsData.set(key,value?.splice(i,1))
                    }
                }
            }
        }) 
    })
    httpServer.listen(8877)
}