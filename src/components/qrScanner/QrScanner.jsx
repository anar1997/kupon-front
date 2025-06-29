import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScanner = ({ onScan, onError }) => {
  const qrCodeRegionId = "html5qr-code-full-region";
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    const config = { fps: 10, qrbox: 250 };
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    html5QrcodeScannerRef.current = html5QrCode;

    // Önce tarayıcıdan kamera izni alınabiliyor mu kontrol et
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText, decodedResult) => {
            onScan(decodedText);
          },
          (errorMessage) => {
            if (onError) onError(errorMessage);
          }
        ).catch(err => {
          if (onError) onError("Başlatma hatası: " + err.message);
        });
      })
      .catch(err => {
        console.error("Kamera erişimi başarısız:", err);
        if (onError) onError("Kamera açılmadı: " + err.message);
      });

    // Component kaldırılırken scanner'ı düzgün durdur
    return () => {
      const stopScanner = async () => {
        try {
          const scanner = html5QrcodeScannerRef.current;
          if (!scanner) return;

          const state = await scanner.getState();
          if (state === 1 || state === 2) { // 1: SCANNING, 2: PAUSED
            await scanner.stop();
          }
          await scanner.clear();
        } catch (err) {
          console.warn("QR scanner durdurulamadı veya zaten durdu:", err);
        }
      };

      stopScanner();
    };
  }, [onScan, onError]);

  return <div id={qrCodeRegionId} style={{ width: '100%' }}></div>;
};

export default QrScanner;
