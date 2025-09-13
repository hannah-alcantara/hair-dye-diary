"use client";

import { useState, useEffect } from 'react';
import { Plus, X, Camera, Trash2 } from 'lucide-react';

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

interface EntryFormProps {
  title: string;
  entry?: HairDyeEntry;
  onSubmit: (entry: HairDyeEntry) => void;
  onCancel?: () => void;
  submitLabel?: string;
  showCancel?: boolean;
  isModal?: boolean;
}

const EntryForm: React.FC<EntryFormProps> = ({ 
  title,
  entry,
  onSubmit, 
  onCancel, 
  submitLabel = "Save Entry",
  showCancel = false,
  isModal = false
}) => {
  const [formData, setFormData] = useState({
    date: entry?.date || new Date().toISOString().split('T')[0],
    name: entry?.name || '',
    formulas: entry?.formulas.map(f => ({
      shade: f.shade,
      parts: f.parts.toString(),
      color: f.color.toString()
    })) || [{ shade: '', parts: '', color: '' }],
    developer: entry?.developer?.toString() || '',
    processingTime: entry?.processingTime?.toString() || '',
    notes: entry?.notes || '',
    photo: entry?.photo || null,
    beforePhoto: entry?.beforePhoto || null,
    afterPhoto: entry?.afterPhoto || null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submittedEntry: HairDyeEntry = {
      id: entry?.id || Date.now().toString(),
      date: formData.date,
      name: formData.name,
      formulas: formData.formulas.map(formula => ({
        shade: formula.shade,
        parts: parseInt(formula.parts) || 0,
        color: parseFloat(formula.color) || 0
      })),
      developer: formData.developer ? parseFloat(formData.developer) : null,
      processingTime: parseInt(formData.processingTime) || 0,
      notes: formData.notes,
      photo: formData.photo || undefined,
      beforePhoto: formData.beforePhoto || undefined,
      afterPhoto: formData.afterPhoto || undefined
    };

    onSubmit(submittedEntry);
    
    if (!entry) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        name: '',
        formulas: [{ shade: '', parts: '', color: '' }],
        developer: '',
        processingTime: '',
        notes: '',
        photo: null,
        beforePhoto: null,
        afterPhoto: null
      });

      const fileInput = document.getElementById('photo') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('formula.')) {
      const [, index, field] = name.split('.');
      const formulaIndex = parseInt(index);
      setFormData(prev => {
        const updatedFormulas = [...prev.formulas];
        updatedFormulas[formulaIndex] = { ...updatedFormulas[formulaIndex], [field]: value };
        return { ...prev, formulas: updatedFormulas };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addFormula = () => {
    setFormData(prev => ({
      ...prev,
      formulas: [...prev.formulas, { shade: '', parts: '', color: '' }]
    }));
  };

  const removeFormula = (index: number) => {
    if (formData.formulas.length > 1) {
      setFormData(prev => ({
        ...prev,
        formulas: prev.formulas.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, photo: file }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [type === 'before' ? 'beforePhoto' : 'afterPhoto']: file }));
    // Reset input
    e.target.value = "";
  };

  const removePhoto = (type: 'before' | 'after') => {
    setFormData(prev => ({ ...prev, [type === 'before' ? 'beforePhoto' : 'afterPhoto']: null }));
  };

  // Helper component to display photo with proper URL management
  const PhotoDisplay: React.FC<{ photo: File; alt: string; onRemove: () => void; onReplace: () => void }> = ({ 
    photo, 
    alt, 
    onRemove, 
    onReplace 
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
          <div className='text-center'>
            <Camera size={24} className='text-gray-500 mb-1' />
            <p className='text-xs text-gray-600'>Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div className='relative w-full h-full group'>
        <img 
          src={imageUrl} 
          alt={alt}
          className='w-full h-full object-cover rounded-lg'
        />
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100'>
          <div className='flex space-x-2'>
            <button
              type="button"
              onClick={onReplace}
              className='px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors flex items-center gap-1'
            >
              <Camera size={12} />
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className='px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors flex items-center gap-1'
            >
              <Trash2 size={12} />
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter entry name"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Formulas
          </label>
          <button
            type="button"
            onClick={addFormula}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <Plus size={14} className="mr-1" />
            Add Formula
          </button>
        </div>
        <div className="space-y-4">
          {formData.formulas.map((formula, index) => (
            <div key={index} className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formula {index + 1}
                </h4>
                {formData.formulas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFormula(index)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor={`shade-${index}`} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Shade
                  </label>
                  <input
                    type="text"
                    id={`shade-${index}`}
                    name={`formula.${index}.shade`}
                    value={formula.shade}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 7.1 Ash Blonde"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor={`parts-${index}`} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Parts
                  </label>
                  <input
                    type="number"
                    id={`parts-${index}`}
                    name={`formula.${index}.parts`}
                    value={formula.parts}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor={`color-${index}`} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Color (g)
                  </label>
                  <input
                    type="number"
                    id={`color-${index}`}
                    name={`formula.${index}.color`}
                    value={formula.color}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    placeholder="30"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="developer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Developer (g) <span className="text-gray-500 dark:text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          type="number"
          id="developer"
          name="developer"
          value={formData.developer}
          onChange={handleChange}
          min="0"
          step="0.1"
          placeholder="60"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="processingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Processing Time (minutes)
        </label>
        <input
          type="number"
          id="processingTime"
          name="processingTime"
          value={formData.processingTime}
          onChange={handleChange}
          required
          min="0"
          placeholder="30"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Any additional notes about the process..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
        />
      </div>

      {/* Photos Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Photos
        </label>
        
        {/* Before/After Photo Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Before Photo */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Before Photo</h4>
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative">
              {formData.beforePhoto ? (
                <PhotoDisplay 
                  photo={formData.beforePhoto} 
                  alt="Before photo"
                  onRemove={() => removePhoto('before')}
                  onReplace={() => {
                    const input = document.getElementById('before-photo-input') as HTMLInputElement;
                    input?.click();
                  }}
                />
              ) : (
                <label className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <input
                    id="before-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'before')}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Camera size={24} className="text-gray-400 mb-2 mx-auto" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Before photo</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* After Photo */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">After Photo</h4>
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative">
              {formData.afterPhoto ? (
                <PhotoDisplay 
                  photo={formData.afterPhoto} 
                  alt="After photo"
                  onRemove={() => removePhoto('after')}
                  onReplace={() => {
                    const input = document.getElementById('after-photo-input') as HTMLInputElement;
                    input?.click();
                  }}
                />
              ) : (
                <label className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <input
                    id="after-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'after')}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Camera size={24} className="text-gray-400 mb-2 mx-auto" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">After photo</p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Legacy Photo Upload (for backward compatibility) */}
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Additional Photo (Legacy)
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800"
          />
          {formData.photo && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
              <Camera size={12} />
              Current file: {formData.photo.name}
            </p>
          )}
        </div>
      </div>

      <div className={`flex ${showCancel ? 'justify-end space-x-3' : ''}`}>
        {showCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`${showCancel ? 'px-6 py-2' : 'w-full py-2.5 px-4'} bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
          <div className='sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 rounded-t-lg'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{title}</h2>
              <button
                onClick={onCancel}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center justify-center'
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className='p-6'>
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
        {title}
      </h1>
      {formContent}
    </div>
  );
};

export default EntryForm;