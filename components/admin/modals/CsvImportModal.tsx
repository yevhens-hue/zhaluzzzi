'use client';

import React from 'react';

interface CsvImportModalProps {
  csvPreview: Record<string, string>[];
  onCancel: () => void;
  onImport: () => Promise<void>;
  isImporting: boolean;
}

export default function CsvImportModal({
  csvPreview,
  onCancel,
  onImport,
  isImporting,
}: CsvImportModalProps) {
  if (csvPreview.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-amber-900 text-sm">
          📋 Попередній перегляд CSV ({csvPreview.length} рядків)
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="text-xs text-amber-600 hover:text-amber-900 font-bold cursor-pointer"
          >
            Скасувати
          </button>
          <button
            onClick={onImport}
            disabled={isImporting}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-lg font-bold text-xs cursor-pointer"
          >
            {isImporting ? '⏳ Імпортуємо...' : `✅ Імпортувати ${csvPreview.length} товарів`}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-amber-200">
        <table className="text-[11px] w-full">
          <thead className="bg-amber-100">
            <tr>
              {Object.keys(csvPreview[0]).map((h) => (
                <th key={h} className="px-3 py-1.5 text-left font-bold text-amber-800">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvPreview.slice(0, 5).map((row, i) => (
              <tr key={i} className="border-t border-amber-100 bg-white">
                {Object.values(row).map((v, j) => (
                  <td key={j} className="px-3 py-1.5 text-gray-700 max-w-[120px] truncate">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
            {csvPreview.length > 5 && (
              <tr className="border-t border-amber-100 bg-amber-50">
                <td
                  colSpan={Object.keys(csvPreview[0]).length}
                  className="px-3 py-1.5 text-amber-600 font-bold text-center"
                >
                  + ще {csvPreview.length - 5} рядків...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
