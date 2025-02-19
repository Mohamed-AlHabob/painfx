"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useRetrieveUserQuery } from "@/redux/services/auth/authApiSlice"
import { Skeleton } from "@/components/ui/skeleton"
import PostContent from "../post-content"


export const CreateNewPost = () => {
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery()

  if (isLoading || isFetching) {
    return <CreateNewPost.Skeleton />
  }

  if (user?.role !== "doctor" && user?.role !== "clinic") {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-accent transition-colors">
          <CardContent className="p-4 flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.profile?.avatar || ""} alt={user.first_name || "User"} />
              <AvatarFallback>{user.first_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">Type / to add elements to your post...</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={user.profile?.avatar || ""} alt={user.first_name || "User"} />
            <AvatarFallback>{user.first_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.first_name || "User"}</p>
            <p className="text-xs text-muted-foreground">
              Posting as <span className="font-semibold capitalize">{user.role}</span>
            </p>
          </div>
        </div>
        <PostContent />
      </DialogContent>
    </Dialog>
  )
}

CreateNewPost.Skeleton = function CreateNewPostSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-[200px]" />
      </CardContent>
    </Card>
  )
}

