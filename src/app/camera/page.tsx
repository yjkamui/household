"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCamera } from "@/hooks/useCamera";
import { saveImage } from "@/lib/images";

export default function CameraPage() {
  const router = useRouter();
  const { videoRef, permissionState, error, startCamera, capturePhotoAsync, stopCamera } = useCamera();
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = async () => {
    const blob = await capturePhotoAsync();
    if (blob) {
      setCapturedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      stopCamera();
    }
  };

  const handleRetake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setCapturedBlob(null);
    setPreviewUrl(null);
    startCamera();
  };

  const handleUse = async () => {
    if (!capturedBlob) return;
    setSaving(true);
    const imageId = await saveImage(capturedBlob);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    router.push(`/add?imageId=${imageId}`);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapturedBlob(file);
    setPreviewUrl(URL.createObjectURL(file));
    stopCamera();
  };

  if (capturedBlob && previewUrl) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="撮影したレシート" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
        <div className="flex gap-4 p-6 justify-center bg-black/80">
          <button
            onClick={handleRetake}
            className="px-6 py-3 rounded-xl border-2 border-white text-white font-medium"
          >
            再撮影
          </button>
          <button
            onClick={handleUse}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-50"
          >
            {saving ? "保存中..." : "この写真を使う"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
          <p className="text-4xl mb-4">📷</p>
          <p className="text-center mb-6">{error}</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium"
          >
            写真を選択
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => router.back()}
            className="mt-4 text-gray-400 underline"
          >
            戻る
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <button
                onClick={() => { stopCamera(); router.back(); }}
                className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center text-xl"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 p-6 bg-black/80">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full border-2 border-white text-white flex items-center justify-center"
            >
              🖼️
            </button>
            <button
              onClick={handleCapture}
              className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:border-indigo-400 transition-colors"
            />
            <div className="w-12 h-12" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </>
      )}
    </div>
  );
}
