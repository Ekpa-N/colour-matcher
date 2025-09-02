"use client"
import Image from "next/image";
import ColourMatcher from "@/components/ColourMatcher";
import AppContext from "@/components/Provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()


  return (
    <AppContext.Consumer>
      {({ defaultPatternError, defaultPattern, defaultPatterns, playerPatterns, makeSwitch, makeSwitchToo, playerOneSwitch, playerTwoSwitch, resetDefault, playerOnePattern, playerTwoPattern, playerOnePatternError, playerTwoPatternError }) => {

        return (
          <main className="flex min-h-screen flex-col gap-[20px] items-center justify-center p-2">
            <button onClick={() => { router.push("/registration") }} className="border p-2 rounded">Registration</button>
          </main>
        )
      }}
    </AppContext.Consumer>
  )
}
