
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Search, Filter, Star, ShoppingCart, Leaf, Award, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import Chatbot from '@/components/Chatbot';
import { ProductScraper, type ScrapedProduct } from '@/services/productScraper';

const Marketplace = () => {
  const [products, setProducts] = useState<ScrapedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ScrapedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('smartbin_user');
    return userData ? JSON.parse(userData) : null;
  });

  const categories = ['All', 'Mobile Accessories', 'Home & Garden', 'Fashion', 'Smart Home', 'Fitness', 'Lifestyle', 'Tech Accessories', 'Office', 'Electronics', 'Home Decor', 'Kitchen', 'Stationery', 'Accessories'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    setIsLoading(true);
    
    // Try to load from localStorage first
    const stored = localStorage.getItem('smartbin_scraped_products');
    if (stored) {
      const storedProducts = JSON.parse(stored);
      setProducts(storedProducts);
      setIsLoading(false);
      return;
    }

    // If no stored products, create mock products
    const mockProducts = ProductScraper.getMockRecyclingProducts();
    setProducts(mockProducts);
    localStorage.setItem('smartbin_scraped_products', JSON.stringify(mockProducts));
    setIsLoading(false);
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term (case-insensitive, partial matches)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    }

    setFilteredProducts(filtered);
  };

  const handlePurchase = (product: ScrapedProduct) => {
    if (!user || user.coins < product.priceCoins) {
      alert('Insufficient coins! Recycle more plastic to earn coins.');
      return;
    }

    const updatedUser = {
      ...user,
      coins: user.coins - product.priceCoins
    };

    localStorage.setItem('smartbin_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert(`Successfully purchased ${product.name}! Your order will be shipped to your address.`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading sustainable products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <EnhancedNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Eco Marketplace
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing products made from recycled materials. Every purchase supports sustainability and ocean cleanup.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600 mr-2" />
                <span className="text-2xl font-bold text-emerald-600">{products.length}</span>
              </div>
              <p className="text-sm text-gray-600">Products Available</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-green-600">100%</span>
              </div>
              <p className="text-sm text-gray-600">Eco-Friendly</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-blue-600">98%</span>
              </div>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Coins className="w-6 h-6 text-amber-600 mr-2" />
                <span className="text-2xl font-bold text-amber-600">{user?.coins || 0}</span>
              </div>
              <p className="text-sm text-gray-600">Your Coins</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search eco-friendly products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white/80 border-gray-200 rounded-xl"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-xl ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found {filteredProducts.length} products for "{searchTerm}"
            </p>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <div className="relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-emerald-500 text-white">
                        <Leaf className="w-3 h-3 mr-1" />
                        Eco-Friendly
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-semibold">{product.rating || 4.5}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                </Link>
                
                <CardContent className="pt-0">
                  {/* Rating and Reviews */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {renderStars(product.rating || 4.5)}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews || 156} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-amber-500" />
                        <span className="text-xl font-bold text-emerald-600">
                          {product.priceCoins}
                        </span>
                        <span className="text-sm text-gray-500">coins</span>
                      </div>
                      <p className="text-sm text-gray-500">or ₹{product.priceINR}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {product.stock} left
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(product)}
                    disabled={!user || user.coins < product.priceCoins}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {!user || user.coins < product.priceCoins ? 'Insufficient Coins' : 'Buy Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
};

export default Marketplace;
