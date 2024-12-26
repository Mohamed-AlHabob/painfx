'use client';
import { useGetClinicsByOwnerIdQuery } from "@/redux/services/booking/ClinicApiSlice";
import { FeatureCard } from "../../components/feature-card";
import { Box, Fingerprint, LayoutTemplate } from "lucide-react";
import { StatCard } from "../../components/stat-card";
import { ActivityList } from "../../components/activity-list";
import { useRetrieveUserQuery } from "@/redux/services/auth/authApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { NoResult } from "@/components/global/no-results";

export default function OverviewPage() {
  const { data: user, isLoading:isLoadingUser,isFetching } = useRetrieveUserQuery();
  const { data, isLoading, isError } = useGetClinicsByOwnerIdQuery({ ownerId: user?.id ||"" , page: 1 });

  console.log("Clinic Data:", data);
  const clinic = data?.results?.[0] || null;

  if (isLoading || isLoadingUser || isFetching) {
    return (
      <>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          <Skeleton className="h-6 w-3/4" />
        </h1>
        <p className="text-muted-foreground">
          <Skeleton className="h-4 w-full" />
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <FeatureCard.Skeleton key={i} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCard.Skeleton key={i} />
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <ActivityList.Skeleton />
        <ActivityList.Skeleton />
      </div>
    </>
    )
  }

  if (isError || !clinic) {
    return <NoResult message="No doctors found" backTo={"/X"} />;
   
  }

  const totalDoctors = clinic?.doctors?.length || 0;
  const ownerName = clinic?.owner?.first_name
    ? `${clinic.owner?.first_name} ${clinic.owner.last_name}`
    : "Owner";
  const activeReservations = 0; 
  const reservationsOfTheDay =  0;
  const totalPatients =  0;

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span
            className={`h-4 w-4 rounded-full ${
              clinic.active ? 'bg-green-400' : 'bg-orange-400'
            }`}
          />
          <span className="text-lg font-semibold">
            {clinic.active ? "Active" : "Inactive"}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, Dr. {ownerName}. Your clinic, {clinic.name}, is{" "}
          {clinic.active ? "ready for reservations!" : "not ready yet."}
        </h1>
        <p className="text-muted-foreground">
        {clinic.active ? "PainEX makes it easy for you to manage your clinics and doctors. Discover how to get the most out of this service, customize PainFX to fit your specific needs, and set up your clinic integration for general use." : "Information is currently being verified. Please wait as we will notify you of updates."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          icon={Box}
          title="Build Your Clinic&apos;s Online Presence"
          description="Create a professional profile for your clinic and showcase your doctors&apos; expertise to attract more patients."
        />
        <FeatureCard
          icon={LayoutTemplate}
          title="Streamline Appointment Management"
          description="Manage reservations seamlessly with our automated booking system, and ensure every patient gets the care they need."
        />
        <FeatureCard
          icon={Fingerprint}
          title="Boost Your Clinic&apos;s Reputation"
          description="Encourage patients to review and rate your clinic to build trust and improve visibility within the community."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Doctors"
          value={totalDoctors}
          period="All time"
        />
        <StatCard
          title="Active Reservations"
          value={activeReservations}
          period="December 2024"
        />
        <StatCard
          title="Reservations of the day"
          value={reservationsOfTheDay}
          period="December 2024"
        />
        <StatCard
          title="Total Patients"
          value={totalPatients}
          period="December 2024"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ActivityList
          title="Recent Doctors"
          doctors={clinic.doctors || []}
        />
        <ActivityList
          title="Recent Reservations"
          doctors={clinic.doctors || []}
        />
      </div>
    </>
  );
}
