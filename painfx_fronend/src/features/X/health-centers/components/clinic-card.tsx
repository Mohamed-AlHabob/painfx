'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, Database, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useGetClinicsQuery } from '@/redux/services/booking/ClinicApiSlice';
import { Clinic } from '@/schemas';
import { Spinner } from '@/components/spinner';
import Link from 'next/link';
import { useModal } from '@/hooks/use-modal-store';
import { NoResult } from '@/components/global/no-results';

export default function KaggleTimelineEnhanced() {
  const {onOpen} = useModal()
  const [expandedClinic, setExpandedClinic] = useState<string | null>(null);
  const { data, isLoading, error } = useGetClinicsQuery({page: 1});
 
  const toggleExpandedClinic = (id: string) => {
    setExpandedClinic((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!data || error || data.length === 0) {
    return <NoResult message={''} backTo={''}/>;
  }

  return (
    <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gray-700">
      <motion.div
        className="absolute left-[-5px] top-6 h-3 w-3 rounded-full bg-blue-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 flex items-center gap-2 text-gray-200"
      >
        <FileText className="h-4 w-4 text-blue-500" />
        <p className="text-sm font-medium">Clinics in your area</p>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4 text-sm text-gray-400"
      >
        The Clinics is now in an experimental state!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {data?.results.map((clinic: Clinic) => (
          <Card 
            key={clinic.id}
            className="w-full max-w-2xl mb-6 overflow-hidden bg-gradient-to-br from-[#2D3035] to-[#3D4045] shadow-lg"
          >
            <CardHeader className="p-0">
              <div className="relative h-40 bg-gradient-to-r from-[#8B5D4E] to-[#A67A6B] overflow-hidden">
                <div className="absolute inset-0 opacity-35">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: clinic.icon
                        ? `url("${clinic.icon}")`
                        : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-white/50">
                    <AvatarImage src={clinic.icon || ''} alt={clinic.name || ''} />
                    <AvatarFallback>{clinic.name?.[0] || 'S'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold text-xl">{clinic.name}</h2>
                    <p className="text-sm opacity-90">{clinic.address}</p>
                  </div>
                </div>
                <Badge className="absolute top-4 right-4 bg-zinc-700 dark:bg-white font-semibold px-3 py-1 rounded-full shadow-md">
                  {clinic?.specialization?.name || 'No Specialization'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-xl font-bold">LLMs - You Can&apos;t Please Them All</h1>
                  <p className="text-sm text-gray-500">Are LLM-judges robust to adversarial inputs?</p>
                </div>
              </div>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: expandedClinic === clinic.id ? 'auto' : 0,
                  opacity: expandedClinic === clinic.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-gray-300 leading-relaxed">{clinic.description}</p>
                <div className="space-y-2">
                  <h3 className="text-white font-medium mb-4">Doctors</h3>
                  {clinic?.doctors?.map((doctor, i) => (
                    <div key={doctor.id} className="flex items-center gap-4 p-2 rounded hover:bg-white/5">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-sm text-white">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{doctor.user.first_name}</div>
                        <div className="text-zinc-400 text-sm">{doctor.user.email}</div>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={doctor.user.profile?.avatar || ''} alt={doctor.user.first_name || 'User'} />
                        <AvatarFallback>{doctor?.user?.first_name?.charAt(0) || 'S'}</AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
              </motion.div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span>
                    Start with us from:{' '}
                    {new Date(clinic?.created_at || "").toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpandedClinic(clinic.id || "")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {expandedClinic === clinic.id ? 'Show less' : 'Show more'}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                      expandedClinic === clinic.id ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-700 p-0">
              <div className="grid w-full grid-cols-3">
                  <Link href={`/X/clinic/${clinic.id}`} className="flex items-center justify-center gap-2 rounded-none py-4 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                     <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">Explore</span>
                  </Link>
                  <Button
                    variant={'ghost'}
                    onClick={() => onOpen("CreateReservation", { ClinicId:clinic.id })}
                    className="flex items-center justify-center gap-2 rounded-none py-7 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                     <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">reservation</span>
                  </Button>
                  <Button
                    variant={'ghost'}
                    className="flex items-center justify-center gap-2 rounded-none py-7 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                     <Database className="h-4 w-4" />
                    <span className="text-sm font-medium">favourites</span>
                  </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
