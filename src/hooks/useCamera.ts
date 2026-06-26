"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied">("prompt");
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setStream(mediaStream);
      setPermissionState("granted");
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setPermissionState("denied");
          setError("カメラへのアクセスが拒否されました。ブラウザの設定からカメラの使用を許可してください。");
        } else if (err.name === "NotFoundError") {
          setError("カメラが見つかりません。カメラ付きのデバイスでお試しください。");
        } else {
          setError("カメラの起動に失敗しました。");
        }
      }
    }
  }, []);

  const capturePhoto = useCallback((): Blob | null => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    let result: Blob | null = null;
    canvas.toBlob(
      (blob) => { result = blob; },
      "image/jpeg",
      0.85
    );
    return result;
  }, []);

  const capturePhotoAsync = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      if (!video) { resolve(null); return; }
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.85
      );
    });
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return { videoRef, stream, permissionState, error, startCamera, capturePhoto, capturePhotoAsync, stopCamera };
}
