'use client';

import React from 'react';
import { GalleryItem } from '@/lib/siteSettings';
import { Plus, Save, Trash2, Upload } from 'lucide-react';

interface GalleryTabProps {
  galleryForm: GalleryItem[];
  setGalleryForm: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  onSaveGallery: (e: React.FormEvent) => Promise<void>;
}

export default function GalleryTab({
  galleryForm,
  setGalleryForm,
  onSaveGallery,
}: GalleryTabProps) {
  return (
    <form onSubmit={onSaveGallery} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            📸 Управління фотогалереєю реалізованих проєктів
          </h2>
          <p className="text-xs text-gray-500">
            Змінюйте фотографії, заголовки, міста та категорії робіт майстра на головній сторінці сайту
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const newItem: GalleryItem = {
                id: Date.now(),
                title: 'Нова виконана робота (монтаж ролет / штори)',
                city: 'м. Дніпро',
                image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
                category: 'День-Ніч',
              };
              setGalleryForm([...galleryForm, newItem]);
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Додати роботу</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Зберегти галерею</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {galleryForm.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4 relative group"
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                Картка #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Видалити цю роботу з галереї?')) {
                    setGalleryForm(galleryForm.filter((_, i) => i !== idx));
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                title="Видалити роботу"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Image Preview & File Upload */}
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50 shadow-xs">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div>
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>📁 Завантажити фото з ПК</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              const updated = [...galleryForm];
                              updated[idx].image = ev.target.result as string;
                              setGalleryForm(updated);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-0.5">
                    Або URL посилання:
                  </label>
                  <input
                    type="text"
                    value={item.image}
                    onChange={(e) => {
                      const updated = [...galleryForm];
                      updated[idx].image = e.target.value;
                      setGalleryForm(updated);
                    }}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Заголовок / Назва роботи *</label>
                <input
                  type="text"
                  required
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...galleryForm];
                    updated[idx].title = e.target.value;
                    setGalleryForm(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Локація / Місто *</label>
                <input
                  type="text"
                  required
                  value={item.city}
                  onChange={(e) => {
                    const updated = [...galleryForm];
                    updated[idx].city = e.target.value;
                    setGalleryForm(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Категорія (Тег) *</label>
                <input
                  type="text"
                  required
                  value={item.category}
                  onChange={(e) => {
                    const updated = [...galleryForm];
                    updated[idx].category = e.target.value;
                    setGalleryForm(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Зберегти зміни в галереї</span>
        </button>
      </div>
    </form>
  );
}
