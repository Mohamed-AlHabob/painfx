"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { SimpleModal } from "@/components/global/simple-modal"
import { useRetrieveUserQuery } from "@/redux/services/auth/authApiSlice"
import { Spinner } from "@/components/spinner"
import PostContent from "../post-content"

const CreateNewPost = () => {
  const { data: user, isLoading } = useRetrieveUserQuery();
  
  if (isLoading) return <div className="flex justify-center items-center">
    <Spinner />
  </div> 

  

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
            <AvatarImage src={user?.profile.avatar} alt="user" />
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

export default CreateNewPost
