
import { useState } from "react";
import QRCode from "qrcode";

export default function App() {
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");

  const generateQR = async (e) => {
    e.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a URL.");
      setQrCode("");
      return;
    }

    try {
      const formattedUrl = /^https?:\/\//i.test(trimmedUrl)
        ? trimmedUrl
        : `https://${trimmedUrl}`;

      const parsedUrl = new URL(formattedUrl);

      if (!parsedUrl.hostname.includes(".")) {
        throw new Error("Invalid URL");
      }

      const generatedQR = await QRCode.toDataURL(formattedUrl, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      setQrCode(generatedQR);
      setError("");
    } catch {
      setError("Please enter a valid URL.");
      setQrCode("");
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">▦</div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            QR Code <span className="text-red-500">Generator</span>
          </h1>

          <p className="text-slate-400 mt-3">
            Turn any link into a QR code in seconds.
          </p>
        </header>

        {/* Generator Card */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">

          <form onSubmit={generateQR}>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Website URL
            </label>

            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            />

            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full mt-5 bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition"
            >
              Generate QR Code
            </button>
          </form>

          {/* QR Code Result */}
          {qrCode && (
            <div className="mt-8 text-center">
              <div className="bg-white rounded-xl p-4 inline-block">
                <img
                  src={qrCode}
                  alt="Generated QR code"
                  className="w-64 h-64 max-w-full"
                />
              </div>

              <p className="text-slate-400 text-sm mt-4 break-all">
                {url.trim().startsWith("http")
                  ? url.trim()
                  : `https://${url.trim()}`}
              </p>

              <button
                onClick={downloadQR}
                className="w-full mt-5 bg-white text-slate-950 hover:bg-slate-200 font-semibold py-3 rounded-xl transition"
              >
                ↓ Download QR Code
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-600 text-sm mt-6">
          Free · Simple · No account required
        </footer>

      </div>
    </main>
  );
}
