
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    profile_image_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('smartbin_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadProfile(parsedUser.id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          profile_image_url: data.profile_image_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Upload to Supabase Storage
      const fileName = `profile-${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('waste-images')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('waste-images')
        .getPublicUrl(fileName);

      handleInputChange('profile_image_url', publicUrl);
      toast.success('Profile image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !hasChanges) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('smartbin_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setHasChanges(false);

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <EnhancedNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
            <p className="text-gray-600">You need to login to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <EnhancedNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                My Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-emerald-200">
                    <AvatarImage src={formData.profile_image_url} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-2xl font-bold">
                      {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3 cursor-pointer shadow-lg transition-colors">
                    <Camera className="w-5 h-5" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                
                {isUploading && (
                  <p className="text-sm text-gray-500">Uploading image...</p>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="flex items-center text-gray-700 font-medium">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center text-gray-700 font-medium">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center text-gray-700 font-medium">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center text-gray-700 font-medium">
                    <MapPin className="w-4 h-4 mr-2" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                    className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
