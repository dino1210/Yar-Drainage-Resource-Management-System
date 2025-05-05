import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Plus, ScanQrCode } from "lucide-react";
import jsQR from "jsqr";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

const MobileScannerHome = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scannedData, setScannedData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("Failed to access camera:", err);
        });
    }
  }, [showCamera]);

  const [resourceType, setResourceType] = useState<"tool" | "vehicle" | null>(
    null
  );

  const handleCreateProjectClick = () => {
    navigate("/projects");
  };

  const handleViewProjects = () => {
    navigate("/projects");
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      fetchScannedData(code.data);
    }
  };

  const fetchScannedData = async (qrCode: string) => {
    try {
      // Try tool endpoint first
      let response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tools/qr/${encodeURIComponent(
          qrCode
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setScannedData(data);
        setResourceType("tool");
        setShowModal(true);
        setShowCamera(false);
        return;
      }

      // If not found, try vehicle endpoint
      response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/vehicles/qr/${encodeURIComponent(qrCode)}`
      );
      if (response.ok) {
        const data = await response.json();
        setScannedData(data);
        setResourceType("vehicle");
        setShowModal(true);
        return;
      }

      throw new Error("Resource not found");
    } catch (err) {
      console.error("QR Scan error:", err);
    }
  };

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: "environment",
        width: { ideal: 300 },
        height: { ideal: 300 },
      },
      audio: false,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error("Camera access denied:", err);
      });

    const interval = setInterval(scanQRCode, 800);

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col h-[85vh] rounded-2xl border border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div>
        <PageMeta title="Mobile Scanner" description="" />
        <PageBreadcrumb pageTitle="Mobile Scanner" />
        <div className="h-[73vh] rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mx-auto w-full max-w-[630px] text-center">
            <h3 className="mb-6 text-center font-semibold text-gray-800 dark:text-white/90 text-xl sm:text-2xl bg-blue-100 dark:bg-gray-800 px-4 py-2 rounded-lg w-fit mx-auto">
              Scan to View Info
            </h3>

            <main className="flex-grow flex items-center justify-center px-4">
              <div className="w-full max-w-sm aspect-square shadow-2xl overflow-hidden relative bg-white dark:bg-gray-800">
                {/* Corner Borders */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-gray-500 rounded-tl-md z-10" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-gray-500 rounded-tr-md z-10" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-gray-500 rounded-bl-md z-10" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-gray-500 rounded-br-md z-10" />

                {!showCamera ? (
                  <button
                    onClick={() => setShowCamera(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition z-0"
                  >
                    <ScanQrCode className="w-20 h-20 text-gray-700 dark:text-white" />
                    <span className="text-lg mt-3 text-gray-700 dark:text-white">
                      Tap to Scan
                    </span>
                  </button>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full rounded-md object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </>
                )}
              </div>
            </main>

            <nav className="relative mt-9 border flex flex-col items-center justify-center gap-3 border-gray-200 px-5 py-8 dark:border-gray-800 rounded-xl">
              <button
                onClick={handleCreateProjectClick}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-lg shadow-xl transition"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Create Project</span>
              </button>
              <button
                onClick={handleViewProjects}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-9 py-5 rounded-lg shadow-xl transition"
              >
                <History className="w-4 h-4" />
                <span className="text-sm font-medium">View Projects</span>
              </button>
            </nav>

            {/* Modal */}
            {showModal && scannedData && (
              <div className="fixed inset-0 bg-black/50 flex text-gray-800 dark:text-gray-300 items-center justify-center z-50">
                <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-800 px-10 py-9 dark:border-gray-800 space-y-4 max-h-[90vh] overflow-y-auto">
                  <p className="text-center text-xl">
                    <strong>{scannedData.name}</strong>
                  </p>

                  {resourceType === "tool" && (
                    <>
                      {scannedData.picture && (
                        <img
                          src={`${
                            import.meta.env.VITE_API_BASE_URL
                          }/assets/images/tools/${scannedData.picture}`}
                          alt="Tool"
                          className="w-24 h-24 object-cover mx-auto rounded-lg border border-gray-600 dark:border-gray-200 mb-4"
                        />
                      )}

                      <div className="text-start pl-7 pr-12 space-y-1">
                        <p>
                          <strong>Tag:</strong> {scannedData.tag}
                        </p>
                        <p>
                          <strong>Brand:</strong> {scannedData.brand}
                        </p>
                        <p>
                          <strong>Category:</strong> {scannedData.category}
                        </p>
                        <p>
                          <strong>Status:</strong> {scannedData.status}
                        </p>
                        <p>
                          <strong>Description:</strong>{" "}
                          {scannedData.description}
                        </p>
                        <p>
                          <strong>Purchase Date:</strong>{" "}
                          {scannedData.purchase_date
                            ? new Date(
                                scannedData.purchase_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "-"}
                        </p>
                        <p>
                          <strong>Warranty:</strong>{" "}
                          {scannedData.warranty
                            ? new Date(scannedData.warranty).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "-"}
                        </p>
                        <p>
                          <strong>Remarks:</strong> {scannedData.remarks}
                        </p>
                      </div>
                    </>
                  )}

                  {resourceType === "vehicle" && (
                    <>
                      {scannedData.picture && (
                        <img
                          src={`${
                            import.meta.env.VITE_API_BASE_URL
                          }/assets/images/vehicles/${scannedData.picture}`}
                          alt="Vehicle"
                          className="w-24 h-24 object-cover mx-auto rounded-lg border border-gray-600 dark:border-gray-200 mb-4"
                        />
                      )}

                      <div className="text-start pl-7 pr-12 space-y-1">
                        <p>
                          <strong>Brand:</strong> {scannedData.brand}
                        </p>
                        <p>
                          <strong>Plate No.:</strong> {scannedData.plate_no}
                        </p>
                        <p>
                          <strong>Brand:</strong> {scannedData.brand}
                        </p>
                        <p>
                          <strong>Category:</strong> {scannedData.category}
                        </p>
                        <p>
                          <strong>Fuel Type:</strong> {scannedData.fuel_type}
                        </p>
                        <p>
                          <strong>Location:</strong> {scannedData.location}
                        </p>
                        <p>
                          <strong>Acquisition Date:</strong>
                          {scannedData.acquisition_date}
                        </p>
                        <p>
                          <strong>Maintenance Due:</strong>
                          {scannedData.maintenance_due}
                        </p>
                        <p>
                          <strong>Warranty:</strong> {scannedData.warranty}
                        </p>
                        <p>
                          <strong>Status:</strong> {scannedData.status}
                        </p>
                        <p>
                          <strong>Remarks:</strong> {scannedData.remarks}
                        </p>
                        <p>
                          <strong>Assigned Driver:</strong>{" "}
                          {scannedData.assigned_driver}
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-white border border-gray-800 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-lg w-full"
                    >
                      View Logs
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="mt-2 bg-white border border-gray-800 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-lg w-full"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileScannerHome;
