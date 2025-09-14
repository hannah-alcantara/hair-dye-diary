"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageFlip from "./components/page-flip";
import LogbookPage from "./components/logbook-page";
import EntryForm from "./components/entry-form";
import { Plus } from "lucide-react";

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
}

export default function Home() {
  const [entries, setEntries] = useState<HairDyeEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">(
    "forward"
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<HairDyeEntry | null>(null);
  const entriesPerPage = 2;

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("hairDiary") || "[]");
    setEntries(savedEntries.reverse()); // Show newest first
  }, []);

  const totalPages = Math.max(1, Math.ceil(entries.length / entriesPerPage));
  const startIndex = currentPage * entriesPerPage;
  const currentEntries = entries.slice(startIndex, startIndex + entriesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setFlipDirection("forward");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setTimeout(() => setIsFlipping(false), 800);
      }, 400);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setFlipDirection("backward");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setTimeout(() => setIsFlipping(false), 800);
      }, 400);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFormulas = (formulas: Formula[]) => {
    return formulas
      .map(
        (formula) =>
          `${formula.shade} (${formula.parts}:${formula.color}g)`
      )
      .join(" + ");
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntryToDelete(entryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      const updatedEntries = entries.filter(
        (entry) => entry.id !== entryToDelete
      );
      setEntries(updatedEntries);
      localStorage.setItem(
        "hairDiary",
        JSON.stringify(updatedEntries.reverse())
      ); // Reverse back to original order for storage

      // Adjust current page if necessary
      const newTotalPages = Math.max(
        1,
        Math.ceil(updatedEntries.length / entriesPerPage)
      );
      if (currentPage >= newTotalPages && newTotalPages > 1) {
        setCurrentPage(newTotalPages - 1);
      } else if (updatedEntries.length === 0) {
        setCurrentPage(0);
      }
    }
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  const handleEditEntry = (entryId: string) => {
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      setEntryToEdit(entry);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = (updatedEntry: HairDyeEntry) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    setEntries(updatedEntries);
    // For editing, maintain the current display order and store in reverse (oldest first)
    const storageEntries = [...updatedEntries].reverse();
    localStorage.setItem("hairDiary", JSON.stringify(storageEntries));
    setShowEditModal(false);
    setEntryToEdit(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEntryToEdit(null);
  };

  const handleUploadPhoto = (
    entryId: string,
    file: File,
    type: "before" | "after"
  ) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === entryId
        ? { ...entry, [type === "before" ? "beforePhoto" : "afterPhoto"]: file }
        : entry
    );
    setEntries(updatedEntries);
    // For photo uploads, maintain the current display order and store in reverse (oldest first)
    const storageEntries = [...updatedEntries].reverse();
    localStorage.setItem("hairDiary", JSON.stringify(storageEntries));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20 px-4 relative'>
      <div className='max-w-4xl mx-auto relative z-10'>
        {/* Open Notebook Pages - Left and Right */}
        <PageFlip
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={prevPage}
          onNextPage={nextPage}
        >
          <div className='relative perspective'>
            {/* Drop shadow for depth */}
            <div className='absolute inset-0 bg-black/20 shadow-2xl blur-sm translate-x-1 translate-y-1 rounded-t-lg'></div>

            <div className='flex bg-[#f5f5f5] shadow-2xl relative min-h-[700px] pages-container'>
              {/* Left Page - Always visible */}
              <LogbookPage
                side='left'
                entry={currentEntries[0]}
                isEmpty={!currentEntries[0]}
                isEmptyState={
                  currentEntries.length === 0 && entries.length === 0
                }
                onDeleteEntry={handleDeleteEntry}
                onEditEntry={handleEditEntry}
                onUploadPhoto={handleUploadPhoto}
                formatDate={formatDate}
                formatFormulas={formatFormulas}
              />

              {/* Center Binding */}
              <div className='w-3 shadow-inner relative'>
                <div className='absolute inset-y-0 left-1/2 w-px bg-blue-950'></div>
              </div>

              {/* Right Page with 3D flip wrapper */}
              <div className='flex-1 relative page-wrapper'>
                {/* Current right page */}
                <div
                  className={`page-front ${
                    isFlipping ? `flipping-page flip-${flipDirection}` : ""
                  }`}
                >
                  <LogbookPage
                    side='right'
                    entry={currentEntries[1]}
                    isEmpty={!currentEntries[1]}
                    isEmptyState={
                      currentEntries.length === 0 && entries.length === 0
                    }
                    onDeleteEntry={handleDeleteEntry}
                    onEditEntry={handleEditEntry}
                    onUploadPhoto={handleUploadPhoto}
                    formatDate={formatDate}
                    formatFormulas={formatFormulas}
                  />
                </div>

                {/* Next/Previous page (back of the flip) */}
                {isFlipping && (
                  <div className='page-back'>
                    <LogbookPage
                      side='right'
                      entry={
                        flipDirection === "forward"
                          ? entries.slice(
                              (currentPage + 1) * entriesPerPage,
                              (currentPage + 1) * entriesPerPage +
                                entriesPerPage
                            )[1]
                          : entries.slice(
                              (currentPage - 1) * entriesPerPage,
                              (currentPage - 1) * entriesPerPage +
                                entriesPerPage
                            )[1]
                      }
                      isEmpty={
                        flipDirection === "forward"
                          ? !entries.slice(
                              (currentPage + 1) * entriesPerPage,
                              (currentPage + 1) * entriesPerPage +
                                entriesPerPage
                            )[1]
                          : !entries.slice(
                              (currentPage - 1) * entriesPerPage,
                              (currentPage - 1) * entriesPerPage +
                                entriesPerPage
                            )[1]
                      }
                      isEmptyState={false}
                      onDeleteEntry={handleDeleteEntry}
                      onEditEntry={handleEditEntry}
                      onUploadPhoto={handleUploadPhoto}
                      formatDate={formatDate}
                      formatFormulas={formatFormulas}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageFlip>
      </div>

      {/* Floating New Entry Button */}
      <Link
        href='/logbook'
        className='fixed bottom-6 right-6 bg-indigo-800 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl font-bold z-50 transform hover:scale-110'
        title='Add New Entry'
      >
        <Plus />
      </Link>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-[100] p-4'>
          <div className='bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all'>
            <div className='p-6'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4'>
                  <svg
                    className='w-6 h-6 text-red-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Delete Hair Dye Entry
                  </h3>
                  <p className='text-sm text-gray-600'>
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className='text-gray-700 mb-6'>
                Are you sure you want to delete this hair dye entry? All
                information including formulas, notes, and photos will be
                permanently removed.
              </p>

              <div className='flex space-x-3 justify-end'>
                <button
                  onClick={cancelDelete}
                  className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 font-medium'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 font-medium'
                >
                  Delete Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && entryToEdit && (
        <EntryForm
          title='Edit Hair Dye Entry'
          entry={entryToEdit}
          onSubmit={handleSaveEdit}
          onCancel={handleCancelEdit}
          submitLabel='Save Changes'
          showCancel={true}
          isModal={true}
        />
      )}
    </div>
  );
}
