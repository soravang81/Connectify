interface props {
    socketId?: string,
    userId? : number
}
export let Sockets:props[] = [];

export const userSocket = ( socketId:string , userId:number) => {
    const newSockets = {
        socketId: socketId,
        userId: userId,
    };
    Sockets.push(newSockets)
};
export const removeSocket = (id: string | number)=>{
    if(typeof id === "string"){
        const index = Sockets.findIndex(s => s.socketId === id);
        Sockets.splice(index, 1)[0];
        console.log(Sockets)
    }
    else{
        const index = Sockets.findIndex(s => s.userId === id);
        Sockets.splice(index, 1)[0];
        console.log(Sockets)
    }
}
