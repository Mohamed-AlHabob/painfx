import DoctorInfoPage from "@/features/info/user/components";


const UserProfilePage = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const userId = (await params).userId
return ( 
  <div className="">
    <DoctorInfoPage userId={userId} />
  </div>

  );
}
 
export default UserProfilePage;