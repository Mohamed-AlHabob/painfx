import DoctorsPage from "@/features/control/doctors/components";

export default function UsersPage() {
  return (
      <main className="container max-w-7xl mx-auto p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            View and manage users
          </p>
        </div>
        <DoctorsPage/>
      </main>
  )
}

