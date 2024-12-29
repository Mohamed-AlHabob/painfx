import ProflilePage from "@/features/proflile/components"

export default async function UserProfilePage({ params }: { params: Promise<{ profileId: string }> }) {
  const ProfileId = (await params).profileId
  return (
    <ProflilePage userId={ProfileId} />
  )
}
