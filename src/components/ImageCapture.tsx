
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X, Loader2, CheckCircle, Weight } from 'lucide-react';
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
  const [wasteWeight, setWasteWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'grams' | 'kg'>('grams');
  
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

  const uploadImageToStorage = async (imageDataUrl: string, analys isResult: any) => {
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

      // Convert weight to grams if needed
      const weightInGrams = weightUnit === 'kg' ? parseFloat(wasteWeight) * 1000 : parseFloat(wasteWeight);

      // Save to waste_uploads table
      const { error: dbError } = await supabase
        .from('waste_uploads')
        .insert({
          image_url: publicUrl,
          image_path: fileName,
          gemini_analysis: analysisResult,
          waste_type: analysisResult.wasteType,
          classification: analysisResult.classification,
          waste_weight_grams: weightInGrams || null
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

  const resetCapture = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setWasteWeight('');
    setWeightUnit('grams');
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

            {/* Waste Weight Input */}
            {analysis && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold flex items-center">
                  <Weight className="w-4 h-4 mr-2" />
                  Waste Weight
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Enter weight"
                    value={wasteWeight}
                    onChange={(e) => setWasteWeight(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    min="0"
                    step="0.1"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as 'grams' | 'kg')}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="grams">grams</option>
                    <option value="kg">kg</option>
                  </select>
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
