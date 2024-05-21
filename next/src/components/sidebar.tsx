import { Button } from "@/src/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet , SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet"
import { signOut } from "next-auth/react"

export const Sidebar = () =>{
    const logOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        "use server"
        e.preventDefault();
        await signOut();
    }
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
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant={"ghost"} size={"lg"} fn={logOut}className="text-xl w-80">Logout</Button>
                    </SheetClose>
                </SheetFooter>
            </div>
            </SheetContent>
        </Sheet>
    )
}