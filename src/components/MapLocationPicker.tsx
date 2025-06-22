
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, MapPin } from 'lucide-react';

interface MapLocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onClose: () => void;
}

const MapLocationPicker = ({ onLocationSelect, onClose }: MapLocationPickerProps) => {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      
      // Initialize map
      const mapInstance = L.map('map-container').setView([28.6139, 77.2090], 10); // Delhi default
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
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
        marker = L.marker([lat, lng]).addTo(mapInstance);
        setSelectedLocation({ lat, lng });
      });

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapInstance.setView([latitude, longitude], 13);
          },
          (error) => {
            console.log('Geolocation error:', error);
          }
        );
      }

      setMap(mapInstance);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-96 m-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Select Pickup Location
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="relative mb-4 h-64">
          <div id="map-container" className="w-full h-full rounded-lg"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {selectedLocation 
              ? `Selected: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
              : 'Click on the map to select a location'
            }
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocationPicker;
