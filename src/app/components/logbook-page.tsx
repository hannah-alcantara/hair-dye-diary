import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TestTube,
  StickyNote,
  Camera,
  Edit,
  X,
  Sparkles,
  Upload,
} from "lucide-react";

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

interface LogbookPageProps {
  side: "left" | "right";
  entry?: HairDyeEntry;
  isEmpty: boolean;
  isEmptyState: boolean;
  onDeleteEntry: (id: string) => void;
  onEditEntry: (id: string) => void;
  onUploadPhoto?: (id: string, file: File, type: "before" | "after") => void;
  formatDate: (date: string) => string;
  formatFormulas: (formulas: Formula[]) => string;
}

// Helper component to display photo with proper URL management
const PhotoDisplay: React.FC<{ photo: File; alt: string }> = ({
  photo,
  alt,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (photo && photo instanceof File) {
      const url = URL.createObjectURL(photo);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [photo]);

  if (!imageUrl) {
    return (
      <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <Camera size={24} className='text-gray-500 mb-1' />
          <p className='text-xs text-gray-600 pl-2'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className='w-full h-full object-cover rounded-lg'
    />
  );
};

const LogbookPage: React.FC<LogbookPageProps> = ({
  side,
  entry,
  isEmpty,
  isEmptyState,
  onDeleteEntry,
  onEditEntry,
  onUploadPhoto,
  formatDate,
  formatFormulas,
}) => {
  const borderClass = side === "left" ? "border-l-10" : "border-r-10";
  const marginLineClass = side === "left" ? "left-8" : "right-8";
  const paddingClass = side === "left" ? "pl-12 pr-4" : "pl-4 pr-12";

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    if (file && entry && onUploadPhoto) {
      onUploadPhoto(entry.id, file, type);
    }
    // Reset input
    e.target.value = "";
  };

  const renderEmptyState = () => {
    if (side === "right" && isEmptyState) {
      return (
        <div className='text-center py-16'>
          <div className='mb-4 flex justify-center'>
            <Sparkles size={64} className='text-amber-400' />
          </div>
          <h3 className='text-xl font-serif text-gray-600 mb-2'>
            Your hair journey starts here
          </h3>
          <p className='text-gray-500 mb-6'>
            No entries yet. Add your first hair dye experience!
          </p>
          <Link
            href='/'
            className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md text-sm'
          >
            Create First Entry
          </Link>
        </div>
      );
    }
  };

  const renderEntry = () => {
    if (!entry) return null;

    return (
      <div className='h-full'>
        <div className='mb-4'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h2 className='text-lg font-serif font-bold text-gray-800 mb-1'>
                {entry.name}
              </h2>
              <p className='text-gray-600 text-xs font-medium'>
                {formatDate(entry.date)}
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => onEditEntry(entry.id)}
                className='w-6 h-6 bg-gray-50 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors duration-200 flex items-center justify-center'
                title='Edit entry'
              >
                <Edit size={12} />
              </button>
              <button
                onClick={() => onDeleteEntry(entry.id)}
                className='w-6 h-6 bg-gray-50 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors duration-200 flex items-center justify-center'
                title='Delete entry'
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Formula */}
          <div className='mb-4'>
            <h3 className='font-semibold text-gray-700 mb-2 text-sm flex items-center gap-2'>
              <TestTube size={16} />
              Formula
            </h3>
            <div className='bg-gray-50 rounded-md p-3'>
              {/* Column Headers */}
              <div className='grid grid-cols-3 gap-2 mb-2 text-xs font-semibold text-gray-600 border-b border-gray-300 pb-1'>
                <div>Shade</div>
                <div>Parts</div>
                <div>Color (g)</div>
              </div>

              {/* Formula Data */}
              {entry.formulas.map((formula, index) => (
                <div
                  key={index}
                  className='grid grid-cols-3 gap-2 text-xs text-gray-800 mb-1'
                >
                  <div className='font-medium'>{formula.shade}</div>
                  <div>{formula.parts}</div>
                  <div>{formula.color}g</div>
                </div>
              ))}

              {entry.developer && (
                <div className='text-gray-600 text-xs mt-2 pt-2 border-t border-gray-300'>
                  + {entry.developer}g developer
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {entry.notes && (
            <div className='mb-4'>
              <h3 className='font-semibold text-gray-700 mb-2 text-sm flex items-center gap-2'>
                <StickyNote size={16} />
                Notes
              </h3>
              <div className='bg-gray-50 rounded-md p-3'>
                <p className='text-gray-700 text-xs leading-relaxed whitespace-pre-wrap'>
                  {entry.notes}
                </p>
              </div>
            </div>
          )}

          {/* Photos */}
          <div>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='font-semibold text-gray-700 text-sm flex items-center gap-2'>
                <Camera size={16} />
                Photos
              </h3>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              {/* Before Photo*/}
              <div className='aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative'>
                {entry.beforePhoto ? (
                  <PhotoDisplay photo={entry.beforePhoto} alt='Before photo' />
                ) : (
                  <label className='cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-200 transition-colors'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => handlePhotoUpload(e, "before")}
                      className='hidden'
                    />
                    <div className='flex flex-col items-center justify-center'>
                      <Upload size={20} className='text-gray-400 mb-1' />
                      <p className='text-xs text-gray-500'>Before</p>
                    </div>
                  </label>
                )}
              </div>

              {/* After Photo*/}
              <div className='aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative'>
                {entry.afterPhoto ? (
                  <PhotoDisplay photo={entry.afterPhoto} alt='After photo' />
                ) : (
                  <label className='cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-200 transition-colors'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => handlePhotoUpload(e, "after")}
                      className='hidden'
                    />
                    <div className='flex flex-col items-center justify-center'>
                      <Upload size={20} className='text-gray-400 mb-1' />
                      <p className='text-xs text-gray-500'>After</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* File name indicators */}
            {/* <div className='mt-2 space-y-1'>
              {entry.beforePhoto && (
                <p className='text-xs text-gray-500 bg-green-100 px-2 py-1 rounded flex items-center gap-1'>
                  <Paperclip size={12} />
                  Before: {entry.beforePhoto.name}
                </p>
              )}
              {entry.afterPhoto && (
                <p className='text-xs text-gray-500 bg-green-100 px-2 py-1 rounded flex items-center gap-1'>
                  <Paperclip size={12} />
                  After: {entry.afterPhoto.name}
                </p>
              )}
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        side === "right" ? "w-full h-full" : "flex-1"
      } ${borderClass} border-indigo-800 rounded-md relative`}
    >
      {/* Page margin line */}
      <div
        className={`absolute top-0 ${marginLineClass} w-px h-full bg-red-400`}
      ></div>

      {/* Page ruled lines */}
      <div
        className={`absolute inset-0 ${marginLineClass}`}
        style={{
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 31px,
            rgba(59, 130, 246, 0.08) 32px,
            rgba(59, 130, 246, 0.08) 33px,
            transparent 34px
          )`,
        }}
      ></div>

      {/* Page Content */}
      <div className={`${paddingClass} py-8 h-full relative z-10`}>
        {isEmptyState || isEmpty ? renderEmptyState() : renderEntry()}
      </div>
    </div>
  );
};

export default LogbookPage;
