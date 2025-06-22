
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, Package, Eye, Trash2, RefreshCw, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  status: string;
  pickup_address: string;
  latitude?: number;
  longitude?: number;
  special_instructions?: string;
  estimated_weight?: number;
  created_at: string;
  updated_at: string;
  waste_uploads?: {
    image_url: string;
    waste_type: string;
    classification: string;
    gemini_analysis: any;
  };
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          waste_uploads (
            image_url,
            waste_type,
            classification,
            gemini_analysis
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <Package className="w-4 h-4" />;
      case 'in_progress': return <RefreshCw className="w-4 h-4" />;
      case 'completed': return <Package className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length
  };

  const openMapLocation = (latitude?: number, longitude?: number) => {
    if (latitude && longitude) {
      window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
    } else {
      toast.error('Location not available');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <EnhancedNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
            <span className="ml-2 text-lg">Loading orders...</span>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your waste pickup requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{orderStats.total}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{orderStats.inProgress}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filter by status:</span>
              <div className="flex space-x-2">
                {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    className="capitalize"
                  >
                    {status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">
                {filterStatus === 'all' ? "You haven't placed any orders yet." : `No ${filterStatus} orders found.`}
              </p>
              <Button 
                onClick={() => navigate('/smartbin')}
                className="bg-gradient-to-r from-emerald-500 to-teal-500"
              >
                Place Your First Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-500">#{order.id.slice(0, 8)}</div>
                      <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Details */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Pickup Address</p>
                          <p className="text-sm text-gray-600">{order.pickup_address}</p>
                          {order.latitude && order.longitude && (
                            <Button
                              onClick={() => openMapLocation(order.latitude, order.longitude)}
                              size="sm"
                              variant="outline"
                              className="mt-2 text-xs"
                            >
                              View on Map
                            </Button>
                          )}
                        </div>
                      </div>

                      {order.estimated_weight && (
                        <div>
                          <p className="font-medium text-gray-700">Estimated Weight</p>
                          <p className="text-sm text-gray-600">{order.estimated_weight} kg</p>
                        </div>
                      )}

                      {order.special_instructions && (
                        <div>
                          <p className="font-medium text-gray-700">Special Instructions</p>
                          <p className="text-sm text-gray-600">{order.special_instructions}</p>
                        </div>
                      )}
                    </div>

                    {/* Waste Image & Analysis */}
                    {order.waste_uploads && (
                      <div className="space-y-3">
                        <img
                          src={order.waste_uploads.image_url}
                          alt="Waste"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="text-sm space-y-1">
                          <p><strong>Type:</strong> {order.waste_uploads.waste_type}</p>
                          <p><strong>Classification:</strong> {order.waste_uploads.classification}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date(order.updated_at).toLocaleString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={fetchOrders}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Orders</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
