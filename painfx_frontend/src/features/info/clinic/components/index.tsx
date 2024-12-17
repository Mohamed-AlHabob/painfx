"use client";
import { Button } from "@/components/ui/button";
import { Trophy, User, Clock, Briefcase, Database, BookOpen, MessageSquare, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Clinic } from "@/schemas";
import { useModal } from "@/hooks/use-modal-store";
import { useGetClinicByIdQuery } from "@/redux/services/booking/ClinicApiSlice";

type ClinicInfoPageProps = {
  clinicId?: string;
};

export default function ClinicInfoPage({ clinicId }: ClinicInfoPageProps) {
  // Fetch doctor data
  const { data, isLoading, isError } = useGetClinicByIdQuery(clinicId);
  const clinicData = data as Clinic || {};
  const { onOpen} = useModal()

  // Handle loading and error states
  if (isLoading) {
    return <div className="text-center mt-8">Loading doctor information...</div>;
  }

  if (isError) {
    return <div className="text-center mt-8 text-red-500">Failed to fetch doctor details. Please try again later.</div>;
  }

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-lg p-8">
        {/* Decorative Background */}
        <div className="absolute right-0 top-0 h-full w-1/3">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFD700] via-[#4CAF50] to-[#2196F3] opacity-20 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center sm:items-start sm:flex-row gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="h-32 w-32 rounded-full p-1 bg-yellow-400">
              <Avatar>
                <AvatarImage className="h-full w-full rounded-full object-cover"
                  src={clinicData?.icon || ""}
                  alt={clinicData?.name || ""}
                />
                {/* <AvatarFallback>{doctorData?.user?.first_name?.charAt(0) || ""}</AvatarFallback> */}
              </Avatar>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-yellow-400/90 px-3 py-0.5 rounded-full">
              <Trophy className="h-3 w-3" />
              <span className="text-xs font-medium">{clinicData?.specialization?.name || "Specialization not provided"}</span>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="text-sm">{clinicData?.owner?.email || "Email not provided"}</div>
            <h1 className="text-2xl font-bold">
              {clinicData?.owner?.first_name || " "} {clinicData?.owner?.last_name || " "}
            </h1>
            <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
              <User className="h-4 w-4" />
              Gender: {clinicData?.owner?.profile?.gander || "Not specified"}
            </div>
            <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
              <Clock className="h-4 w-4" />
              Joined {new Date(clinicData?.owner?.date_joined || "").toLocaleDateString("en-US", { month: "short", year: "numeric" })} · Last seen {new Date(clinicData?.owner?.last_login || "").toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
            {clinicData?.owner?.profile?.bio && (
              <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
                <Briefcase className="h-4 w-4" />
                {clinicData?.owner?.profile?.bio}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 border-b border-gray-800">
        <div className="flex gap-6 text-sm">
          {["About", "Competitions", "Datasets"].map((item) => (
            <Button key={item} variant="link" className="px-0 hover:no-underline">
              {item}
            </Button>
          ))}
        </div>
      </nav>

      {/* Achievements Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">PainFX Achievements</h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onOpen("CreateReservation", { ClinicId:clinicId })}>
             Reservation
            </Button>
            <Button variant="secondary" size="sm" className="bg-[#1C1C1C] text-white hover:bg-gray-800">
              Contact
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Competitions */}
          <div className="rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="font-medium">Competitions Grandmaster</span>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="text-sm">42</span>
              </div>
            </div>
          </div>

          {/* Datasets */}
          <div className="rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-blue-400" />
              <span className="font-medium">Datasets Contributor</span>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="text-sm">1</span>
              </div>
            </div>
          </div>

          {/* Notebooks */}
          <div className="rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <span className="font-medium">Notebooks Contributor</span>
            </div>
          </div>

          {/* Discussions */}
          <div className="rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Discussions Expert</span>
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Awards</h2>
          <div className="text-sm text-gray-500">No awards data available.</div>
        </div>
      </div>
    </div>
  );
}
