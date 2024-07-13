import { getSession } from "next-auth/react"
import { socket } from "../socket/io"
import pc from "./video"

export const sendOffer = async (sid : number ,rid: number , offer : any) => {
  socket.emit("VIDEO_OFFER_OUT", {
    sid,
    rid,
    offer
  })
  console.log("sent offer")
}