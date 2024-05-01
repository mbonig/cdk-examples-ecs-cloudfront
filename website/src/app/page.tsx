import Link from "next/link";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full justify-around text-4xl p-8 text-center">
      <Link href={"WhatRegionIsThis"}>Debug</Link>
      <a href="https://matthewbonig.sidkik.app" className={"underline"}>My Advanced CDK Course</a>
    </main>
  )
}


