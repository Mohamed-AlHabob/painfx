"use client";
import { NoResult } from "../components/global/no-results";

export default function Errorpage(){
  return ( 
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NoResult message="Something went wrong!" backTo={"/"} linkName={"back"}/>
    </div>
  );
}
 