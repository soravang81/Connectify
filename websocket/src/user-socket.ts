interface props {
    [userEmail: string]: string
}
export let Sockets:props = {};

export const userSocket = (userEmail:string, socketId:string) => {
    Sockets = {
        ...Sockets,
        [userEmail]: socketId,
    };
};
export const removeSocket = (socketId:string)=>{
    for (const key in Sockets) {
        if (Sockets[key] === socketId) {
            delete Sockets[key];
        }
    }
}
