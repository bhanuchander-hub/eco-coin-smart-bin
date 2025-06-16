
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Leaf, Coins, Recycle, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const heroSlides = [
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&h=900&fit=crop',
      title: 'Transform Waste into Wealth',
      subtitle: 'Join the circular economy revolution'
    },
    {
      type: 'image', 
      src: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=1600&h=900&fit=crop',
      title: 'Smart Recycling, Smarter Rewards',
      subtitle: 'Earn coins for every plastic bottle you recycle'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&h=900&fit=crop',
      title: 'Shop Sustainable Products',
      subtitle: 'Use your earned coins for eco-friendly purchases'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login success
    localStorage.setItem('smartbin_user', JSON.stringify({
      email,
      username: email.split('@')[0],
      coins: 1250,
      qrCode: 'SB-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    }));
    navigate('/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Simulate registration success
    const newUser = {
      email: registerData.email,
      username: registerData.username,
      coins: 100, // Welcome bonus
      qrCode: 'SB-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
    localStorage.setItem('smartbin_user', JSON.stringify(newUser));
    navigate('/dashboard');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              SmartBin
            </span>
          </div>
          <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
            <QrCode className="w-4 h-4 mr-2" />
            Quick QR Login
          </Button>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="h-full bg-cover bg-center bg-gray-400"
                style={{ backgroundImage: `url(${slide.src})` }}
              >
                <div className="h-full bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 animate-fade-in">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Features Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Revolutionizing Plastic Recycling
              </h2>
              <p className="text-gray-600 text-lg">
                Turn your plastic waste into valuable coins and shop for sustainable products. 
                Join thousands of users making a difference for our planet.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Recycle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Smart Deposit System</h3>
                  <p className="text-gray-600">
                    Simply scan your QR code and deposit plastic waste. Our smart bins 
                    automatically weigh and assess quality.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Coins className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Earn Valuable Coins</h3>
                  <p className="text-gray-600">
                    Get rewarded with coins based on the weight and quality of your plastic deposits. 
                    More recycling means more rewards!
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Sustainable Shopping</h3>
                  <p className="text-gray-600">
                    Use your earned coins to purchase beautiful upcycled products made from 
                    recycled plastic materials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login/Register Form */}
          <div className="max-w-md mx-auto w-full">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-gray-800">Welcome to SmartBin</CardTitle>
                <CardDescription>
                  Start your sustainable journey today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Input
                          type="email"
                          placeholder="Email or Username"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/50"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/50"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600">
                        Sign In
                      </Button>
                      <div className="text-center">
                        <a href="#" className="text-sm text-emerald-600 hover:underline">
                          Forgot Password?
                        </a>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          placeholder="Username"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                          required
                          className="bg-white/50"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          required
                          className="bg-white/50"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          required
                          className="bg-white/50"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Confirm Password" 
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          required
                          className="bg-white/50"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600">
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
