"use client";

import { useState, useEffect } from 'react';
import { Plus, X, Camera, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';

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
  const router = useRouter();
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
            <Button
              type="button"
              onClick={onReplace}
              size="sm"
              className='text-xs bg-blue-600 hover:bg-blue-700 text-white'
            >
              <Camera size={12} />
              Replace
            </Button>
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="sm"
              className='text-xs bg-red-600 hover:bg-red-700 text-white'
            >
              <Trash2 size={12} />
              Remove
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <DatePicker
          value={formData.date ? new Date(formData.date) : undefined}
          onChange={(date) => {
            setFormData(prev => ({
              ...prev,
              date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            }));
          }}
          placeholder="Pick a date"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter entry name"
          className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Formulas
          </label>
          <Button
            type="button"
            onClick={addFormula}
            variant="outline"
            size="sm"
            className="bg-gray-50 border-gray-300 text-indigo-800 hover:bg-indigo-200 transition-colors"
          >
            <Plus size={12} className="mr-1" />
            Add Formula
          </Button>
        </div>
        <div className="space-y-4">
          {formData.formulas.map((formula, index) => (
            <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">
                  Formula {index + 1}
                </h4>
                {formData.formulas.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeFormula(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor={`shade-${index}`} className="block text-sm font-medium text-gray-600 mb-1">
                    Shade
                  </label>
                  <Input
                    type="text"
                    id={`shade-${index}`}
                    name={`formula.${index}.shade`}
                    value={formula.shade}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 7.1 Ash Blonde"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor={`parts-${index}`} className="block text-sm font-medium text-gray-600 mb-1">
                    Parts
                  </label>
                  <Input
                    type="number"
                    id={`parts-${index}`}
                    name={`formula.${index}.parts`}
                    value={formula.parts}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="1"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor={`color-${index}`} className="block text-sm font-medium text-gray-600 mb-1">
                    Color (g)
                  </label>
                  <Input
                    type="number"
                    id={`color-${index}`}
                    name={`formula.${index}.color`}
                    value={formula.color}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    placeholder="30"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="developer" className="block text-sm font-medium text-gray-700 mb-2">
          Developer (g) <span className="text-gray-500">(optional)</span>
        </label>
        <Input
          type="number"
          id="developer"
          name="developer"
          value={formData.developer}
          onChange={handleChange}
          min="0"
          step="1"
          placeholder="60"
          className="bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="processingTime" className="block text-sm font-medium text-gray-700 mb-2">
          Processing Time (minutes)
        </label>
        <Input
          type="number"
          id="processingTime"
          name="processingTime"
          value={formData.processingTime}
          onChange={handleChange}
          required
          min="0"
          placeholder="30"
          className="bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Any additional notes about the process..."
          className="bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Photos Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Photos
        </label>

        {/* Before/After Photo Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Before Photo */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Before Photo</h4>
            <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
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
                <label className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <input
                    id="before-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'before')}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Camera size={24} className="text-gray-400 mb-2 mx-auto" />
                    <p className="text-xs text-gray-500">Click to upload</p>
                    <p className="text-xs text-blue-600">Before photo</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* After Photo */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">After Photo</h4>
            <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
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
                <label className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <input
                    id="after-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'after')}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Camera size={24} className="text-gray-400 mb-2 mx-auto" />
                    <p className="text-xs text-gray-500">Click to upload</p>
                    <p className="text-xs text-blue-600">After photo</p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

      </div>

      <div className={`flex ${showCancel ? 'justify-end space-x-3' : ''}`}>
        {showCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-300"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className={`${showCancel ? 'px-6 py-2' : 'w-full py-2.5 px-4'} bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm`}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div className='fixed inset-0 bg-indigo-800 bg-opacity-50 flex items-center justify-center z-[100] p-4'>
        <div className='bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
          <div className='sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
              <Button
                onClick={onCancel}
                variant="ghost"
                size="icon"
                className='text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              >
                <X size={20} />
              </Button>
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
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-indigo-800">
          {title}
        </h1>
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          size="icon"
          className="bg-gray-50 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors p-2"
          aria-label="Close and return to home"
        >
          <X size={20} />
        </Button>
      </div>
      {formContent}
    </div>
  );
};

export default EntryForm;