import ClinicInfoPage from "@/features/info/clinic/components";

const UserProfilePage = async ({ params }: {params: Promise<{ clinicId: string }> }) => {
  const clinicId = (await params).clinicId
return ( 
  <div className="">
    <ClinicInfoPage clinicId={clinicId} />
  </div>

  );
}
 
export default UserProfilePage;