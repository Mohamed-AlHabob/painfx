"use client";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  User,
  Clock,
  Briefcase,
  Database,
  BookOpen,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { Avatar,  AvatarImage } from "@radix-ui/react-avatar";
import { useGetDoctorByIdQuery } from "@/redux/services/booking/DoctorApiSlice";
import { Doctor } from "@/schemas";
import { useModal } from "@/hooks/use-modal-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, User, Clock, Briefcase } from "lucide-react";

type DoctorInfoPageProps = {
  userId?: string;
};

export default function DoctorInfoPage({ userId }: DoctorInfoPageProps) {
  // Fetch doctor data
  const { data, isLoading, isError } = useGetDoctorByIdQuery(userId);
  const doctorData = (data as Doctor) || {};
  const { onOpen } = useModal();

  // Handle loading and error states
  if (isLoading) {
    return <DoctorInfoPage.DoctorInfoSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center mt-8 text-red-500">
        Failed to fetch doctor details. Please try again later.
      </div>
    );
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
                <AvatarImage
                  className="h-full w-full rounded-full object-cover"
                  src={doctorData?.user?.profile?.avatar || ""}
                  alt={doctorData?.user?.first_name || ""}
                />
                {/* <AvatarFallback>{doctorData?.user?.first_name?.charAt(0) || ""}</AvatarFallback> */}
              </Avatar>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-yellow-400/90 px-3 py-0.5 rounded-full">
              <Trophy className="h-3 w-3" />
              <span className="text-xs font-medium">
                {doctorData?.specialization?.name || "Specialization not provided"}
              </span>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="text-sm">{doctorData?.user?.email || "Email not provided"}</div>
            <h1 className="text-2xl font-bold">
              {doctorData?.user?.first_name || " "} {doctorData?.user?.last_name || " "}
            </h1>
            {doctorData?.user?.profile?.gander && (
              <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
                <User className="h-4 w-4" />
                  Gender: {doctorData?.user?.profile?.gander || "Not specified"}
              </div>
             )}
            <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
              <Clock className="h-4 w-4" />
              Joined{" "}
              {new Date(doctorData?.user?.date_joined || "").toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}{" "}
              · Last seen{" "}
              {new Date(doctorData?.user?.last_login || "").toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
            {doctorData?.user?.profile?.bio && (
              <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
                <Briefcase className="h-4 w-4" />
                {doctorData?.user?.profile?.bio}
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
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                onOpen("CreateReservation", { DoctorId: userId })
              }
              disabled={!doctorData?.reservation_open}
              className={`flex items-center ${
                !doctorData?.reservation_open ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  doctorData?.reservation_open ? "bg-green-400" : "bg-orange-400"
                }`}
              />
              <span>
                {doctorData?.reservation_open
                  ? "Reservation"
                  : "Reservation Closed"}
              </span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-[#1C1C1C] text-white hover:bg-gray-800"
            >
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

DoctorInfoPage.Skeleton = function DoctorInfoSkeleton() {
  return (
    <div className="relative">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-lg p-8">
        <div className="relative flex flex-col items-center sm:items-start sm:flex-row gap-6">
          {/* Avatar Skeleton */}
          <div className="relative">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-yellow-400/90 px-3 py-0.5 rounded-full">
              <Trophy className="h-3 w-3" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
          {/* Doctor Details Skeleton */}
          <div className="flex-1 text-center sm:text-left">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-6 w-60 mb-2" />
            <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
              <User className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
              <Clock className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
              <Briefcase className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Skeleton */}
      <nav className="mt-6 border-b border-gray-800">
        <div className="flex gap-6 text-sm">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-4 w-24" />
          ))}
        </div>
      </nav>
      {/* Achievements Section Skeleton */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-8 w-24" />
            ))}
          </div>
        </div>
        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="rounded-lg p-4">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-3 w-16 mb-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
