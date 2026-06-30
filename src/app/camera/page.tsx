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

  // プレビュー画面
  if (capturedBlob && previewUrl) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col">
        {/* 画像プレビュー（セーフエリア内に収める） */}
        <div
          className="flex-1 flex items-center justify-center overflow-hidden"
          style={{
            paddingTop: "env(safe-area-inset-top, 16px)",
            paddingLeft: "env(safe-area-inset-left, 0px)",
            paddingRight: "env(safe-area-inset-right, 0px)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="撮影したレシート"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        {/* 操作ボタン（ホームバーの上に配置） */}
        <div
          className="flex gap-4 justify-center bg-black/90"
          style={{
            paddingTop: "16px",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          <button
            onClick={handleRetake}
            className="flex-1 py-4 rounded-2xl border-2 border-white text-white font-bold text-base active:opacity-70"
          >
            再撮影
          </button>
          <button
            onClick={handleUse}
            disabled={saving}
            className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-base disabled:opacity-50 active:opacity-70"
          >
            {saving ? "保存中..." : "この写真を使う"}
          </button>
        </div>
      </div>
    );
  }

  // エラー画面
  if (error) {
    return (
      <div
        className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-8 text-white"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 32px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)",
        }}
      >
        <p className="text-5xl mb-4">📷</p>
        <p className="text-center mb-8 text-gray-300 leading-relaxed">{error}</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-xs py-4 rounded-2xl bg-indigo-600 text-white font-bold text-base"
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
          className="mt-4 text-gray-400 underline text-sm"
        >
          戻る
        </button>
      </div>
    );
  }

  // カメラ画面
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* カメラ映像（画面全体） */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 閉じるボタン（Dynamic Island下に配置） */}
        <button
          onClick={() => { stopCamera(); router.back(); }}
          className="absolute left-4 flex items-center justify-center w-11 h-11 rounded-full bg-black/50 text-white text-xl active:bg-black/80"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
        >
          ✕
        </button>

        {/* レシート位置ガイド枠 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4/5 aspect-[3/4] border-2 border-white/60 rounded-xl" />
        </div>
        <p className="absolute bottom-2 left-0 right-0 text-center text-white/70 text-xs pointer-events-none">
          レシートをガイドに合わせてください
        </p>
      </div>

      {/* 撮影ボタンエリア（ホームバー対応） */}
      <div
        className="flex items-center justify-center bg-black"
        style={{
          paddingTop: "20px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
          gap: "40px",
        }}
      >
        {/* ギャラリーボタン */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-white/70 text-2xl active:opacity-70"
        >
          🖼️
        </button>

        {/* シャッターボタン */}
        <button
          onClick={handleCapture}
          className="flex items-center justify-center w-20 h-20 rounded-full bg-white active:scale-95 transition-transform"
          style={{ boxShadow: "0 0 0 4px rgba(255,255,255,0.3)" }}
        >
          <span className="w-16 h-16 rounded-full bg-white border-4 border-gray-200 block" />
        </button>

        {/* 右スペース（バランス用） */}
        <div className="w-14 h-14" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
