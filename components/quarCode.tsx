'use client'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'

const AutoStartQrScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(true)

  useEffect(() => {
    if (!cameraActive) return

    const scanner = new Html5QrcodeScanner(
      'qr-scanner-container',
      {
        qrbox: { width: 250, height: 250 },
        fps: 10,
        aspectRatio: 1,
        disableFlip: true
      },
      false
    )

    scanner.render(
      (decodedText) => {
        scanner.clear()
        setScanResult(decodedText)
        setCameraActive(false)
      },
      (err) => {
        setError(err || 'Kamerani ochib bo\'lmadi')
        setCameraActive(false)
      }
    )

    return () => {
      scanner.clear().catch(() => {})
    }
  }, [cameraActive])

  const restartScanner = () => {
    setScanResult(null)
    setError(null)
    setCameraActive(true)
  }

  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">QR Kod Skaneri</h2>
      
      <div id="qr-scanner-container" className="w-full h-64 bg-black rounded-lg overflow-hidden mb-4">
        {!cameraActive && (
          <div className="w-full h-full flex items-center justify-center text-white">
            {scanResult ? (
              <p>QR kod muvaffaqiyatli skanerlandi!</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>Kamera yuklanmoqda...</p>
            )}
          </div>
        )}
      </div>

      {scanResult && (
        <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
          <p className="font-medium mb-1">Skanerlangan ma'lumot:</p>
          <p className="break-all bg-white p-2 rounded text-sm">{scanResult}</p>
          <button
            onClick={restartScanner}
            className="mt-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Qayta Skanerlash
          </button>
        </div>
      )}

      {error && !scanResult && (
        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="font-medium mb-1">Xatolik yuz berdi:</p>
          <p className="break-all bg-white p-2 rounded text-sm">{error}</p>
          <button
            onClick={restartScanner}
            className="mt-2 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Qayta Urinish
          </button>
        </div>
      )}

      {!scanResult && !error && cameraActive && (
        <p className="text-gray-500 text-sm">QR kodni kamera oldiga ushlab turing...</p>
      )}
    </div>
  )
}

export default AutoStartQrScanner