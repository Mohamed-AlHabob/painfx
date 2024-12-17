'use client';
import { useGetClinicsQuery } from "@/redux/services/booking/ClinicApiSlice";
import { FeatureCard } from "../../components/feature-card";
import { Box, Fingerprint, LayoutTemplate } from "lucide-react";
import { StatCard } from "../../components/stat-card";
import { ActivityList } from "../../components/activity-list";

export default function OverviewPage() {
  const { data, isLoading, isError } = useGetClinicsQuery({ page: 1 });

  console.log("Clinic Data:", data);
  const clinic = data?.results?.[0] || null;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !clinic) {
    return <div>Error loading clinic data. Please try again later.</div>;
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
          title="Deploy your PainFX application to production"
          description="Get your application ready for production"
        />
        <FeatureCard
          icon={LayoutTemplate}
          title="Explore PainFX UI components"
          description="Customize the look and feel"
        />
        <FeatureCard
          icon={Fingerprint}
          title="Secure your application's backend"
          description="Learn how to verify sessions"
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
