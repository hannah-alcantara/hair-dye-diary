"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import EntryForm from "./components/entry-form";

interface Formula {
  shade: string;
  parts: number;
  color: number;
}

interface HairDyeEntry {
  id: string;
  date: string;
  name: string;
  formulas: Formula[];
  developer: number | null;
  processingTime: number;
  notes: string;
  photo?: File;
  beforePhoto?: File;
  afterPhoto?: File;
}

export default function Home() {
  const router = useRouter();

  const handleSubmit = (entry: HairDyeEntry) => {
    const existingEntries = JSON.parse(
      localStorage.getItem("hairDiary") || "[]"
    );
    const updatedEntries = [...existingEntries, entry];
    localStorage.setItem("hairDiary", JSON.stringify(updatedEntries));

    // Redirect to logbook
    router.push("/logbook");
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <div></div>
          <Link
            href='/logbook'
            className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium flex items-center'
          >
            View Logbook
          </Link>
        </div>

        <EntryForm title='Add Hair Dye Entry' onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
