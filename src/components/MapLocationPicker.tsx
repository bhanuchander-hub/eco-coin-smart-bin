
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, MapPin, Target, Crosshair, Search, Loader2 } from 'lucide-react';

interface MapLocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const MapLocationPicker = ({ onLocationSelect, onClose, initialLat, initialLng }: MapLocationPickerProps) => {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Search function using Nominatim API
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&accept-language=en`
      );
      const results = await response.json();
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocation(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const selectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    if (map) {
      map.setView([lat, lng], 15);
    }
    
    setSelectedLocation({ lat, lng });
    setSelectedAddress(result.display_name);
    setSearchQuery(result.display_name.split(',')[0]); // Show short name in input
    setShowResults(false);
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en&addressdetails=1`
      );
      const data = await response.json();
      setSelectedAddress(data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setSelectedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      
      // Set initial coordinates
      const initLat = initialLat || 28.6139;
      const initLng = initialLng || 77.2090;
      
      // Initialize map
      const mapInstance = L.map('map-container', {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: false
      }).setView([initLat, initLng], 15);
      
      // Add OpenStreetMap tiles with English labels
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        // Force English labels by setting accept-language
        tileSize: 256,
        zoomOffset: 0
      }).addTo(mapInstance);

      let marker: any = null;

      // Handle map clicks
      mapInstance.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker
        if (marker) {
          mapInstance.removeLayer(marker);
        }
        
        // Add new marker
        marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(mapInstance);
        
        setSelectedLocation({ lat, lng });
        reverseGeocode(lat, lng);
      });

      // Set initial location if provided
      if (initialLat && initialLng) {
        setSelectedLocation({ lat: initialLat, lng: initialLng });
        reverseGeocode(initialLat, initialLng);
        
        // Add initial marker
        marker = L.marker([initialLat, initialLng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(mapInstance);
      }

      // Try to get user's current location if no initial location provided
      if (!initialLat && !initialLng && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapInstance.setView([latitude, longitude], 15);
            setSelectedLocation({ lat: latitude, lng: longitude });
            reverseGeocode(latitude, longitude);
          },
          (error) => {
            console.log('Geolocation error:', error);
          }
        );
      }

      setMap(mapInstance);
      setIsLoading(false);
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lng, selectedAddress);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-emerald-600" />
            Select Pickup Location
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              onFocus={() => setShowResults(searchResults.length > 0)}
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
            )}
          </div>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-800 text-sm">
                    {result.display_name.split(',')[0]}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {result.display_name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Map Container */}
        <div className="relative h-96 bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          
          <div id="map-container" className="w-full h-full"></div>
          
          {/* Crosshair in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="relative">
              <Crosshair className="w-8 h-8 text-emerald-600" />
              <div className="absolute inset-0 animate-pulse">
                <Crosshair className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600">
              <Target className="w-4 h-4 mr-2" />
              <div className="text-sm">
                {selectedLocation 
                  ? (
                    <div>
                      <div className="font-medium">{selectedAddress}</div>
                      <div className="text-xs text-gray-500">
                        {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </div>
                    </div>
                  )
                  : 'Click on the map or search to select a location'
                }
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl"
            >
              Set This Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocationPicker;
