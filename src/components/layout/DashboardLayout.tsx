import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  History,
  PawPrint,
  Building2,
  User,
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

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { path: "/transcribe", label: "Transcribe", icon: <Mic size={20} /> },
    { path: "/history", label: "History", icon: <History size={20} /> },
    { path: "/calls", label: "Calls", icon: <Phone size={20} /> },
    { path: "/pets", label: "Pets", icon: <PawPrint size={20} /> },
    { path: "/clinics", label: "Clinics", icon: <Building2 size={20} /> },
    { path: "/templates", label: "Templates", icon: <NotebookPen size={20} /> },
    { path: "/files", label: "Files", icon: <FileText size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      <div
        className={cn(
          "absolute justify-end bg-gray-250 text-gray-500",
          expanded ? "left-56" : "left-8",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full"
        >
          {expanded ? (
            <PanelLeftClose size={25} />
          ) : (
            <PanelLeftOpen size={20} />
          )}
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
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r shadow-sm transition-all duration-100 md:relative ",
          expanded ? "w-64" : "w-16",
          "md:block",
          !expanded && "md:w-16",
          !expanded && "md:items-center",
        )}
      >
        <div className="flex-col items-center justify-center p-4 border-b">
          <div className="flex items-center justify-center">
            <img
              src={
                expanded ? "/purrscribe-logo.png" : "/fulllogo_transparent.png"
              }
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
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !expanded && "justify-center px-0",
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {expanded && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="flex-col p-4 border-t">
          <div className="flex items-center space-x-6">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=vet" />
              <AvatarFallback>VT</AvatarFallback>
            </Avatar>
            {expanded && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">Dr. Smith</span>
                <span className="text-xs text-muted-foreground">Premium</span>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            className={
              cn(
                "flex items-left text-muted-foreground hover:text-foreground",
                !expanded && "left",
              ) + " max-w-full w-[100px] px-4 ml-5 mt-[4]"
            }
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-2" />
            {expanded && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-1 overflow-auto md:p-8 mx-px px-20 py-[8]"
        style={{ marginLeft: expanded ? "4rem" : "4rem" }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
