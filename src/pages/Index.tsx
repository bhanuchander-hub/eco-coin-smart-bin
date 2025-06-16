
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Leaf, Coins, Recycle, ArrowRight, Star, Award, Users, TrendingUp } from 'lucide-react';
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

  // Updated hero slides with attractive recycling product advertisements
  const heroSlides = [
    {
      type: 'product',
      src: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1600&h=900&fit=crop',
      title: 'Eco-Friendly Phone Cases',
      subtitle: 'Made from 100% Ocean Plastic',
      badge: 'New Arrival',
      coins: '250 Coins'
    },
    {
      type: 'product', 
      src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1600&h=900&fit=crop',
      title: 'Recycled Storage Solutions',
      subtitle: 'Transform Your Space Sustainably',
      badge: 'Best Seller',
      coins: '180 Coins'
    },
    {
      type: 'product',
      src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&h=900&fit=crop',
      title: 'Upcycled Jewelry Collection',
      subtitle: 'Beauty from Recycled Materials',
      badge: 'Limited Edition',
      coins: '320 Coins'
    },
    {
      type: 'product',
      src: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1600&h=900&fit=crop',
      title: 'Smart Home Accessories',
      subtitle: 'Sustainable Tech Solutions',
      badge: 'Trending',
      coins: '450 Coins'
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Recycle className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                SmartBin
              </span>
              <p className="text-xs text-gray-600 font-medium">Sustainable Future</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center"><Award className="w-4 h-4 mr-1 text-emerald-600" /> Certified Platform</span>
              <span className="flex items-center"><Users className="w-4 h-4 mr-1 text-teal-600" /> 50K+ Users</span>
            </div>
            <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
              <QrCode className="w-4 h-4 mr-2" />
              Quick QR Login
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Carousel Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <div
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.src})` }}
              >
                <div className="h-full bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                      <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-emerald-500/90 backdrop-blur-sm rounded-full text-sm font-semibold">
                          {slide.badge}
                        </span>
                      </div>
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl opacity-90 mb-6">
                        {slide.subtitle}
                      </p>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 bg-amber-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                          <Coins className="w-5 h-5" />
                          <span className="font-bold">{slide.coins}</span>
                        </div>
                        <Button className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-3">
                          Shop Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
        >
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Enhanced Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="absolute bottom-6 right-6 flex items-center space-x-2 text-white/80 text-sm">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span>Live Products</span>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-600">50K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-teal-600">2.5M</div>
              <div className="text-sm text-gray-600">Plastic Recycled (kg)</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-cyan-600">15K+</div>
              <div className="text-sm text-gray-600">Products Sold</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-amber-600">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Enhanced Features Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                <TrendingUp className="w-4 h-4 mr-2" />
                Leading the Change
              </div>
              <h2 className="text-4xl font-bold text-gray-800">
                Revolutionizing Plastic Recycling
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your plastic waste into valuable coins and discover amazing sustainable products. 
                Join our community of eco-warriors making a real difference.
              </p>
            </div>

            <div className="grid gap-8">
              <div className="flex items-start space-x-6 p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Recycle className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Smart Recognition Technology</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Advanced AI-powered system automatically identifies and weighs plastic materials, 
                    ensuring accurate quality assessment and fair coin rewards.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-emerald-600 font-medium">
                    <span className="flex items-center"><Star className="w-4 h-4 mr-1" /> 99% Accuracy</span>
                    <span>• Real-time Processing</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6 p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Coins className="w-8 h-8 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Instant Rewards System</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Earn coins immediately based on weight and quality. Higher quality plastics 
                    yield more coins, encouraging proper sorting and clean deposits.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-amber-600 font-medium">
                    <span className="flex items-center"><Coins className="w-4 h-4 mr-1" /> Up to 500 Coins/kg</span>
                    <span>• Instant Transfer</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6 p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-8 h-8 text-cyan-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Curated Sustainable Marketplace</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Shop premium upcycled products made from recycled materials. Every purchase 
                    supports circular economy and reduces environmental impact.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-cyan-600 font-medium">
                    <span className="flex items-center"><Award className="w-4 h-4 mr-1" /> Certified Products</span>
                    <span>• Free Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Login/Register Form */}
          <div className="max-w-md mx-auto w-full">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl text-gray-800 mb-2">Join SmartBin</CardTitle>
                <CardDescription className="text-lg">
                  Start your sustainable journey today and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100">
                    <TabsTrigger value="login" className="text-base">Sign In</TabsTrigger>
                    <TabsTrigger value="register" className="text-base">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div>
                        <Input
                          type="email"
                          placeholder="Email or Username"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/80 border-gray-200 h-12 text-base"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/80 border-gray-200 h-12 text-base"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 h-12 text-base font-semibold">
                        Sign In & Start Earning
                      </Button>
                      <div className="text-center">
                        <a href="#" className="text-sm text-emerald-600 hover:underline font-medium">
                          Forgot Password?
                        </a>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-6">
                      <div>
                        <Input
                          type="text"
                          placeholder="Username"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                          required
                          className="bg-white/80 border-gray-200 h-12 text-base"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          required
                          className="bg-white/80 border-gray-200 h-12 text-base"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          required
                          className="bg-white/80 border-gray-200 h-12 text-base"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Confirm Password" 
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          required
                          className="bg-white/80 border-gray-200 h-12 text-base"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 h-12 text-base font-semibold">
                        Create Account & Get 100 Coins
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Trust indicators */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      SSL Secured
                    </div>
                    <div className="flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      Verified Platform
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      50K+ Trust Us
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Join thousands of users who are already earning coins and contributing to a sustainable future.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="flex items-center"><Recycle className="w-4 h-4 mr-1" /> 2.5M kg Recycled</span>
            <span>•</span>
            <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> 50K+ Active Users</span>
            <span>•</span>
            <span className="flex items-center"><Award className="w-4 h-4 mr-1" /> ISO Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
