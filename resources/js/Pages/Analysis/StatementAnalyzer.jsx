import React, { useState } from 'react';
import { 
  Upload, FileText, Loader2, Plus, Trash2, ZapOff, Eye, CheckCircle,
  Home, Car, PiggyBank, Gem, Lock, ArrowLeft
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";

const StatementAnalyzer = () => {
  const { isProUser } = useAuth();
  
  const [fileEntries, setFileEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTypeSelection, setCurrentTypeSelection] = useState('PERSONAL');
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [showComplianceResult, setShowComplianceResult] = useState(false);

  const loanOptions = [
    { type: 'HOME', label: 'Home Loan', icon: <Home size={16} /> },
    { type: 'TOPUP', label: 'Top-up', icon: <Plus size={16} /> },
    { type: 'CAR', label: 'Car Loan', icon: <Car size={16} /> },
    { type: 'PERSONAL', label: 'Personal Loan', icon: <PiggyBank size={16} /> },
    { type: 'GOLD', label: 'Gold Loan', icon: <Gem size={16} /> },
  ];

  // Check if user can upload more files (max 3 for free, unlimited for pro)
  const canUploadMore = isProUser ? true : fileEntries.length < 3;

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Strict check for Free users to not exceed 3 files total
    if (!isProUser && (fileEntries.length + files.length) > 3) {
      alert("Free plan allows up to 3 files. Please upgrade to Pro for unlimited uploads.");
      e.target.value = '';
      return;
    }

    const newEntries = Array.from(files).map((file) => {
      const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: fileId,
        name: file.name,
        type: currentTypeSelection,
        size: sizeInMB,
        category: currentTypeSelection,
        fileObject: file,
        uploadDate: new Date().toLocaleDateString('en-GB')
      };
    });

    setFileEntries(prev => [...prev, ...newEntries]);
    
    // Select the first uploaded file if none is selected
    if (!selectedFileId && newEntries.length > 0) {
      setSelectedFileId(newEntries[0].id);
    }
    
    e.target.value = '';
  };

  const selectedFile = fileEntries.find(file => file.id === selectedFileId);

  const handleFileClick = (fileId) => {
    setSelectedFileId(fileId);
  };

  const removeFile = (fileId, e) => {
    e.stopPropagation();
    setFileEntries(prev => prev.filter(file => file.id !== fileId));
    if (selectedFileId === fileId) {
      const remainingFiles = fileEntries.filter(file => file.id !== fileId);
      setSelectedFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
    }
  };

  // Handle compliance audit (Locked for PRO only)
  const handleComplianceAudit = async () => {
    if (!isProUser) {
      alert("Audit feature requires a Pro subscription. Please upgrade to continue.");
      window.dispatchEvent(new CustomEvent("openProModal"));
      return;
    }
    
    if (fileEntries.length === 0) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowComplianceResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = fileEntries.filter(file => file.type === currentTypeSelection);
  const totalFiles = fileEntries.length;
  const hasFiles = totalFiles > 0;

  const getCategoryColor = (category) => {
    const colors = {
      HOME: 'text-blue-600 bg-blue-50',
      PERSONAL: 'text-purple-600 bg-purple-50',
      CAR: 'text-green-600 bg-green-50',
      TOPUP: 'text-orange-600 bg-orange-50',
      GOLD: 'text-yellow-600 bg-yellow-50',
    };
    return colors[category] || 'text-gray-600 bg-gray-50';
  };

  // Upgrade banner component
  const UpgradeBanner = () => (
    <div className="mt-4 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-5 rounded-xl border border-indigo-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Lock size={20} className="text-indigo-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-[15px] font-bold text-indigo-900 mb-1">Unlock Full Statement Analysis</h4>
          <p className="text-[12px] sm:text-[13px] text-indigo-800 mb-3 sm:mb-0">
            Pro users get unlimited file uploads, detailed compliance reports, and advanced audit features.
          </p>
        </div>
        <button 
          className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-indigo-700 transition flex-shrink-0"
          onClick={() => window.dispatchEvent(new CustomEvent("openProModal"))}
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  );

  // Pro status indicator (Responsive width)
  const ProStatusIndicator = () => (
    <div className={`border px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 shadow-sm whitespace-nowrap w-full sm:w-auto ${
      isProUser ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
    }`}>
      <FileText size={14} className={isProUser ? "text-green-700" : "text-gray-500"} />
      <span className={`text-[11px] font-semibold uppercase tracking-wider ${
        isProUser ? "text-green-700" : "text-gray-600"
      }`}>
        {isProUser ? "Pro Plan Active" : "Pro Plan Required"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* ================= TOP NAVIGATION ================= */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 pt-1 sm:pt-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => window.history.back()} 
              className="p-2 -ml-2 rounded-full hover:bg-gray-200/80 active:bg-gray-300 transition-colors text-gray-800 shrink-0"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Statement Analyzer
            </h1>
          </div>
          
          {/* Pro Status on Desktop Only (Moves to Card on Mobile) */}
          <div className="hidden sm:block shrink-0">
            <ProStatusIndicator />
          </div>
        </div>
        
        {/* ================= MAIN CONTAINER ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Sub-Header Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col gap-3">
            {/* Pro Status on Mobile Only */}
            <div className="sm:hidden w-full">
              <ProStatusIndicator />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">
              Audit your fragmented loan statements for a combined continuity analysis.
            </p>
          </div>

          <div className="p-4 sm:p-6">
            
            {/* Queue Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base sm:text-lg font-semibold text-gray-900">+ Statements +</span>
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full">
                  Queue
                </span>
                {!isProUser && (
                  <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 text-[10px] sm:text-xs font-medium rounded-full whitespace-nowrap">
                    {fileEntries.length}/3 files
                  </span>
                )}
              </div>

              {/* Loan Categories (Responsive Wrap) */}
              <div className="flex flex-wrap gap-2 mb-6">
                {loanOptions.map((opt) => {
                  const isActive = currentTypeSelection === opt.type;
                  const fileCount = fileEntries.filter(f => f.type === opt.type).length;
                  
                  return (
                    <button
                      key={opt.type}
                      onClick={() => setCurrentTypeSelection(opt.type)}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
                        isActive 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {opt.icon}
                      <span className="font-medium">{opt.label}</span>
                      {fileCount > 0 && (
                        <span className={`ml-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full ${
                          isActive ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {fileCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Show upgrade banner for non-pro users */}
            {!isProUser && <UpgradeBanner />}

            {/* Upload Area */}
            <div className="mb-8">
              <div className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors ${
                canUploadMore
                  ? 'border-gray-300 hover:border-blue-400 bg-gray-50 cursor-pointer'
                  : 'border-gray-200 bg-gray-100 opacity-70 cursor-not-allowed'
              }`}>
                {!canUploadMore ? (
                  <>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock size={20} className="text-gray-500" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                      Upload limit reached
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 px-4">
                      Free plan allows up to 3 files. Upgrade to Pro for unlimited uploads.
                    </p>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent("openProModal"))}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                      <Gem size={16} />
                      Upgrade to Pro
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      multiple
                      accept="application/pdf,image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileSelect}
                    />
                    
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      isProUser ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      <Upload size={24} className={isProUser ? "text-blue-600" : "text-gray-500"} />
                    </div>
                    
                    <h3 className={`text-base sm:text-lg font-semibold mb-2 ${isProUser ? "text-gray-900" : "text-gray-600"}`}>
                      {isProUser ? "Click or drag statements here" : "Click or drag statements here (3 max)"}
                    </h3>
                    
                    <div className="inline-flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-1.5 bg-white border border-gray-300 rounded-full shadow-sm mt-2">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-500">CATEGORY:</span>
                      <span className="text-[10px] sm:text-xs font-bold text-purple-600 uppercase">{currentTypeSelection}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Uploaded Files Section */}
            {filteredFiles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3 sm:mb-4">Uploaded Files</h3>
                <div className="space-y-3">
                  {filteredFiles.map((file) => {
                    const isSelected = selectedFileId === file.id;
                    return (
                      <div
                        key={file.id}
                        onClick={() => handleFileClick(file.id)}
                        className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center sm:items-start gap-3 w-full">
                            {/* File Icon */}
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText size={18} className="text-purple-600" />
                            </div>
                            
                            {/* File Info */}
                            <div className="flex-1 overflow-hidden">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{file.name}</h4>
                              <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                                <span className={`px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded ${getCategoryColor(file.category)}`}>
                                  {file.category}
                                </span>
                                <span className="text-[10px] sm:text-xs text-gray-500">{file.size} MB</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Delete Button */}
                          <button
                            onClick={(e) => removeFile(file.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 ml-2"
                            title="Delete file"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {/* Selection Indicator */}
                        {isSelected && isProUser && (
                          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-purple-100/50">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse"></div>
                            <span className="text-[10px] sm:text-xs font-medium text-purple-600">Selected for audit</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected File Display (Preview) */}
            {selectedFile && isProUser && (
              <div className="mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={20} className="text-purple-600" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">{selectedFile.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 text-[10px] sm:text-xs font-bold rounded uppercase">
                            {selectedFile.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (selectedFile.fileObject) {
                          const url = URL.createObjectURL(selectedFile.fileObject);
                          window.open(url, '_blank');
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                      title="Preview file"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Audit Button */}
            <button 
              disabled={fileEntries.length === 0 || loading || !isProUser}
              onClick={handleComplianceAudit}
              className={`w-full py-3.5 sm:py-4 rounded-lg text-sm sm:text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 ${
                fileEntries.length > 0 && !loading && isProUser
                  ? 'bg-[#111827] text-white hover:bg-black shadow-md cursor-pointer'
                  : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  PROCESSING...
                </>
              ) : (
                <>
                  {(!isProUser && fileEntries.length > 0) ? (
                    <>
                      <Lock size={16} />
                      UPGRADE FOR AUDIT
                    </>
                  ) : (
                    "COMPLETE COMPLIANCE AUDIT"
                  )}
                </>
              )}
            </button>

            {/* Compliance Result Alerts */}
            {showComplianceResult && isProUser && (
              <div className="mt-5 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  <span className="font-medium text-green-800">Compliance audit completed successfully</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Stats (Responsive Layout) */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-500 px-1">
          <div className="flex gap-4">
            <span>Total files: <strong className="text-gray-700">{fileEntries.length}</strong></span>
            <span>Category: <strong className="text-gray-700">{currentTypeSelection}</strong></span>
          </div>
          
          {!isProUser && fileEntries.length > 0 && (
            <div className="flex items-center gap-1.5 text-orange-600 font-medium">
              <ZapOff size={14} />
              <span>Free limit: {fileEntries.length}/3 used</span>
            </div>
          )}
          
          {isProUser && (
            <div className="flex items-center gap-1.5 text-green-600 font-medium">
              <CheckCircle size={14} />
              <span>Pro: Unlimited uploads</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StatementAnalyzer;