import React from 'react'
import { Button } from './ui/button'
import { HousePlus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { GroupCreateForm } from './groupform'

export const CreateGroup = () => {
  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="text-sm text-foreground" >
                    <HousePlus/> 
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Create Groupchat</DialogTitle>
                <DialogDescription>
                    Enter your Group name.
                </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-start gap-3">
                    <GroupCreateForm/>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}
