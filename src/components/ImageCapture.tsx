
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X, Loader2, MapPin, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { GeminiApiService } from '@/services/geminiApi';
import { toast } from 'sonner';

interface ImageCaptureProps {
  onImageAnalyzed?: (analysis: any, imageUrl: string) => void;
  onOrderCreated?: (orderId: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageAnalyzed, onOrderCreated }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    address: '',
    specialInstructions: '',
    estimatedWeight: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
        
        // Analyze the captured image
        analyzeImage(imageDataUrl);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setCapturedImage(imageDataUrl);
        analyzeImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    try {
      // Convert data URL to base64
      const base64 = imageDataUrl.split(',')[1];
      
      // Analyze with Gemini API
      const analysisResult = await GeminiApiService.analyzeWasteImage(base64);
      setAnalysis(analysisResult);
      
      // Upload to Supabase Storage
      await uploadImageToStorage(imageDataUrl, analysisResult);
      
      toast.success('Image analyzed successfully!');
      
      if (onImageAnalyzed) {
        onImageAnalyzed(analysisResult, imageDataUrl);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const uploadImageToStorage = async (imageDataUrl: string, analysisResult: any) => {
    setIsUploading(true);
    try {
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Generate unique filename
      const fileName = `waste-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('waste-images')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('waste-images')
        .getPublicUrl(fileName);

      // Save to waste_uploads table
      const { error: dbError } = await supabase
        .from('waste_uploads')
        .insert({
          image_url: publicUrl,
          image_path: fileName,
          gemini_analysis: analysisResult,
          waste_type: analysisResult.wasteType,
          classification: analysisResult.classification
        });

      if (dbError) throw dbError;

      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const createOrder = async () => {
    if (!analysis || !capturedImage) return;

    try {
      // Get user location
      const location = await getCurrentLocation();
      
      const orderData = {
        pickup_address: orderDetails.address || 'Location from GPS',
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        special_instructions: orderDetails.specialInstructions,
        estimated_weight: parseFloat(orderDetails.estimatedWeight) || null,
        status: 'pending'
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Pickup order created successfully!');
      setShowOrderForm(false);
      
      if (onOrderCreated && order) {
        onOrderCreated(order.id);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create pickup order.');
    }
  };

  const getCurrentLocation = (): Promise<{latitude: number, longitude: number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => resolve(null),
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setShowOrderForm(false);
    setOrderDetails({ address: '', specialInstructions: '', estimatedWeight: '' });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Waste Image Capture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!capturedImage && !isCapturing && (
          <div className="space-y-3">
            <Button 
              onClick={startCamera} 
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
            
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline" 
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload from Gallery
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {isCapturing && (
          <div className="space-y-3">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button 
                onClick={() => {
                  setIsCapturing(false);
                  const stream = videoRef.current?.srcObject as MediaStream;
                  if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                  }
                }} 
                variant="outline"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-4">
            <img 
              src={capturedImage} 
              alt="Captured waste" 
              className="w-full rounded-lg"
            />
            
            {isAnalyzing && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Analyzing with AI...</span>
              </div>
            )}

            {analysis && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center text-emerald-700 font-semibold">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Analysis Complete
                </div>
                <p><strong>Type:</strong> {analysis.wasteType}</p>
                <p><strong>Classification:</strong> {analysis.classification}</p>
                <p><strong>Recommendations:</strong> {analysis.recommendations}</p>
                <p><strong>Tips:</strong> {analysis.recyclingTips}</p>
              </div>
            )}

            {analysis && !showOrderForm && (
              <Button 
                onClick={() => setShowOrderForm(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Schedule Pickup
              </Button>
            )}

            {showOrderForm && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Pickup Details</h3>
                <input
                  type="text"
                  placeholder="Pickup Address (optional - we'll use GPS)"
                  value={orderDetails.address}
                  onChange={(e) => setOrderDetails({...orderDetails, address: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Estimated Weight (kg)"
                  value={orderDetails.estimatedWeight}
                  onChange={(e) => setOrderDetails({...orderDetails, estimatedWeight: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Special Instructions"
                  value={orderDetails.specialInstructions}
                  onChange={(e) => setOrderDetails({...orderDetails, specialInstructions: e.target.value})}
                  className="w-full p-2 border rounded h-20"
                />
                <div className="flex gap-2">
                  <Button onClick={createOrder} className="flex-1">
                    Create Order
                  </Button>
                  <Button 
                    onClick={() => setShowOrderForm(false)} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Button 
              onClick={resetCapture} 
              variant="outline" 
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default ImageCapture;
