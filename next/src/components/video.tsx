"use client";

import { DialogContent, DialogTrigger } from "./ui/dialog";
import { Dialog, DialogTitle } from "./ui/dialog";
import { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./ui/button";
import { Phone, Video } from "lucide-react";
import pc from "../utils/video/video";
import { sendOffer } from "../utils/video/socket";
import { useUserData } from "../utils/hooks/userdata";
import { socket } from "../utils/socket/io";
import { toast } from "sonner";

type TcallStatus = "Connecting" | "Connected" | "Disconnected";

export const VideoPopup = ({ id }: { id: number }) => {
  const [callStatus, setCallStatus] = useState<TcallStatus>("Disconnected");
  const { userData } = useUserData();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [friendStream, setFriendStream] = useState<MediaStream | null>(null);
  const [isVideoCall, setIsVideoCall] = useState<boolean>(false);

  const sid = userData.id;

  const sendStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      for (const track of stream.getTracks()) {
        pc.pc?.addTrack(track, stream);
      }
      console.log("stream sent", stream);
    } catch (error) {
      console.error("Error getting media stream:", error);
    }
  }, []);
  // const getStream = useCallback(async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     setMyStream(stream)
  //   } catch (error) {
  //     console.error("Error getting media stream:", error);
  //   }
  // }, []);

  const handleTrackEvent = useCallback((ev: RTCTrackEvent) => {
    console.log("GOT TRACKS !!: ", ev.streams[0]);
    setFriendStream(ev.streams[0]);
  }, []);

  const handleNegotiationNeeded = useCallback(async () => {
    try {
      console.log("Negotiation needed");
      const offer = await pc.pc?.createOffer();
      if (offer) {
        await pc.pc?.setLocalDescription(offer);
        console.log("Offer created:", offer);
        socket.emit("VIDEO_NEGOTIATION_OUT", {
          sid,
          rid: id,
          offer,
        });
      }
    } catch (error) {
      console.error("Error during negotiation:", error);
    }
  }, [sid, id]);

  const handleVideoNegotiationIn = useCallback(async (data: any) => {
    console.log("negotiation came");
    const answer = await pc.getAnswer(data.offer);
    console.log("negotiation answer: ", answer);
    socket.emit("VIDEO_NEGOTIATION_END", {
      sid: data.rid,
      rid: data.sid,
      answer,
    });
  }, []);

  const handleVideoNegotiationDone = useCallback(async (data: any) => {
    console.log("negotiation done");
    await pc.setRemoteDescription(data.answer);
  }, []);

  const handleVideoOfferIn = useCallback(async (data: any) => {
    console.log("call came", data);
    const friend = userData.friends.find((f) => f.id === data.sid);
    toast(`Incoming video call from ${friend?.username}`, {
      duration: 15000,
      action: {
        label: "Accept",
        onClick: async () => {
          // getStream()
          await sendStream();
          setIsVideoCall(true);
          console.log("received offer", data.offer);
          const answer = await pc.getAnswer(data.offer);
          setCallStatus("Connected");
          console.log("sending answer:", answer);
          socket.emit("VIDEO_ANSWER_OUT", {
            sid: data.rid,
            rid: data.sid,
            answer,
          });
        },
      },
    });
  }, [userData.friends, sendStream]);

  const handleVideoAnswerIn = useCallback(async (data: any) => {
    console.log("answer came", data.answer);
    await pc.setRemoteDescription(data.answer);
    await sendStream();
    const offer = await pc.getOffer();
    socket.emit("VIDEO_NEGOTIATION_OUT", {
      sid,
      rid: id,
      offer,
    });
  }, [sendStream]);

  const handleVideoCall = useCallback(async (sid: number, rid: number) => {
    setIsVideoCall(true);
    // getStream()
    console.log("clicked");
    const offer = await pc.getOffer();
    console.log("offer:", offer);
    sendOffer(sid, rid, offer);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
  }, []);

  const handleVideoEnd = useCallback(() => {
    console.log("Ending call");
    socket.emit("VIDEO_END",{
      sid,
      rid : id
    })
    // Stop all tracks in myStream
    myStream?.getTracks().forEach((track) => track.stop());
    // Stop all tracks in friendStream
    friendStream?.getTracks().forEach((track) => track.stop());

    // Close the peer connection
    pc.pc?.close();

    // Reset state
    setMyStream(null);
    setFriendStream(null);
    setIsVideoCall(false);
    setCallStatus("Disconnected");
  }, [myStream, friendStream]);

  useEffect(() => {
    const peerConnection = pc.pc;
    peerConnection?.addEventListener("track", handleTrackEvent);
    peerConnection?.addEventListener("negotiationneeded", handleNegotiationNeeded);

    return () => {
      peerConnection?.removeEventListener("track", handleTrackEvent);
      peerConnection?.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [handleTrackEvent, handleNegotiationNeeded]);

  useEffect(() => {
    socket.on("VIDEO_NEGOTIATION_IN", handleVideoNegotiationIn);
    socket.on("VIDEO_NEGOTIATION_DONE", handleVideoNegotiationDone);
    socket.on("VIDEO_OFFER_IN", handleVideoOfferIn);
    socket.on("VIDEO_ANSWER_IN", handleVideoAnswerIn);
    socket.on("VIDEO_END", handleVideoEnd);

    return () => {
      socket.off("VIDEO_NEGOTIATION_IN", handleVideoNegotiationIn);
      socket.off("VIDEO_NEGOTIATION_DONE", handleVideoNegotiationDone);
      socket.off("VIDEO_OFFER_IN", handleVideoOfferIn);
      socket.off("VIDEO_ANSWER_IN", handleVideoAnswerIn);
      socket.off("VIDEO_END", handleVideoEnd);
    };
  }, [handleVideoNegotiationIn, handleVideoNegotiationDone, handleVideoOfferIn, handleVideoAnswerIn]);

  useEffect(() => {
    if (friendStream) {
      console.log("Friend stream updated:", friendStream);
      console.log("Video tracks:", friendStream.getVideoTracks());
      console.log("Audio tracks:", friendStream.getAudioTracks());
    }
  }, [friendStream]);

  return (
    <Dialog open={isVideoCall} onOpenChange={setIsVideoCall}>
      <DialogTrigger asChild>
        <button
          onClick={() => handleVideoCall(sid, id)}
          className="p-1 hover:bg-slate-700 focus:border-none focus-visible:border-none flex justify-center items-center"
        >
          <Video size={30} className="text-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[26rem] h-[50rem] w-full">
        <div className="h-full w-full flex flex-col justify-center items-center">
          <DialogTitle>{callStatus}</DialogTitle>
          <h2>My Stream</h2>
          {myStream && (
            <ReactPlayer
              playing
              muted
              url={myStream}
              width={250}
              height={200}
            />
          )}
          <h2>Friend Stream</h2>
          {friendStream && (
            <ReactPlayer
              playing
              muted
              url={friendStream}
              width={250}
              height={200}
            />
          )}
          <Button type="submit" onClick={handleVideoEnd} size={"sm"} className="w-20 self-center">
            <Phone />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
