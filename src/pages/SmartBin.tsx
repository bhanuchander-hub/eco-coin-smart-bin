
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Coins, 
  Recycle, 
  CheckCircle, 
  AlertCircle,
  ShoppingCart,
  ArrowLeft,
  Zap,
  RefreshCw,
  Weight,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const SmartBin = () => {
  const [user, setUser] = useState<any>(null);
  const [depositState, setDepositState] = useState<'idle' | 'scanning' | 'processing' | 'success' | 'error'>('idle');
  const [weight, setWeight] = useState(0);
  const [quality, setQuality] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Ready to scan plastic waste');

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('smartbin_user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const simulateDeposit = () => {
    setDepositState('scanning');
    setMessage('Scanning for plastic materials...');
    setProgress(0);

    // Simulate scanning progress
    const scanningInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanningInterval);
          processDeposit();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const processDeposit = () => {
    setDepositState('processing');
    setMessage('Processing deposit...');
    setProgress(0);

    // Simulate processing with random values
    setTimeout(() => {
      const randomWeight = +(Math.random() * 5 + 0.5).toFixed(1);
      const randomQuality = Math.floor(Math.random() * 30 + 70);
      const calculatedCoins = Math.floor(randomWeight * randomQuality * 0.8);

      setWeight(randomWeight);
      setQuality(randomQuality);
      setCoinsEarned(calculatedCoins);

      // Simulate processing progress
      const processingInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(processingInterval);
            completeDeposit(calculatedCoins);
            return 100;
          }
          return prev + 8;
        });
      }, 150);
    }, 1000);
  };

  const completeDeposit = (coins: number) => {
    if (Math.random() > 0.1) { // 90% success rate
      setDepositState('success');
      setMessage(`Deposit successful! +${coins} coins earned`);
      
      // Update user coins
      const updatedUser = { ...user, coins: user.coins + coins };
      setUser(updatedUser);
      localStorage.setItem('smartbin_user', JSON.stringify(updatedUser));
    } else {
      setDepositState('error');
      setMessage('Deposit failed: Invalid or contaminated material detected');
    }
  };

  const resetDeposit = () => {
    setDepositState('idle');
    setWeight(0);
    setQuality(0);
    setCoinsEarned(0);
    setProgress(0);
    setMessage('Ready to scan plastic waste');
  };

  if (!user) return null;

  const getStatusColor = () => {
    switch (depositState) {
      case 'scanning': return 'text-blue-600';
      case 'processing': return 'text-amber-600';
      case 'success': return 'text-emerald-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (depositState) {
      case 'scanning': return <Camera className="w-6 h-6 text-blue-600 animate-pulse" />;
      case 'processing': return <RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />;
      case 'success': return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'error': return <AlertCircle className="w-6 h-6 text-red-600" />;
      default: return <Recycle className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">SmartBin Deposit Station</h1>
            <p className="text-gray-600">Deposit your plastic waste and earn coins instantly</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* SmartBin Simulator */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-white" />
                  </div>
                  <span>SmartBin Interface</span>
                </CardTitle>
                <CardDescription>Place plastic items in the bin and watch the magic happen</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Camera Feed Simulation */}
                <div className="relative mb-6">
                  <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {depositState === 'idle' ? (
                      <div className="text-center text-gray-500">
                        <Camera className="w-12 h-12 mx-auto mb-2" />
                        <p>Camera Feed</p>
                        <p className="text-sm">Ready to scan</p>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="text-center text-gray-700 relative z-10">
                          <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-2">
                            {getStatusIcon()}
                          </div>
                          <p className="font-medium">Detecting plastic materials...</p>
                          {depositState === 'scanning' && (
                            <div className="mt-2">
                              <div className="w-32 h-1 bg-white/50 rounded-full mx-auto">
                                <div 
                                  className="h-full bg-blue-500 rounded-full transition-all duration-200"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Processing Progress */}
                  {(depositState === 'processing') && (
                    <div className="mt-4">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-gray-600 text-center mt-2">Processing... {progress}%</p>
                    </div>
                  )}
                </div>

                {/* Status Message */}
                <div className="text-center mb-6">
                  <p className={`text-lg font-medium ${getStatusColor()}`}>
                    {message}
                  </p>
                </div>

                {/* Action Button */}
                <div className="text-center">
                  {depositState === 'idle' && (
                    <Button 
                      onClick={simulateDeposit}
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 px-8"
                    >
                      <Recycle className="w-5 h-5 mr-2" />
                      Start Deposit Simulation
                    </Button>
                  )}
                  
                  {(depositState === 'success' || depositState === 'error') && (
                    <Button 
                      onClick={resetDeposit}
                      size="lg"
                      variant="outline"
                      className="px-8"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      New Deposit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Display */}
            <div className="space-y-6">
              {/* Current Deposit Results */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Deposit Analysis</CardTitle>
                  <CardDescription>Real-time analysis of your plastic deposit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Weight className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">Weight Detected</p>
                        <p className="text-sm text-gray-500">Total plastic weight</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{weight} kg</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="font-medium">Quality Rating</p>
                        <p className="text-sm text-gray-500">Recyclability score</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-sky-600">{quality}%</p>
                      <Badge variant={quality >= 80 ? "default" : quality >= 60 ? "secondary" : "destructive"}>
                        {quality >= 80 ? "Excellent" : quality >= 60 ? "Good" : "Fair"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                        <Coins className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-800">Coins Earned</p>
                        <p className="text-sm text-amber-600">Added to your balance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-amber-700">+{coinsEarned}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Balance */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Your Balance</CardTitle>
                  <CardDescription>Current coin balance and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Coins className="w-8 h-8 text-amber-600" />
                      <span className="text-4xl font-bold text-gray-800">{user.coins.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-600">Total coins earned</p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button 
                      onClick={() => navigate('/marketplace')}
                      className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Shop with Coins
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmartBin;
