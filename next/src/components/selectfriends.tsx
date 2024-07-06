import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
import { useRecoilState, useRecoilValue } from "recoil"
import { selectFriends, userData } from "../utils/recoil/state"
import { Checkbox } from "../components/ui/checkbox"
import { Label } from "./ui/label"

export function SelectFriends() {
  const [open, setOpen] = React.useState(false)
  const [selectedFriends, setSelectedFriends] = useRecoilState<number[]>(selectFriends)
  const userdata = useRecoilValue(userData)
  const friends = userdata.friends

  const handleSelectFriend = (friendId: number) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen} >
        <Label htmlFor="members" className="">
        Members
        </Label>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          id="members"
        >
          {selectedFriends.length > 0
            ? `${selectedFriends.length} friend(s) selected`
            : "Select friends..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[200px] p-0" >
        <Command>
          <CommandInput placeholder="Search friends..." />
          <CommandList>
            <CommandEmpty>No friends found.</CommandEmpty>
            <CommandGroup>
              {friends.map((friend) => (
                <CommandItem
                  key={friend.id}
                  value={friend.username}
                  className="flex items-center cursor-pointer"
                >
                  <label className="flex items-center cursor-pointer w-full">
                    <Checkbox
                      checked={selectedFriends.includes(friend.id)}
                      onCheckedChange={() => handleSelectFriend(friend.id)}
                      className="mr-2"
                    />
                    <span className="flex-1">{friend.username}</span>
                  </label>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
