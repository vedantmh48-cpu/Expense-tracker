import React, { useRef } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { exportToCSV } from '../utils/formatters';
import { Download, Upload, Trash2, X, FileText, Database } from 'lucide-react';

export const ExportImportModal = () => {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    transactions,
    importTransactions,
    resetAllData,
  } = useExpense();

  const fileInputRef = useRef(null);

  if (!isExportModalOpen) return null;

  // Handle JSON Backup Download
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RupeeFlow_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle JSON Import File
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            importTransactions(parsed);
            alert(`Successfully imported ${parsed.length} transaction records!`);
            setIsExportModalOpen(false);
          } else {
            alert('Invalid JSON structure. Expected an array of transaction records.');
          }
        } catch (error) {
          alert('Error parsing JSON file. Please make sure it is valid JSON.');
        }
      };
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card p-6 border-[#E2E8F0] shadow-2xl relative max-w-lg">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0]/40">
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
              <Database className="w-5 h-5" />
            </span>
            Data Backup, Export & Import
          </h3>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F8FAFC] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Export Options */}
          <div className="p-4 rounded-xl bg-[#F8FAFC]/60 border border-[#E2E8F0]/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">Export Data</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => exportToCSV(transactions)}
                className="btn-secondary justify-center text-xs py-2.5 hover:border-[#4F46E5]/40 hover:text-[#4F46E5]"
              >
                <FileText className="w-4 h-4 text-[#4F46E5]" />
                <span>Export to CSV</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="btn-secondary justify-center text-xs py-2.5 hover:border-[#4F46E5]/40 hover:text-[#4F46E5]"
              >
                <Download className="w-4 h-4 text-[#4F46E5]" />
                <span>Download JSON Backup</span>
              </button>
            </div>
          </div>

          {/* Import JSON File */}
          <div className="p-4 rounded-xl bg-[#F8FAFC]/60 border border-[#E2E8F0]/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">Import / Restore JSON</h4>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImportJSON}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="w-full btn-secondary justify-center text-xs py-2.5 hover:border-[#4F46E5]/40 hover:text-[#4F46E5]"
            >
              <Upload className="w-4 h-4 text-[#4F46E5]" />
              <span>Select JSON File to Restore</span>
            </button>
          </div>

          {/* Clear / Reset Data */}
          <div className="pt-2 border-t border-[#E2E8F0]/40">
            <button
              onClick={() => {
                if (window.confirm('⚠️ WARNING: Are you sure you want to erase ALL transaction records? This action cannot be undone.')) {
                  resetAllData();
                  setIsExportModalOpen(false);
                }
              }}
              className="w-full text-xs text-rose-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset & Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};