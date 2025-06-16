
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Recycle, Home, ShoppingCart, User, Settings, LogOut, Coins, Leaf, Search, Award } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const EnhancedNavbar = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('smartbin_user');
    return userData ? JSON.parse(userData) : null;
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('smartbin_user');
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
    { path: '/smartbin', label: 'Smart Bin', icon: Recycle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
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

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 w-96">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search eco-friendly products..."
              className="bg-transparent outline-none flex-1 text-gray-700"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive(item.path) 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Coins Display */}
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 px-4 py-2 rounded-full">
              <Coins className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-bold text-amber-700">
                {user?.coins?.toLocaleString() || '0'}
              </span>
              <span className="text-xs text-amber-600">Coins</span>
            </div>

            {/* Eco Badge */}
            <div className="hidden md:flex items-center space-x-1 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Eco Warrior</span>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username || 'Guest User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'guest@smartbin.com'}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-emerald-600 font-medium">Verified Recycler</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex justify-around py-3 border-t border-gray-200 bg-white/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 transition-colors ${
                  isActive(item.path) ? 'text-emerald-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
