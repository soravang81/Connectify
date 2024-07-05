import { CircleEllipsis, Menu, MessageCircleOff, Trash, UserX } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { isDialog } from "../utils/recoil/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { unFriend } from "../app/actions/unfriend";
import { toast } from "sonner";

const handleClick = async(action: string , fid : number) => {
  const session = await getSession()
  switch (action) {
    case "Unfriend":
    if(session?.user.id){
      const res = await unFriend(session.user.id , fid)
      res ? toast.success("Unfriend Succesfully !") : toast.error("Error while removing Friend !")
    }
    else {
      toast.error("Unauthorized");
    }
    break;
    case "Block":
      console.log("blocked");
      break;
    case "Clear chat":
      console.log("chat cleared");
      break;
  }
};

export function DropDownMenu({friendId}:{friendId : number}) {
  const [isDialogOpen, setIsDialogOpen] = useRecoilState(isDialog);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const fid = friendId
  console.log(fid)

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  const handleItemClick = (action: string ) => {
    handleDropdownClose();
    setSelectedAction(action);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="lg:mr-10 md:mr-5 sm:mr-2 p-0 hover:bg-slate-700 focus:border-none focus-visible:border-none flex justify-center items-center"
          >
            <Menu size={30} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 self-start flex flex-col">
          <DropdownMenuItem className="p-0" onClick={() => handleItemClick("Unfriend")}>
            <Button variant="ghost" className="w-full h-full flex gap-3 justify-start">
              <UserX size={22} />
              Unfriend
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0" onClick={() => handleItemClick("Block")}>
            <Button variant="ghost" className="w-full h-full flex gap-3 justify-start">
              <MessageCircleOff size={22} />
              Block
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0" onClick={() => handleItemClick("Clear chat")}>
            <Button variant="ghost" className="w-full h-full flex gap-3 justify-start">
              <Trash size={22} />
              Clear chat
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="hidden">Trigger Alert</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to {selectedAction}?</AlertDialogTitle>
            <AlertDialogDescription>
               This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleClick(selectedAction , fid);
                setIsDialogOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
