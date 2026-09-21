import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, Sparkles, Upload, FileText, Image as ImageIcon, Eye, Info } from 'lucide-react';
import { CuteRobotIcon } from './CuteRobotIcon';

export interface ScannedImageResult {
  dataUrl: string;
  name: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  qualityIssue?: string | null;
  extractedText?: string;
  confidence?: 'high' | 'medium' | 'low';
  hasDiagram?: boolean;
}

interface ScanQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCapturedOrUploaded: (result: ScannedImageResult, mode: 'ocr' | 'original') => void;
}

export const ScanQuestionModal: React.FC<ScanQuestionModalProps> = ({
  isOpen,
  onClose,
  onImageCapturedOrUploaded
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; sizeBytes?: number; name: string } | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [qualityWarning, setQualityWarning] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, capturedImage]);

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

  // Inspect image quality (resolution, brightness heuristics)
  const analyzeImageQuality = (canvas: HTMLCanvasElement, width: number, height: number): string | null => {
    if (width < 350 || height < 350) {
      return 'Image resolution is low. Small text and superscripts (q², p²) might be hard to read.';
    }

    try {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const sampleW = Math.min(width, 100);
        const sampleH = Math.min(height, 100);
        const imageData = ctx.getImageData(0, 0, sampleW, sampleH);
        const data = imageData.data;
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
        }
        const avgBrightness = totalBrightness / (sampleW * sampleH);
        if (avgBrightness < 40) {
          return 'Image appears very dark or in shadow. Consider taking a photo with better lighting.';
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const warning = analyzeImageQuality(canvas, width, height);

    setQualityWarning(warning);
    setCapturedImage(dataUrl);
    setImageMeta({
      width,
      height,
      name: `Photo_${new Date().toISOString().slice(11, 19).replace(/:/g, '-')}.jpg`
    });
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || 800;
        const height = img.naturalHeight || 600;
        let warning: string | null = null;
        if (width < 350 || height < 350) {
          warning = 'Image resolution is low. Small text and superscripts (q², p²) might be hard to read.';
        }
        setQualityWarning(warning);
        setCapturedImage(dataUrl);
        setImageMeta({
          width,
          height,
          sizeBytes: file.size,
          name: file.name || 'uploaded_image.jpg'
        });
        stopCamera();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setImageMeta(null);
    setQualityWarning(null);
    startCamera();
  };

  const handleChooseMode = (mode: 'ocr' | 'original') => {
    if (!capturedImage) return;
    onImageCapturedOrUploaded(
      {
        dataUrl: capturedImage,
        name: imageMeta?.name || 'question_photo.jpg',
        width: imageMeta?.width,
        height: imageMeta?.height,
        sizeBytes: imageMeta?.sizeBytes,
        qualityIssue: qualityWarning
      },
      mode
    );
    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setImageMeta(null);
    setQualityWarning(null);
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
                <span>Scan / Upload Biology Question</span>
              </h3>
              <p className="text-[11px] text-purple-200">
                Capture question paper, diagrams, tables, or handwritten calculations
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
          {!capturedImage ? (
            <div className="space-y-3">
              {/* Instructions Bar */}
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
                <p className="font-extrabold flex items-center gap-1 text-purple-900">
                  <Info className="w-3.5 h-3.5 text-purple-700" />
                  <span>Tips for best results:</span>
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-purple-800">
                  <span>• Place question flat</span>
                  <span>• Keep camera steady</span>
                  <span>• Avoid glare and heavy shadows</span>
                  <span>• Include diagrams &amp; tables</span>
                </div>
              </div>

              {/* Viewfinder Area */}
              <div className="relative bg-slate-950 rounded-xl overflow-hidden min-h-[260px] sm:min-h-[320px] flex items-center justify-center border border-purple-300">
                {cameraError ? (
                  <div className="p-6 text-center space-y-4 max-w-sm text-slate-200">
                    <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-white">Camera Access</p>
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
                      className="w-full h-full min-h-[260px] sm:min-h-[320px] object-cover"
                    />
                    {isCameraLoading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs font-bold gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                        <span>Starting camera feed...</span>
                      </div>
                    )}
                    {/* Viewfinder Alignment Guide */}
                    <div className="absolute inset-3 sm:inset-5 border-2 border-dashed border-amber-300/70 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                      <span className="text-[10px] text-white font-bold bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md self-start border border-white/20">
                        📄 Align Question &amp; Working inside frame
                      </span>
                      <span className="text-[10px] text-white/90 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md self-end border border-white/20">
                        💡 Ensure text is sharp &amp; in focus
                      </span>
                    </div>
                  </>
                )}

                {/* Hidden Canvas & File Input */}
                <canvas ref={canvasRef} className="hidden" />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            /* Image Captured Preview & Choice Phase */
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-purple-300 max-h-[250px] flex items-center justify-center">
                <img 
                  src={capturedImage} 
                  alt="Captured question" 
                  className="max-h-[250px] w-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs border border-white/20 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retake</span>
                  </button>
                </div>
              </div>

              {/* Quality Diagnostic Warning if any */}
              {qualityWarning && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Image Notice: </span>
                    <span>{qualityWarning} For guaranteed accuracy, using the <strong>Original Image</strong> directly with your AI platform is recommended.</span>
                  </div>
                </div>
              )}

              {/* Two Flexible Options (Equally Visible) */}
              <div className="space-y-2">
                <p className="text-xs font-extrabold text-purple-950 uppercase tracking-wide">
                  How would you like to use this image?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Try to Read Image */}
                  <button
                    type="button"
                    onClick={() => handleChooseMode('ocr')}
                    className="p-3.5 rounded-xl border-2 border-purple-300 hover:border-purple-600 bg-white hover:bg-purple-50/50 text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer group shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-purple-950 font-extrabold text-xs sm:text-sm">
                        <span className="text-base">🔎</span>
                        <span>Try to Read Image</span>
                      </div>
                      <p className="text-[11px] text-purple-700 leading-snug mt-1">
                        Let GenAIde attempt to extract the question and formulas into editable text.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-purple-900 group-hover:text-purple-950 underline">
                      Extract &amp; Edit Text →
                    </span>
                  </button>

                  {/* Option 2: Use Original Image */}
                  <button
                    type="button"
                    onClick={() => handleChooseMode('original')}
                    className="p-3.5 rounded-xl border-2 border-indigo-400 hover:border-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/70 text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer group shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-indigo-950 font-extrabold text-xs sm:text-sm">
                        <span className="text-base">📎</span>
                        <span>Use Original Image</span>
                        <span className="text-[9px] bg-indigo-200 text-indigo-900 font-black px-1.5 py-0.5 rounded-full">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-800 leading-snug mt-1">
                        Keep the original image intact and attach it directly to ChatGPT or Gemini with an expert prompt.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-950 underline">
                      Keep Original File →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3.5 sm:p-4 bg-purple-50 border-t border-purple-200 flex items-center justify-between gap-2">
          {!capturedImage ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                  disabled={!!cameraError || isCameraLoading}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer"
                  title="Flip Camera (Front/Back)"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Flip Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Choose photo from device gallery or files"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-700" />
                  <span>Upload Image File</span>
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
                  disabled={!!cameraError || isCameraLoading}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-amber-300" />
                  <span>Take Photo</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={handleRetake}
                className="px-3.5 py-2 text-xs font-bold text-purple-800 hover:text-purple-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Take Another Photo</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-3.5 py-2 text-xs font-bold text-purple-600 hover:text-purple-900 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
