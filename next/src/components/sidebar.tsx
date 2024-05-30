import { Button } from "@/src/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet , SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet"
import { LogOut } from "../utils/functions/lib";

export const Sidebar = () =>{
    return(
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"outline"} size={"icon"} className=""><Menu/></Button>
            </SheetTrigger>
            <SheetContent>
            <div className="flex flex-col items-center gap-4">
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                    </SheetHeader>
                    <Button variant={"ghost"} size={"lg"} href={"/"} className="text-xl w-80">Home</Button>
                    <Button variant={"ghost"} size={"lg"} href={"/"}className="text-xl w-80">Profile</Button>
                    <Button variant={"ghost"} size={"lg"} className="text-xl w-80" href="/signin">Login</Button>
                    <Button variant={"ghost"} size={"lg"} className="text-xl w-80" href="/signup">Signup</Button>
                <SheetFooter>
                    <SheetClose asChild>
                        {/* <LogOut/> */}
                    </SheetClose>
                </SheetFooter>
            </div>
            </SheetContent>
        </Sheet>
    )
}