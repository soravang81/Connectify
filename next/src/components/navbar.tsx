import { Sidebar } from "@/src/components/sidebar";
import { ThemedSwitch } from "@/src/utils/theme/theme";
import { Button } from "@/src/components/ui/button";
import { Bell } from "lucide-react";
import { Notifications } from "./notifications";

export default function Navbar(){
    return(
        <div className="flex justify-between">
            <Button variant={"ghost"} size={"lg"} className="text-3xl font-semibold p-2 hover:bg-transparent hover:text-blue-400">Connectify</Button>
            <div className="flex gap-4 items-center">
                <Notifications/>
                <ThemedSwitch/>
                <Sidebar/>
            </div>
        </div>
    )
}