import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-orange-50"></div>
      
      <div className="text-center px-4 max-w-3xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-orange-100 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
              <path d="M3 16.5l9-5.5 9 5.5"/>
              <path d="M3 12.5l9-5.5 9 5.5"/>
              <path d="M3 8.5l9-5.5 9 5.5"/>
            </svg>
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
          <span className="inline bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">FTC Scout</span>
        </h1>
        <p className="mb-8 text-lg text-gray-700">
          Your comprehensive scouting solution for the FIRST Tech Challenge. 
          Track robot capabilities, analyze performance, and optimize 
          your alliance selections.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link href="/scout" className="bg-orange-500 text-white p-3 rounded">
            Start Scouting
          </Link>
          
          <Link href="/analysis" className="bg-white border border-orange-200 text-orange-600 p-3 rounded">
            View Analysis
          </Link>
          
          <Link href="/teams-api" className="bg-blue-500 text-white p-3 rounded">
            API Demo
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-md">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h10"></path>
                <path d="M9 4v16"></path>
                <path d="M14 9l3 3-3 3"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Performance Analysis</h3>
            <p className="text-gray-600">Track robot performance in matches for deeper insights</p>
          </div>
          
          <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-md">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Robot Design</h3>
            <p className="text-gray-600">Compare robot designs and specialized mechanisms</p>
          </div>
          
          <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-md">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17.75l-6.172-6.172a4 4 0 114.242-6.5 4 4 0 016.1 5.903L12 15.75l-4.242-4.242"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Alliance Selection</h3>
            <p className="text-gray-600">Find your perfect alliance partners with data-driven insights</p>
          </div>
        </div>
      </div>
    </div>
  );
} 