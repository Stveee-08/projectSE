import React from 'react';
import { Stethoscope, Calendar, LayoutDashboard, User } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-card py-3 px-6 flex items-center gap-8 z-50 rounded-full">
      <NavItem 
        icon={<Calendar size={20} />} 
        label="Booking" 
        active={activeTab === 'booking'} 
        onClick={() => setActiveTab('booking')}
      />
      <NavItem 
        icon={<LayoutDashboard size={20} />} 
        label="Dashboard" 
        active={activeTab === 'dashboard'} 
        onClick={() => setActiveTab('dashboard')}
      />
      <div className="w-[1px] h-6 bg-slate-200" />
      <div className="flex items-center gap-2 text-primary font-bold">
        <Stethoscope size={24} />
        <span className="hidden sm:inline">Klinik Gigi AI</span>
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
      active ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:bg-slate-100'
    }`}
  >
    {icon}
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

export default Navbar;
