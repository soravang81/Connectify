import { Socket } from "socket.io";
import { getSocketId } from "../../lib/functions";

export const onOffer = async(
    socket : Socket ,
    data : { 
        sid : number ,
        rid : number ,
        offer : any
    })=>{
        console.log(data)
        const r_socket = await getSocketId(data.rid)
        r_socket ? socket.to(r_socket).emit("VIDEO_OFFER_IN",{
            sid : data.sid,
            rid : data.rid,
            offer : data.offer
        }) : console.log("receiver id error on onOffer")//TODO : emit is offline(if not rsocket but is rid)
    }

export const onAnswer = async(
    socket : Socket , 
    data : {
        sid : number,
        rid : number,
        answer : any
    })=>{
        console.log(data)
        const r_socket = await getSocketId(data.rid)
        r_socket? socket.to(r_socket).emit("VIDEO_ANSWER_IN",{
            sid : data.sid,
            rid : data.rid,
            answer : data.answer
        }) : console.log("receiver id error on onAnswer")//TODO : emit is offline(if not rsocket but is rid)
}
export const onNegotiation = async(
    socket : Socket , 
    data : {
        sid : number,
        rid : number,
        offer : any
    })=>{
        console.log(data)
        const r_socket = await getSocketId(data.rid)
        r_socket? socket.to(r_socket).emit("VIDEO_NEGOTIATION_IN",{
            sid : data.sid,
            rid : data.rid,
            offer : data.offer
        }) : console.log("receiver id error on onNegotiation")//TODO : emit is offline(if not rsocket but is rid)
}
export const onNegotiationEnd = async(
    socket : Socket , 
    data : {
        sid : number,
        rid : number,
        answer : any
    })=>{
        console.log(data)
        const r_socket = await getSocketId(data.rid)
        r_socket? socket.to(r_socket).emit("VIDEO_NEGOTIATION_DONE",{
            sid : data.sid,
            rid : data.rid,
            answer : data.answer
        }) : console.log("receiver id error on negotiation end")//TODO : emit is offline(if not rsocket but is rid)
}
export const onVideoEnd = async(
    socket : Socket , 
    data : {
        sid : number,
        rid : number,
    })=>{
        console.log(data)
        const r_socket = await getSocketId(data.rid)
        r_socket? socket.to(r_socket).emit("VIDEO_END",{
            sid : data.sid,
            rid : data.rid,
        }) : console.log("receiver id error on on video end")//TODO : emit is offline(if not rsocket but is rid)
}