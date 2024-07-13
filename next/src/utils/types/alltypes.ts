export interface sentMessage {
    id? : number
    message : string,
    sid : number,
    rid : number,
    time : Date
}
export interface messagesprop {
  id? : number 
  message : string,
  type : "sent" | "received"
  time : Date
}

export type status = "ONLINE" | "ONCHAT" | "OFFLINE";

export interface socketmessageprop{
    message : string;
    sid : number;
    rid : number;
    time : Date,
    seen : boolean
}
export interface statuss {
  sid : number
  status : {
    status : status
    id? : number
  }
}
export type SocketMessage = {
  message: string;
  seen: boolean;
  sid: number;
};

export type chatReceived = {
  message: string;
  sid: number;
  rid: number;
  time: Date;
  seen: boolean;
}[]