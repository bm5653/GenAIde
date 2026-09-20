import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, Sparkles, Upload, FileText, ArrowRight } from 'lucide-react';
import { CuteRobotIcon } from './CuteRobotIcon';

interface ScanQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTextExtracted: (text: string, mode: 'replace' | 'append') => void;
  existingText?: string;
}

export const ScanQuestionModal: React.FC<ScanQuestionModalProps> = ({
  isOpen,
  onClose,
  onTextExtracted,
  existingText = ''
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [insertionMode, setInsertionMode] = useState<'replace' | 'append'>('replace');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start/Stop camera stream
  useEffect(() => {
    if (isOpen && !capturedImage && !extractedText) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, capturedImage, extractedText]);

  const startCamera = async () => {
    setIsCameraLoading(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. Please allow camera access in your browser or select an image file from your device below.'
          : 'Unable to access camera directly. You can browse or upload a photo of your question.'
      );
    } finally {
      setIsCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
    
    // Automatically trigger scan OCR
    processImageForText(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      stopCamera();
      processImageForText(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const processImageForText = async (imageBase64: string) => {
    setIsScanning(true);
    setScanError(null);
    setExtractedText('');

    try {
      const res = await fetch('/api/scan-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to scan question from image');
      }

      if (!data.extractedText || data.extractedText.trim().length === 0) {
        setScanError('No readable question text was detected in the photo. Please try taking a clearer photo with better lighting.');
      } else {
        setExtractedText(data.extractedText.trim());
      }
    } catch (err: any) {
      console.error('Scan text error:', err);
      setScanError(err.message || 'Error scanning image. Please try again or type the question manually.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedText('');
    setScanError(null);
    startCamera();
  };

  const handleConfirmInsert = () => {
    if (!extractedText.trim()) return;
    onTextExtracted(extractedText.trim(), insertionMode);
    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setExtractedText('');
    setScanError(null);
    setIsScanning(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border-2 border-purple-300 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/10 text-amber-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                <span>Scan Question with Camera</span>
                <span className="text-[10px] bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full font-black uppercase">
                  AI OCR
                </span>
              </h3>
              <p className="text-[11px] text-purple-200">
                Snap or upload a photo of your Biology question to extract text automatically
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-purple-200 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Phase 1: Camera Viewfinder or Scanning */}
          {!extractedText && (
            <div className="relative bg-slate-950 rounded-xl overflow-hidden min-h-[280px] sm:min-h-[340px] flex items-center justify-center border border-purple-300">
              {capturedImage ? (
                <div className="relative w-full h-full min-h-[280px] sm:min-h-[340px] flex items-center justify-center bg-black">
                  <img 
                    src={capturedImage} 
                    alt="Captured question" 
                    className="max-h-[340px] w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-purple-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center space-y-3">
                      <div className="relative">
                        <CuteRobotIcon className="w-12 h-12 text-amber-300 animate-bounce" />
                        <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-spin" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm sm:text-base text-amber-200">
                          Scanning &amp; Transcribing Question...
                        </p>
                        <p className="text-xs text-purple-200 max-w-xs">
                          Extracting formulas, allele notations (p, q, p², 2pq, q²), and problem statements
                        </p>
                      </div>
                      <div className="w-48 h-1.5 bg-purple-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 w-full animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
              ) : cameraError ? (
                <div className="p-6 text-center space-y-4 max-w-sm text-slate-200">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-white">Camera Access Notice</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {cameraError}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File / Photo</span>
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full min-h-[280px] sm:min-h-[340px] object-cover"
                  />
                  {isCameraLoading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs font-bold gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                      <span>Starting camera feed...</span>
                    </div>
                  )}
                  {/* Viewfinder Alignment Guide */}
                  <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-amber-300/70 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                    <span className="text-[10px] text-white font-bold bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md self-start border border-white/20">
                      📄 Align Biology Question inside frame
                    </span>
                    <span className="text-[10px] text-white/90 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md self-end border border-white/20">
                      💡 Ensure good lighting &amp; sharp focus
                    </span>
                  </div>
                </>
              )}

              {/* Hidden Canvas & File Input */}
              <canvas ref={canvasRef} className="hidden" />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Scan Error Message */}
          {scanError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-900">Scanning Issue</p>
                <p className="text-xs text-rose-700">{scanError}</p>
                <button
                  onClick={handleRetake}
                  className="text-xs font-bold text-purple-900 underline mt-1 hover:text-purple-950 cursor-pointer block"
                >
                  Try scanning another photo
                </button>
              </div>
            </div>
          )}

          {/* Phase 2: Extracted Text Review & Edit */}
          {extractedText && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Text Extracted Successfully!</span>
                </div>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="text-xs text-purple-700 hover:text-purple-950 font-bold underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Scan Different Photo</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-purple-950">
                  Review &amp; edit extracted question text:
                </label>
                <textarea
                  rows={5}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-purple-200 bg-[#FAF9F6] text-sm text-purple-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-mono leading-relaxed"
                  placeholder="Extracted text will appear here..."
                />
                <p className="text-[11px] text-purple-600">
                  You can edit or correct any numbers, symbols, or typos before inserting into the question box.
                </p>
              </div>

              {/* Insertion Mode (if there is existing text) */}
              {existingText.trim().length > 0 && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-purple-950">
                    Existing text found in question box:
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-purple-900">
                      <input
                        type="radio"
                        name="insertMode"
                        checked={insertionMode === 'replace'}
                        onChange={() => setInsertionMode('replace')}
                        className="text-purple-700 focus:ring-purple-500"
                      />
                      <span>Replace</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-purple-900">
                      <input
                        type="radio"
                        name="insertMode"
                        checked={insertionMode === 'append'}
                        onChange={() => setInsertionMode('append')}
                        className="text-purple-700 focus:ring-purple-500"
                      />
                      <span>Append to End</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3.5 sm:p-4 bg-purple-50 border-t border-purple-200 flex items-center justify-between gap-2">
          {!extractedText ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                  disabled={!!cameraError || isScanning}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer"
                  title="Flip Camera (Front/Back)"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Flip Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Choose photo from device gallery or files"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-700" />
                  <span className="hidden sm:inline">Upload Photo</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-2 text-xs font-bold text-purple-700 hover:text-purple-950 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleTakeSnapshot}
                  disabled={!!cameraError || isCameraLoading || isScanning}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-amber-300" />
                  <span>Snap &amp; Scan</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-3.5 py-2 text-xs font-bold text-purple-700 hover:text-purple-950 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                id="confirm-scanned-question-btn"
                onClick={handleConfirmInsert}
                disabled={!extractedText.trim()}
                className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Insert into Question Box</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
