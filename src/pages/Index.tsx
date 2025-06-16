import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Leaf, Coins, Recycle, ArrowRight, Star, Award, Users, TrendingUp, ShoppingCart, Zap, Target, Globe, Quote, Sparkles, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import Chatbot from '@/components/Chatbot';
import { ProductScraper } from '@/services/productScraper';

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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Enhanced hero slides with eco-plastic product advertisements
  const heroSlides = [
    {
      type: 'product',
      src: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1600&h=900&fit=crop',
      title: 'Ocean Plastic Revolution',
      subtitle: 'Transform Ocean Waste Into Premium Products',
      badge: '🌊 Ocean Rescue',
      coins: '299 Coins',
      discount: '50% OFF',
      eco_impact: '5kg Ocean Plastic Saved',
      quote: '"Every product saves our oceans"',
      sticker: '💙 Ocean Hero'
    },
    {
      type: 'product', 
      src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&h=900&fit=crop',
      title: 'Smart Recycling Solutions',
      subtitle: 'AI-Powered Plastic Recognition & Rewards',
      badge: '🤖 Smart Tech',
      coins: '450 Coins',
      discount: 'NEW',
      eco_impact: '3kg CO₂ Reduced',
      quote: '"Technology meets sustainability"',
      sticker: '⚡ Smart Choice'
    },
  {
  type: 'product',
  src: 'https://images.unsplash.com/photo-1746857086839-40f8690147ab?q=80&w=1284&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  title: 'Upcycled Fashion',
  subtitle: 'Beautiful Accessories from Electronic Waste',
  badge: '✨ Luxury Eco',
  coins: '699 Coins',
  discount: 'Limited',
  eco_impact: '2kg E-Waste Upcycled',
  quote: '"Beauty from waste"',
  sticker: '💎 Eco Luxury'
}
,
    {
      type: 'product',
      src: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=1600&h=900&fit=crop',
      title: 'Green Living Essentials',
      subtitle: 'Sustainable Products for Modern Homes',
      badge: '🌱 Eco Living',
      coins: '799 Coins',
      discount: 'Bundle Deal',
      eco_impact: '10 Bottles Saved',
      quote: '"Live green, live better"',
      sticker: '🏡 Green Home'
    }
  ];

  // Inspiring eco quotes
  const ecoQuotes = [
    "The Earth does not belong to us; we belong to the Earth.",
    "Be the change you wish to see in the world.",
    "Every small action creates a ripple of change.",
    "Recycle today for a better tomorrow."
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  // Auto-advance carousel and quotes
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);

    const quoteTimer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % ecoQuotes.length);
    }, 4000);

    return () => {
      clearInterval(slideTimer);
      clearInterval(quoteTimer);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockProducts = ProductScraper.getMockRecyclingProducts();
    localStorage.setItem('smartbin_scraped_products', JSON.stringify(mockProducts));
    
    localStorage.setItem('smartbin_user', JSON.stringify({
      email,
      username: email.split('@')[0],
      coins: 1250,
      qrCode: 'SB-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ecoPoints: 850,
      recycledWeight: 23.5
    }));
    
    setIsLoading(false);
    navigate('/dashboard');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockProducts = ProductScraper.getMockRecyclingProducts();
    localStorage.setItem('smartbin_scraped_products', JSON.stringify(mockProducts));
    
    const newUser = {
      email: registerData.email,
      username: registerData.username,
      coins: 100,
      qrCode: 'SB-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ecoPoints: 0,
      recycledWeight: 0
    };
    localStorage.setItem('smartbin_user', JSON.stringify(newUser));
    
    setIsLoading(false);
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
      <EnhancedNavbar />

      {/* Enhanced Hero Carousel with Eco Stickers & Quotes */}
      <section className="relative h-[700px] overflow-hidden">
        {/* Floating Eco Stickers */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-20 left-10 animate-bounce delay-0">
            <div className="bg-green-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg rotate-12">
              ♻️ 100% Recycled
            </div>
          </div>
          <div className="absolute top-40 right-20 animate-bounce delay-500">
            <div className="bg-blue-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg -rotate-12">
              🌊 Ocean Safe
            </div>
          </div>
          <div className="absolute bottom-40 left-20 animate-pulse">
            <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg rotate-6">
              🌱 Eco Certified
            </div>
          </div>
          <div className="absolute top-60 right-10 animate-bounce delay-1000">
            <div className="bg-purple-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg -rotate-6">
              ⭐ Premium Quality
            </div>
          </div>
        </div>

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
                <div className="h-full bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-4xl text-white">
                      {/* Badge Row with Enhanced Stickers */}
                      <div className="mb-8 flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 backdrop-blur-sm rounded-full text-sm font-bold shadow-xl animate-pulse">
                          <Sparkles className="w-4 h-4 mr-2" />
                          {slide.badge}
                        </span>
                        <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 backdrop-blur-sm rounded-full text-sm font-bold shadow-xl">
                          <Zap className="w-4 h-4 mr-2" />
                          {slide.discount}
                        </span>
                        <span className="inline-flex items-center px-4 py-2 bg-amber-500/90 backdrop-blur-sm rounded-full text-xs font-bold shadow-lg">
                          {slide.sticker}
                        </span>
                      </div>
                      
                      <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                        {slide.title}
                      </h1>
                      
                      <p className="text-2xl md:text-3xl opacity-90 mb-8 leading-relaxed">
                        {slide.subtitle}
                      </p>

                      {/* Inspiring Quote */}
                      <div className="mb-8 flex items-center space-x-3">
                        <Quote className="w-8 h-8 text-emerald-300" />
                        <p className="text-xl italic text-emerald-200 font-medium">
                          {slide.quote}
                        </p>
                      </div>
                      
                      {/* Enhanced Price & Impact Cards */}
                      <div className="flex flex-wrap items-center gap-6 mb-10">
                        <div className="flex items-center space-x-3 bg-gradient-to-r from-amber-500 to-orange-500 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all">
                          <Coins className="w-8 h-8" />
                          <div>
                            <span className="font-bold text-2xl">{slide.coins}</span>
                            <p className="text-xs opacity-80">Best Value</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl">
                          <Heart className="w-8 h-8" />
                          <div>
                            <span className="font-bold text-lg">{slide.eco_impact}</span>
                            <p className="text-xs opacity-80">Environmental Impact</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <Button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 px-10 py-6 text-xl font-bold rounded-2xl shadow-xl transition-all hover:scale-105 transform">
                          <ShoppingCart className="w-6 h-6 mr-3" />
                          Shop Collection
                        </Button>
                        <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-10 py-6 text-xl font-bold rounded-2xl backdrop-blur-sm">
                          <ArrowRight className="w-6 h-6 mr-3" />
                          Explore Impact
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
          className="absolute left-8 top-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-2xl hover:scale-110"
        >
          <ArrowRight className="w-8 h-8 rotate-180" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-2xl hover:scale-110"
        >
          <ArrowRight className="w-8 h-8" />
        </button>

        {/* Enhanced Dots with Progress */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative w-5 h-5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125 shadow-xl' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></div>
              )}
            </button>
          ))}
        </div>

        {/* Live Eco Status */}
        <div className="absolute bottom-12 right-12 flex items-center space-x-4 text-white/90 text-sm bg-black/30 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
          <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
          <span className="font-medium">Live Eco Impact</span>
          <span className="text-green-300 font-bold">22+ Products Available</span>
        </div>
      </section>

      {/* Rotating Eco Quote Section */}
      <section className="py-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center space-x-4">
            <Quote className="w-8 h-8 text-emerald-200" />
            <p className="text-2xl md:text-3xl font-medium italic transition-all duration-500">
              {ecoQuotes[currentQuote]}
            </p>
            <Quote className="w-8 h-8 text-emerald-200 rotate-180" />
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-white/90 backdrop-blur-sm border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-4 group hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-emerald-600">50K+</div>
              <div className="text-sm text-gray-600 font-medium">Active Recyclers</div>
            </div>
            <div className="space-y-4 group hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl">
                <Recycle className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-teal-600">2.5M</div>
              <div className="text-sm text-gray-600 font-medium">Kg Plastic Recycled</div>
            </div>
            <div className="space-y-4 group hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-cyan-600">22+</div>
              <div className="text-sm text-gray-600 font-medium">Eco Products</div>
            </div>
            <div className="space-y-4 group hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-amber-600">98%</div>
              <div className="text-sm text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Enhanced Features Section */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-sm font-bold shadow-lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                Leading the Green Revolution
              </div>
              <h2 className="text-5xl font-bold text-gray-800 leading-tight">
                Transform Waste Into
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> Wealth</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join our revolutionary platform where every piece of plastic becomes valuable coins, 
                and every purchase creates a sustainable future.
              </p>
            </div>

            {/* ... keep existing code (features grid) */}
            <div className="grid gap-8">
              <div className="flex items-start space-x-6 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-800">AI-Powered Recognition</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Advanced artificial intelligence instantly identifies plastic types, weights, and quality - 
                    ensuring maximum coin rewards for your recycling efforts.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-emerald-600 font-semibold">
                    <span className="flex items-center"><Star className="w-4 h-4 mr-1" /> 99.8% Accuracy</span>
                    <span>• Lightning Fast</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-amber-200 rounded-3xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-10 h-10 text-amber-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-800">Instant Reward System</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Get coins immediately based on weight, quality, and rarity. Premium plastics 
                    yield bonus coins, encouraging better sorting and cleaner deposits.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-amber-600 font-semibold">
                    <span className="flex items-center"><Coins className="w-4 h-4 mr-1" /> Up to 1000 Coins/kg</span>
                    <span>• Instant Transfer</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-100">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-3xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-10 h-10 text-cyan-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-800">Global Marketplace</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Shop premium upcycled products from verified eco-brands worldwide. Every purchase 
                    supports circular economy and funds ocean cleanup projects.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-cyan-600 font-semibold">
                    <span className="flex items-center"><Award className="w-4 h-4 mr-1" /> Certified Eco-Products</span>
                    <span>• Carbon Neutral Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Login/Register Form */}
          <div className="max-w-md mx-auto w-full">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md overflow-hidden">
              <CardHeader className="text-center pb-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <CardTitle className="text-3xl mb-3">Join the Revolution</CardTitle>
                <CardDescription className="text-lg text-emerald-100">
                  Start earning coins and saving the planet today
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-full p-1">
                    <TabsTrigger value="login" className="text-base rounded-full">Sign In</TabsTrigger>
                    <TabsTrigger value="register" className="text-base rounded-full">Register</TabsTrigger>
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
                          className="bg-white/80 border-gray-200 h-14 text-base rounded-xl"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/80 border-gray-200 h-14 text-base rounded-xl"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 h-14 text-base font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        {isLoading ? 'Signing In...' : 'Sign In & Start Earning'}
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
                          placeholder="Choose Username"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                          required
                          className="bg-white/80 border-gray-200 h-14 text-base rounded-xl"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          required
                          className="bg-white/80 border-gray-200 h-14 text-base rounded-xl"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Create Password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          required
                          className="bg-white/80 border-gray-200 h-14 text-base rounded-xl"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Confirm Password" 
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          required
                          className="bg-white/80 border-gray-200 h-14 text-base rounded-xl"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 h-14 text-base font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account & Get 100 Coins'}
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
                      ISO Certified
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

      {/* Enhanced Footer CTA */}
      <footer className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform the World?</h3>
          <p className="text-emerald-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
            Join thousands of eco-warriors who are already earning coins, buying sustainable products, 
            and creating a cleaner planet for future generations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <span className="flex items-center bg-white/10 px-4 py-2 rounded-full">
              <Recycle className="w-4 h-4 mr-2" /> 2.5M kg Recycled
            </span>
            <span className="flex items-center bg-white/10 px-4 py-2 rounded-full">
              <Users className="w-4 h-4 mr-2" /> 50K+ Active Users
            </span>
            <span className="flex items-center bg-white/10 px-4 py-2 rounded-full">
              <Award className="w-4 h-4 mr-2" /> Carbon Neutral Platform
            </span>
            <span className="flex items-center bg-white/10 px-4 py-2 rounded-full">
              <Globe className="w-4 h-4 mr-2" /> Global Impact
            </span>
          </div>
        </div>
      </footer>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
};

export default Index;
