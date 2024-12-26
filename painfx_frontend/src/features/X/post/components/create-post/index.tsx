"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { SimpleModal } from "@/components/global/simple-modal"
import { useRetrieveUserQuery } from "@/redux/services/auth/authApiSlice"
import { Spinner } from "@/components/spinner"
import PostContent from "../post-content"
import { Skeleton } from "@/components/ui/skeleton"

export const CreateNewPost = () => {
  const { data: user, isLoading,isFetching } = useRetrieveUserQuery();
  
  if (isLoading || isFetching) 
  return (
     <CreateNewPost.Skeleton />
)

  return (
    <>
    {user?.role === "doctor"&&"clinic" ? (
      <SimpleModal
        trigger={
          <span className="">
            <Card className="dark:border-themeGray cursor-pointer first-letter:rounded-2xl overflow-hidden">
              <CardContent className="p-3 dark:bg-[#1A1A1D] flex gap-x-6 items-center ">
                <Avatar className="cursor-pointer">
                  <AvatarImage src="" alt="user" />
                  <AvatarFallback>{user?.first_name?.charAt(0) || "S"}</AvatarFallback>
                </Avatar>
                <CardDescription className="">
                  Type / to add elements to your post...
                </CardDescription>
              </CardContent>
            </Card>
          </span>
        }
      >
        <div className="flex gap-x-3">
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.profile?.avatar || ""} alt="user" />
            <AvatarFallback>{user?.first_name?.charAt(0) || "S"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className=" text-sm capitalize">{user?.first_name || "name"}</p>
            <p className="text-sm captialize ">
              Posting in{" "}
              <span className="font-bold capitalize ">
                {user.role}
              </span>
            </p>
          </div>
        </div>
        <PostContent />
      </SimpleModal>
      ):
      <span></span>
          // {/* <ReelCarousel /> */}
      }
    </>
  )
}


CreateNewPost.Skeleton = function PostInfoSkeleton({ level }: { level?: number }) {
  return (
    <div className=" w-full pt-4 dark:border-themeGray cursor-pointer first-letter:rounded-2xl overflow-hidden">
    <div className="flex items-center mb-3 px-4">
      <Skeleton className="w-12 h-12 mr-4 rounded-full dark:bg-[#202020]" />
      <div>
        <Skeleton className="h-5 w-24 rounded-md dark:bg-[#202020] mb-1" />
      </div>
    </div>
  </div>
  )
}