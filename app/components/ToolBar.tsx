import { Badge, Bell, Heart, Menu, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "@remix-run/react";

import "~/styles/ToolBar.css";

export default function ToolBar({
  login,
  data,
}: {
  login: boolean;
  data: { username: string; email: string };
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(login);

  const navigationItems = [
    { label: "Discover", href: "/discover" },
    { label: "Categories", href: "/categories" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Success Stories", href: "/success-stories" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="/Logo.png"
                alt="Your Company Logo"
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl text-gray-900">One Hand</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          {windowWidth >= 768 && (
            <nav className="navigation space-x-6">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Search Bar */}
          {windowWidth >= 768 && (
            <div className="searchbar items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden sm:flex"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* Favorites */}
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Heart className="h-5 w-5" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="relative h-8 w-auto rounded-full pointer-events-auto"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          // src="/placeholder.svg?height=32&width=32"
                          alt="User"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {data.username || "Guest"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {data.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {data.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>My Projects</DropdownMenuItem>
                    <DropdownMenuItem>Backed Projects</DropdownMenuItem>
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to={"/auth"}>Sign In</Link>
              </>
            )}

            {/* Mobile Menu Button */}
            {windowWidth <= 768 && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2 lg:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-10 pr-4 w-full bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile Actions */}
              <div className="px-3 py-2 space-y-2">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Start a Project
                </Button>

                {!isLoggedIn && (
                  <Button
                    variant="outline"
                    className="w-full sm:hidden"
                    onClick={() => setIsLoggedIn(true)}
                  >
                    Sign Up
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
