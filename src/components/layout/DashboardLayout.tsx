import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Mic,
  History,
  PawPrint,
  Building2,
  LogOut,
  Menu,
  FileText,
  Phone,
  NotebookPen,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [expanded, setExpanded] = useState(true);

  const location = useLocation();
  const { logout } = useAuth();
const [dropdownOpen, setDropdownOpen] = useState(false);
const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleSidebar = () => setExpanded(!expanded);
  const handleLogout = () => logout();

  const navigationItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/transcribe", label: "Transcribe", icon: <Mic size={20} /> },
    { path: "/history", label: "History", icon: <History size={20} /> },
    { path: "/calls", label: "Calls", icon: <Phone size={20} /> },
    { path: "/pets", label: "Pets", icon: <PawPrint size={20} /> },
    { path: "/clinics", label: "Clinics", icon: <Building2 size={20} /> },
    { path: "/templates", label: "Templates", icon: <NotebookPen size={20} /> },
    { path: "/files", label: "Files", icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background ">
      {/* Toggle Sidebar */}
      <div
        className={cn(
          "absolute justify-end bg-gray-250 text-gray-500",
          expanded ? "left-56" : "left-8"
        )}
      >
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full">
          {expanded ? <PanelLeftClose size={25} /> : <PanelLeftOpen size={20} />}
        </Button>
      </div>

      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={20} />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-30 z-40 flex flex-col bg-[#E6EFFF] border-r shadow-sm transition-all duration-100 md:relative",
          expanded ? "w-64" : "w-16",
          "md:block",
          !expanded && "md:w-16 md:items-center"
        )}
      >
        <div className="flex-col items-center justify-center p-4 border-b">
          <div className="flex items-center justify-center">
            <img
              src={expanded ? "/purrscribe.svg" : "/fulllogo_transparent.png"}
              alt="PurrScribe Logo"
              className={expanded ? "w-[100px]" : "w-[150px]"}
            />
          </div>
        </div>

        <div className="flex flex-col flex-grow p-4 space-y-4 overflow-y-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-white hover:text-accent-foreground",
                !expanded && "justify-center px-0"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {expanded && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="flex-col p-4 border-t">
          <Button
            variant="ghost"
            className={cn(
              "flex items-left text-muted-foreground hover:text-foreground",
              !expanded && "left"
            ) + " max-w-full w-[100px] px-4 ml-0 mt-[4]"}
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-2" />
            {expanded && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content with avatar dropdown inside */}
      <div
        className="flex-1 overflow-auto px-20 md:p-9 mx-px px-20 py-8 relative"
        style={{ marginLeft: expanded ? "0rem" : "0rem" }}
      >
        {/* Avatar Dropdown */}
       
        {/* Page Content */}
        {children}
      </div>
      {/* Avatar Dropdown - Absolutely positioned at top right */}
<div className="absolute top-6 right-6 z-50">
  <div className="relative">
    <div onClick={toggleDropdown} className="cursor-pointer">
      <Avatar className="h-10 w-10">
        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=vet" />
        <AvatarFallback>VT</AvatarFallback>
      </Avatar>
    </div>

    {/* Dropdown Menu */}
    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
         <Link
          to="/profile"
      
        >
          Settings
        </Link>
        </button>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    )}
  </div>
</div>

    </div>
  );
};

export default DashboardLayout;
