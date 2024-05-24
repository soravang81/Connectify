interface props {
    [userId: string]: string
}
export let Sockets:props = {};

export const userSocket = (userId:string, socketId:string) => {
    Sockets = {
        ...Sockets,
        [userId]: socketId,
    };
};
