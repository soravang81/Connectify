"use client";

import { Container } from "@/src/components/container";
import { Button } from "@/src/components/ui/button";
import {  getImageUrlWithId, uploadImageToFirebase } from "@/src/utils/firebase/bucket";
import { ProfileSidebar, getProfilePic, profilePic } from "@/src/utils/recoil/state";
import axios from "axios";
import { UploadResult } from "firebase/storage";
import { ArrowLeft, CameraIcon, Copy, Edit, Upload, UploadIcon } from "lucide-react";
import { ChangeEvent, useEffect } from "react";
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import dotenv from "dotenv"
import { getUid } from "@/src/utils/functions/lib";
import { toast } from "sonner";
import { Input } from "@/src/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Label } from "./ui/label";
import { UserData, useUserData } from "../utils/hooks/userdata";
dotenv.config()

const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || ""

export const Profile = ()=> {
  const setImage = useSetRecoilState(profilePic);
  const imageState = useRecoilValueLoadable(getProfilePic);
  const {userData, updateUser} = useUserData()

  const handleImageInput = async(e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      try{
        setImage(file);
      }
      catch{
        console.error("Image upload error")
      }
    }
  };
  const handleUpload = async()=>{
    if(imageState.contents){
      const id = await getUid()
      if(id){
        const res = await uploadImageToFirebase(id , imageState.contents)
        if(res){
            const imageUrl = await getImageUrlWithId(id)
            if(imageUrl && imageUrl.url){
                updateUser({...userData , pfp: { path: imageUrl.path, link: imageUrl.url}})
                console.log(imageUrl.url);
                toast.success("Profile pic updated succesfully !")
            }
            else{
              toast.error("Error updating profile picture !")
            }
        }
      }
    }
  }
  const fetchCurrentPic = async() =>{
    const id = await getUid()
    if(id){
      const imageUrl = await getImageUrlWithId(id)
      imageUrl && imageUrl.url ?
      updateUser({...userData , pfp: { path: imageUrl.path, link: imageUrl.url}})

      : null
      console.log(imageUrl?.url)
      console.log(userData)
      return imageUrl?.url
    }
  }
  useEffect(()=>{
    fetchCurrentPic()
  },[])

  switch (imageState.state) {
    case "loading":
        return <p>Loading...</p>;
    case "hasError":
      toast.error("Error getting profile picture")
    case "hasValue":
      const image = imageState.contents;
      const fileUrl = image ? URL.createObjectURL(image) : userData.pfp.link//firestore img;

      return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"ghost"} size={"lg"} className="text-xl w-80">Profile</Button>
            </SheetTrigger>
            <SheetContent>
                <Container className="flex justify-center flex-col items-center gap-4 md:m-0 m-0">
                    <div className="flex justify-center items-center">
                    <div className="flex items-end justify-end w-fit border rounded-full">
                        <img src={fileUrl} alt={"profile"} className="md:w-52 md object-cover self-center md:h-52 h-32 w-32 rounded-full" />
                        <label htmlFor="file" className="absolute m-2 items-center justify-center md:p-4 p-1 bg-background hover:bg-foreground rounded-full border border-white text-white cursor-pointer transition-colors"><CameraIcon className="hover:text-background"/></label>
                        <input id="file" type="file" onChange={handleImageInput} className="hover:cursor-pointer inset-0 w-0 opacity-0 cursor-pointer"></input>
                    </div>
                    </div>
                    {imageState.contents && <Button onClick={handleUpload} variant={"default"} className="px-10">Upload</Button>}
                    <div className="flex flex-col gap-4">
                        <div>
                        <Label className="">username</Label>
                        <div className="flex gap-2">
                            <div className="flex justify-end">
                            <Input type="text" className="cursor-default" value={userData.username} readOnly />
                            <Button className="absolute bg-background hover:bg-slate-600 hover:border-0 self-center mr-1  px-1 py-0" size={"sm"} onClick={()=>{
                                navigator.clipboard.writeText(userData.username)
                                toast.success("Copied !")
                            }}><Copy className="text-foreground" /></Button>
                            </div>
                            <Button variant={'default'} size={"icon"}><Edit/></Button>
                        </div>
                        </div>

                        <div>
                        <Label>email</Label>
                        <div className="flex gap-2">
                            <div className="flex justify-end">
                                <Input type="text" className="cursor-default" value={userData.email} readOnly />
                                <Button className="absolute bg-background hover:bg-slate-600  hover:border-0 self-center mr-1  px-1 py-0" size={"sm"} onClick={()=>{
                                    navigator.clipboard.writeText(userData.email)
                                    toast.success("Copied !")
                                }}><Copy className="text-foreground"/></Button>
                            </div>
                            <Button variant={'default'} size={"icon"}><Edit/></Button>
                        </div>
                        </div> 
                    </div>
                </Container>
            </SheetContent>
        </Sheet>
      );
    default:
      return <div></div>
  }
}
