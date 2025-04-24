"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { SparklesIcon } from "lucide-react"
import { dict } from "@/lib/dictionary"

export function UserNav() {
  const router = useRouter()

  // Mock user data
  const user = {
    name: "Jan Jansen",
    email: "jan@example.com",
    image: null,
  }

  const handleLogout = () => {
    // This would be replaced with actual logout logic
    router.push("/")
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" className="rounded-full h-8 w-8 p-0 relative">
        <SparklesIcon className="h-4 w-4 text-[#8A4FFF]" />
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#FF4F8A] text-[10px] text-white rounded-full flex items-center justify-center">
          3
        </span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full border-2 border-[#8A4FFF]/20 p-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#8A4FFF] to-[#FF4F8A] text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings/profile")}
              className="cursor-pointer hover:bg-[#8A4FFF]/10 hover:text-[#8A4FFF] rounded-lg transition-colors"
            >
              {dict.common.account}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings/billing")}
              className="cursor-pointer hover:bg-[#8A4FFF]/10 hover:text-[#8A4FFF] rounded-lg transition-colors"
            >
              {dict.common.billing}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className="cursor-pointer hover:bg-[#8A4FFF]/10 hover:text-[#8A4FFF] rounded-lg transition-colors"
            >
              {dict.common.settings}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
          >
            {dict.common.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
