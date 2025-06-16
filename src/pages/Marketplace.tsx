
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ShoppingCart, Star, Coins, Filter, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [cart, setCart] = useState<any[]>([]);

  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'home', name: 'Home Accessories' },
    { id: 'mobile', name: 'Mobile Accessories' },
    { id: 'jewelry', name: 'Jewelry' },
    { id: 'decor', name: 'Decor' },
    { id: 'bags', name: 'Bags & Storage' }
  ];

  const products = [
    {
      id: 1,
      name: 'Recycled Plastic Phone Case',
      category: 'mobile',
      coinPrice: 250,
      inrPrice: 299,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 124,
      isNew: true,
      description: 'Durable phone case made from 100% recycled ocean plastic'
    },
    {
      id: 2,
      name: 'Eco-Friendly Storage Box',
      category: 'home',
      coinPrice: 180,
      inrPrice: 249,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 89,
      isBestSeller: true,
      description: 'Stylish storage solution crafted from recycled plastic bottles'
    },
    {
      id: 3,
      name: 'Upcycled Plastic Jewelry Set',
      category: 'jewelry',
      coinPrice: 320,
      inrPrice: 449,
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 67,
      isNew: true,
      description: 'Beautiful handcrafted jewelry made from colorful recycled plastics'
    },
    {
      id: 4,
      name: 'Recycled Laptop Stand',
      category: 'home',
      coinPrice: 450,
      inrPrice: 599,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 203,
      isBestSeller: true,
      description: 'Ergonomic laptop stand made from premium recycled materials'
    },
    {
      id: 5,
      name: 'Eco Water Bottle',
      category: 'home',
      coinPrice: 200,
      inrPrice: 299,
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 156,
      description: 'Insulated water bottle crafted from recycled plastic waste'
    },
    {
      id: 6,
      name: 'Recycled Tote Bag',
      category: 'bags',
      coinPrice: 150,
      inrPrice: 199,
      image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400&h=400&fit=crop',
      rating: 4.4,
      reviews: 98,
      description: 'Stylish and durable tote bag made from recycled plastic materials'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.coinPrice - b.coinPrice;
      case 'price-high':
        return b.coinPrice - a.coinPrice;
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.reviews - a.reviews; // Popular = most reviews
    }
  });

  const addToCart = (product: any) => {
    setCart(prev => [...prev, product]);
    // Show success message or animation here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sustainable Marketplace</h1>
          <p className="text-gray-600">Discover amazing products made from recycled materials</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/50"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? 
                "bg-gradient-to-r from-emerald-500 to-sky-500" : 
                "bg-white/50 border-gray-200 hover:bg-white/80"
              }
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <Card 
              key={product.id} 
              className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">New</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge className="bg-amber-500 hover:bg-amber-600">Best Seller</Badge>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to wishlist logic
                  }}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-amber-600">{product.coinPrice} coins</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">or ₹{product.inrPrice}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Cart Indicator */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 shadow-lg"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({cart.length})
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
