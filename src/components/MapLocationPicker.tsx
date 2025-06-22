
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, MapPin, Target, Crosshair } from 'lucide-react';

interface MapLocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onClose: () => void;
}

const MapLocationPicker = ({ onLocationSelect, onClose }: MapLocationPickerProps) => {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      
      // Initialize map with better default view
      const mapInstance = L.map('map-container', {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: false
      }).setView([28.6139, 77.2090], 15); // Delhi default with zoom 15
      
      // Add OpenStreetMap tiles with better styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstance);

      let marker: any = null;

      // Handle map clicks
      mapInstance.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker
        if (marker) {
          mapInstance.removeLayer(marker);
        }
        
        // Add new marker with custom styling
        marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(mapInstance);
        
        setSelectedLocation({ lat, lng });
      });

      // Handle map movement to update center coordinates
      mapInstance.on('move', () => {
        const center = mapInstance.getCenter();
        setSelectedLocation({ lat: center.lat, lng: center.lng });
      });

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapInstance.setView([latitude, longitude], 15);
            setSelectedLocation({ lat: latitude, lng: longitude });
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
      onLocationSelect(selectedLocation.lat, selectedLocation.lng);
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
              <p className="text-sm">
                {selectedLocation 
                  ? `Selected: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
                  : 'Move the map or click to select a location'
                }
              </p>
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
