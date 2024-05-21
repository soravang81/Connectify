import { Button } from "@/src/components/ui/button"
import { Dialog,DialogTrigger,DialogContent } from "@/src/components/ui/dialog"
import { Plus } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function AddButton({ className, children, ...props }:InputProps){
    return(
        <div className={className}
        {...props}>
            <Dialog >
                <DialogTrigger asChild>
                    
                    <Button variant="outline" className="rounded-full p-4 h-auto bg-blue-700 text-white"><Plus/></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    {/* <AddNewContactPopup/> */}
                    {/* <Button variant={"ghost"} className="mt-2" fn={handleClick}>Add new contact</Button> */}
                    {children}
                    <Button variant={"ghost"} className="">Create new group</Button>
                    
                </DialogContent>
            </Dialog>
        </div>
        
    )
}

