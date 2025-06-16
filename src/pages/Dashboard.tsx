
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Coins, QrCode, Recycle, ShoppingCart, Users, Bell, Download, Share, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [recentActivity] = useState([
    { type: 'deposit', date: '2024-01-15', weight: 2.5, coins: 125, description: 'Plastic bottles deposit' },
    { type: 'purchase', date: '2024-01-14', item: 'Eco Phone Case', coins: 200, description: 'Purchase from marketplace' },
    { type: 'deposit', date: '2024-01-13', weight: 1.8, coins: 90, description: 'Mixed plastic containers' },
    { type: 'deposit', date: '2024-01-12', weight: 3.2, coins: 160, description: 'Plastic bottles deposit' }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('smartbin_user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) return null;

  const handleSimulateDeposit = () => {
    navigate('/smartbin');
  };

  const handleQRDownload = () => {
    // Simulate QR code download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(user.qrCode, 100, 100);
      
      const link = document.createElement('a');
      link.download = `smartbin-qr-${user.qrCode}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user.username}!
              </h1>
              <p className="text-gray-600">Ready to make a positive impact today?</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-emerald-100 text-emerald-600">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Coins Display */}
        <Card className="mb-8 bg-gradient-to-r from-amber-400 to-amber-500 border-0 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 mb-2">Total Coins</p>
                <div className="flex items-center space-x-3">
                  <Coins className="w-8 h-8" />
                  <span className="text-4xl font-bold">{user.coins.toLocaleString()}</span>
                </div>
                <p className="text-amber-100 text-sm mt-2">+125 earned today</p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <p className="text-sm text-amber-100">↑ 12% this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* QR Code Card */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>Your QR Code</span>
              </CardTitle>
              <CardDescription>Scan at SmartBin to deposit plastic</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-mono">{user.qrCode}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleQRDownload} className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleSimulateDeposit}
                className="w-full justify-start bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                variant="outline"
              >
                <Recycle className="w-4 h-4 mr-2" />
                Simulate Deposit
              </Button>
              <Button 
                onClick={() => navigate('/marketplace')}
                className="w-full justify-start bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200"
                variant="outline"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
              <Button 
                className="w-full justify-start bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                variant="outline"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Groups
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>Environmental contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Plastic Recycled</span>
                    <span className="font-semibold">28.5 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CO2 Saved</span>
                    <span className="font-semibold">12.3 kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-sky-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Water Saved</span>
                    <span className="font-semibold">145 L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest deposits and purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'deposit' ? 'bg-emerald-100' : 'bg-sky-100'
                    }`}>
                      {activity.type === 'deposit' ? 
                        <Recycle className={`w-5 h-5 ${activity.type === 'deposit' ? 'text-emerald-600' : 'text-sky-600'}`} /> :
                        <ShoppingCart className="w-5 h-5 text-sky-600" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                      {activity.weight && (
                        <p className="text-xs text-gray-400">{activity.weight} kg deposited</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      activity.type === 'deposit' ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {activity.type === 'deposit' ? '+' : '-'}{activity.coins} coins
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
