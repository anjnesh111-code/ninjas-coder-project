import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const FaceRecognitionCard = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState({
    timestamp: "Yesterday, 8:30 PM",
    detectedMood: "Mild stress",
    recommendation: "Deep breathing"
  });

  const handleScanFace = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      
      // Update last scan data
      setLastScan({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedMood: "Calm",
        recommendation: "Mindfulness meditation"
      });
      
      toast({
        title: "Facial analysis complete",
        description: "Your current mood appears to be calm. Great job managing your stress!",
      });
    }, 3000);
  };

  return (
    <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
      <div className="bg-gradient-to-r from-accent-green to-secondary p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">Face Analysis</h3>
          <i className="ri-emotion-scan-line text-white text-xl"></i>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center justify-center bg-surface-light rounded-lg p-4 mb-3">
          <div className={`w-16 h-16 rounded-full bg-surface-lighter flex items-center justify-center mb-2 ${
            isScanning ? 'animate-pulse-slow' : ''
          }`}>
            <i className="ri-camera-line text-2xl text-white"></i>
          </div>
          <p className="text-sm text-center text-gray-300 mb-4">
            AI-powered facial analysis to detect stress levels and recommend exercises
          </p>
          <button 
            className={`py-2 px-4 ${
              isScanning ? 'bg-gray-500' : 'bg-accent-green'
            } rounded-full text-sm font-medium text-white`}
            onClick={handleScanFace}
            disabled={isScanning}
          >
            {isScanning ? 'Scanning...' : 'Scan Face'}
          </button>
        </div>
        
        <div className="flex flex-col text-sm text-gray-300">
          <div className="flex justify-between py-1 border-b border-surface-lighter">
            <span>Last scan:</span>
            <span className="text-gray-400">{lastScan.timestamp}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-surface-lighter">
            <span>Detected mood:</span>
            <span className="text-warning">{lastScan.detectedMood}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Recommended:</span>
            <span className="text-primary-light">{lastScan.recommendation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognitionCard;
