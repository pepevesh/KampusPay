import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      <header className="container mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-centers">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0 mx-auto">
          <Image
            src="/favicon-96x96.png"
            alt="Logo"
            width={70}
            height={70}
            className="rounded-full"
          />
          <h1 className="md:text-5xl font-bold text-4xl">Kampus Pay</h1>
        </div>
      </header>

      <main className="container mx-auto md:px-4 md:py-16">
        <div className="text-center">
          <h2 className="md:text-5xl font-extrabold text-white mb-4 text-2xl">
            Welcome to KampusPay!
          </h2>
          <p className="text-md md:text-xl text-gray-300 mb-8">
          Digital Campus Payment and Budgeting Application
          </p>
          <div className="flex justify-center space-x-4">
            <Link href={"/register"}>
            <Button variant="outline" className="bg-gray-700 hover:bg-[#7F3DFF] border-gray-500 text-md md:text-2xl md:p-6">Sign Up</Button>
            </Link>
            <Link href={"/login"}>
            <Button variant="outline" className="bg-[#7F3DFF] hover:bg-[#7F3DFF]/75 border-gray-500 text-md  md:text-2xl md:p-6">Login</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

