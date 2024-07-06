"use client"
import { useRecoilValue } from "recoil"
import { getSelectedFriends, selectFriends } from "../utils/recoil/state"
import { SelectFriends } from "./selectfriends"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { createGroup } from "../app/actions/groupChat"
import { useState } from "react"
import { toast } from "sonner"
import { getSession } from "next-auth/react"

export const GroupCreateForm = ()=>{
    const selectedFriends = useRecoilValue<number[]>(getSelectedFriends)
    const [groupName , setGroupName] = useState("")
    //todo add profile pic
    const handleSubmit = async()=>{
        console.log(selectedFriends.length)
        const session = await getSession()
        if(selectedFriends.length === 0){
            toast.error("Must specify at least one friend")
        }
        if(session){
            const newSelectedFriends = [...selectedFriends , session.user.id]//add myself also

            const res = await createGroup({groupName , memberIds : newSelectedFriends , userId : session.user.id})
            if(res === true){toast.success("Group created successfully !")}
            else{toast.error(res)}
        }
        else {
            toast.error("Session error ! Try to login again.")
        }
    }
    return (
        <div className="flex flex-col items-start p-2 gap-3">
            <div className="flex flex-col gap-3 pb-2">
            <Label htmlFor="name" className="">
            Group name
            </Label>
            <Input
            id="name"
            placeholder="Backbenchers"
            className="col-span-3"
            onChange={(e)=>setGroupName(e.target.value)}
            />
            </div>
            <SelectFriends/>
            <Button type="button" onClick={handleSubmit}>Send</Button>
        </div>
    )
}