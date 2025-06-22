
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, Star, Leaf, Package, Hash } from 'lucide-react';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import MapLocationPicker from '@/components/MapLocationPicker';
import { ProductScraper, type ScrapedProduct } from '@/services/productScraper';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ScrapedProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ScrapedProduct[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [productSize, setProductSize] = useState('');
  const [productQuantity, setProductQuantity] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('smartbin_user');
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setIsLoading(true);
    
    // Load products from localStorage or mock data
    const stored = localStorage.getItem('smartbin_scraped_products');
    const products = stored ? JSON.parse(stored) : ProductScraper.getMockRecyclingProducts();
    
    const currentProduct = products.find((p: ScrapedProduct) => p.id === id);
    if (currentProduct) {
      setProduct(currentProduct);
      
      // Load similar products (same category, excluding current product)
      const similar = products
        .filter((p: ScrapedProduct) => p.category === currentProduct.category && p.id !== id)
        .slice(0, 6);
      setSimilarProducts(similar);
    }
    
    setIsLoading(false);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setShowMap(false);
    toast.success('Location selected successfully!');
  };

  const handleBookPickup = async () => {
    if (!user) {
      toast.error('Please login to book pickup');
      return;
    }

    if (!productSize) {
      toast.error('Please select product size');
      return;
    }

    if (!productQuantity || parseInt(productQuantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (!selectedLocation) {
      toast.error('Please select pickup location on map');
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          order_location_lat: selectedLocation.lat,
          order_location_lng: selectedLocation.lng,
          pickup_address: `${selectedLocation.lat}, ${selectedLocation.lng}`,
          product_size: productSize,
          product_quantity: parseInt(productQuantity),
          special_instructions: `Pickup for ${product?.name} - Size: ${productSize}, Quantity: ${productQuantity}`
        });

      if (error) throw error;

      toast.success('Pickup booked successfully!');
      setProductSize('');
      setProductQuantity('1');
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error booking pickup:', error);
      toast.error('Failed to book pickup');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <EnhancedNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <Link to="/marketplace">
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <EnhancedNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/marketplace" className="inline-flex items-center mb-6 text-emerald-600 hover:text-emerald-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        {/* Product Detail Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop';
                }}
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-emerald-500 text-white">
                  <Leaf className="w-3 h-3 mr-1" />
                  Eco-Friendly
                </Badge>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews || 156} reviews)</span>
                </div>
                <CardTitle className="text-3xl mb-2">{product.name}</CardTitle>
                <CardDescription className="text-lg">{product.description}</CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                {/* Price and Stock */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-3xl font-bold text-emerald-600">{product.priceCoins}</span>
                      <span className="text-lg text-gray-500">coins</span>
                    </div>
                    <p className="text-gray-500">or ₹{product.priceINR}</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <Package className="w-4 h-4 mr-1" />
                    {product.stock} available
                  </Badge>
                </div>

                {/* Product Size Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4 inline mr-1" />
                    Product Size
                  </label>
                  <Select value={productSize} onValueChange={setProductSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Number of Products
                  </label>
                  <input
                    type="number"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="1"
                    step="1"
                  />
                </div>

                {/* Location Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Pickup Location
                  </label>
                  <Button
                    onClick={() => setShowMap(true)}
                    variant="outline"
                    className="w-full mb-2"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedLocation ? 'Location Selected' : 'Select on Map'}
                  </Button>
                  {selectedLocation && (
                    <p className="text-sm text-gray-600">
                      Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  )}
                </div>

                {/* Book Pickup Button */}
                <Button
                  onClick={handleBookPickup}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 text-lg"
                  disabled={!productSize || !productQuantity || !selectedLocation || !user}
                >
                  Book Pickup
                </Button>

                {!user && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Please login to book pickup
                  </p>
                )}
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProducts.map((similarProduct) => (
                <Link key={similarProduct.id} to={`/product/${similarProduct.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 overflow-hidden cursor-pointer">
                    <div className="relative">
                      <img
                        src={similarProduct.imageUrl}
                        alt={similarProduct.name}
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
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {similarProduct.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {similarProduct.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-emerald-600">
                            {similarProduct.priceCoins}
                          </span>
                          <span className="text-sm text-gray-500">coins</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {similarProduct.stock} left
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Modal */}
      {showMap && (
        <MapLocationPicker
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
