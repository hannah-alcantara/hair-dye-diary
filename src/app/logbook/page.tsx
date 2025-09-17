"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import EntryForm from "../components/entry-form";

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

export default function Logbook() {
  const router = useRouter();

  const handleSubmit = (entry: HairDyeEntry) => {
    const existingEntries = JSON.parse(
      localStorage.getItem("hairDiary") || "[]"
    );
    // Add new entry at the end for chronological order (oldest to newest)
    const updatedEntries = [...existingEntries, entry];
    localStorage.setItem("hairDiary", JSON.stringify(updatedEntries));

    // Redirect to home (will automatically show last page with new entry)
    router.push("/");
  };

  return (
    <div className='min-h-screen bg-gray-50 py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-sm sm:max-w-md lg:max-w-2xl mx-auto'>
        <EntryForm title='Hair Dye Entry' onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
