// CameraCaptureModal.tsx - Interactive camera snapshot utility for homework & working steps
import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, Sparkles } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string, fileName: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileFallbackRef = useRef<HTMLInputElement | null>(null);

  // Start camera stream when modal opens
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
    setIsLoading(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. You can take a photo using your device camera or upload an image file instead.'
          : 'Unable to access your camera directly. Please use the upload or device camera option below.'
      );
    } finally {
      setIsLoading(false);
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
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      const fileName = `popgen_photo_${Date.now()}.jpg`;
      onCapture(capturedImage, fileName);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setCameraError(null);
    onClose();
  };

  const handleFallbackFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onCapture(dataUrl, file.name || 'mobile_photo.jpg');
        handleClose();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-purple-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3 sm:p-4 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-300" />
            <h3 className="font-extrabold text-sm sm:text-base">
              {capturedImage ? 'Review Your Photo' : 'Take a Photo of Your Question or Working'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-purple-800 text-purple-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder or Preview Area */}
        <div className="relative bg-slate-950 flex items-center justify-center min-h-[320px] max-h-[460px] overflow-hidden">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-contain max-h-[460px]"
              referrerPolicy="no-referrer"
            />
          ) : cameraError ? (
            <div className="p-6 text-center space-y-4 max-w-sm text-slate-200">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <div className="space-y-1">
                <div className="font-bold text-sm text-white">Camera Notice</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cameraError}
                </p>
              </div>
              <button
                onClick={() => fileFallbackRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Open Device Camera / File</span>
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Starting camera...</span>
                </div>
              )}
              {/* Viewfinder Alignment Guide */}
              <div className="absolute inset-6 border-2 border-dashed border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <span className="text-[10px] text-white/80 bg-black/40 px-2 py-0.5 rounded self-start">
                  Align PopGen question or working inside
                </span>
                <span className="text-[10px] text-white/80 bg-black/40 px-2 py-0.5 rounded self-end">
                  Ensure writing is sharp &amp; readable
                </span>
              </div>
            </>
          )}

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Hidden File input for fallback */}
          <input
            type="file"
            ref={fileFallbackRef}
            accept="image/*"
            capture="environment"
            onChange={handleFallbackFileInput}
            className="hidden"
          />
        </div>

        {/* Modal Controls Bar */}
        <div className="p-3 sm:p-4 bg-purple-50 border-t border-purple-200 flex flex-wrap items-center justify-between gap-2">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="px-3 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className="px-3 py-2 rounded-xl text-purple-700 hover:text-purple-900 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Use This Photo</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                disabled={!!cameraError}
                className="px-3 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                title="Switch Camera (Front/Back)"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flip Camera</span>
              </button>

              <button
                onClick={handleTakeSnapshot}
                disabled={!!cameraError || isLoading}
                className="px-6 py-2.5 rounded-full bg-purple-900 hover:bg-purple-950 text-white font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse" />
                <span>Snap Photo</span>
              </button>

              <button
                onClick={() => fileFallbackRef.current?.click()}
                className="px-3 py-2 rounded-xl text-purple-800 hover:bg-purple-200/60 font-bold text-xs transition-colors"
                title="Choose file from your phone gallery or computer"
              >
                Browse File
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
