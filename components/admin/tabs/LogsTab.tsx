'use client';

import React, { useState } from 'react';
import { LogEntry } from '@/lib/logger';
import { Activity, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface LogsTabProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export default function LogsTab({ logs, onClearLogs }: LogsTabProps) {
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'>('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (logFilter !== 'ALL' && log.level !== logFilter) return false;
    if (logSearch) {
      const q = logSearch.toLowerCase();
      return (
        log.action?.toLowerCase().includes(q) ||
        log.message?.toLowerCase().includes(q) ||
        JSON.stringify(log.details || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-700">Рівень:</span>
          {(['ALL', 'SUCCESS', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLogFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                logFilter === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Пошук по логах..."
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 flex-1 sm:w-64"
          />
          <button
            onClick={onClearLogs}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
            title="Очистити журнал"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-2">
          <Activity className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-800">Логів не знайдено</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLogs.map((log, idx) => {
            const isExpanded = expandedLogId === (log.id || String(idx));
            const badgeColor =
              log.level === 'SUCCESS'
                ? 'bg-emerald-100 text-emerald-800'
                : log.level === 'ERROR'
                ? 'bg-red-100 text-red-800'
                : log.level === 'WARN'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-blue-100 text-blue-800';

            return (
              <div
                key={log.id || idx}
                className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-2xs hover:shadow-xs transition text-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase ${badgeColor}`}>
                      {log.level}
                    </span>
                    <span className="font-mono font-bold text-gray-800">{log.action}</span>
                    <span className="text-gray-600">{log.message}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('uk-UA')}
                    </span>
                    {log.details && (
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id || String(idx))}
                        className="text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && log.details && (
                  <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-[10px] overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
