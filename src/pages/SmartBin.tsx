
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Recycle, Coins, TrendingUp, Camera, Package } from 'lucide-react';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import ImageCapture from '@/components/ImageCapture';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SmartBin = () => {
  const [userStats, setUserStats] = useState({
    coins: 1250,
    recycledWeight: 23.5,
    ecoPoints: 850,
    qrCode: 'SB-ABC123XYZ'
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Load user stats from localStorage or API
    const savedUser = localStorage.getItem('smartbin_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUserStats({
        coins: userData.coins || 1250,
        recycledWeight: userData.recycledWeight || 23.5,
        ecoPoints: userData.ecoPoints || 850,
        qrCode: userData.qrCode || 'SB-ABC123XYZ'
      });
    }
  }, []);

  const handleImageAnalyzed = (analysis: any, imageUrl: string) => {
    console.log('Image analyzed:', analysis);
    toast.success(`Waste identified as ${analysis.wasteType}!`);
    
    // Update user stats (simulate earning coins)
    const coinsEarned = Math.floor(Math.random() * 50) + 10;
    setUserStats(prev => ({
      ...prev,
      coins: prev.coins + coinsEarned,
      ecoPoints: prev.ecoPoints + Math.floor(coinsEarned * 1.2)
    }));
    
    toast.success(`You earned ${coinsEarned} coins!`);
  };

  const handleOrderCreated = (orderId: string) => {
    console.log('Order created:', orderId);
    toast.success('Pickup order created successfully!');
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <EnhancedNavbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Smart Bin Station</h1>
          <p className="text-gray-600">Capture, analyze, and recycle your waste intelligently</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* QR Code Card */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <QrCode className="w-5 h-5" />
                  <span>Your QR Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-32 h-32 bg-gray-900 mx-auto rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-white" />
                </div>
                <p className="font-mono text-sm text-gray-600">{userStats.qrCode}</p>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                  Premium User
                </Badge>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100">Total Coins</p>
                      <p className="text-3xl font-bold">{userStats.coins}</p>
                    </div>
                    <Coins className="w-8 h-8 text-amber-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100">Recycled Weight</p>
                      <p className="text-3xl font-bold">{userStats.recycledWeight} kg</p>
                    </div>
                    <Recycle className="w-8 h-8 text-emerald-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Eco Points</p>
                      <p className="text-3xl font-bold">{userStats.ecoPoints}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-100" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Image Capture Section */}
          <div className="lg:col-span-2">
            <ImageCapture 
              onImageAnalyzed={handleImageAnalyzed}
              onOrderCreated={handleOrderCreated}
            />
            
            {/* Recent Activity */}
            <Card className="mt-6 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm">PET Bottle recycled</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">+25 coins</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Aluminum can detected</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">+15 coins</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Glass bottle sorted</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">+30 coins</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmartBin;
