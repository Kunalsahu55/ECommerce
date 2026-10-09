import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <section className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-black tracking-wider text-slate-900 hover:opacity-80 transition flex items-center gap-1"
          >
            K<span className="text-rose-500">_</span>Kart
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <Link
              to="/"
              className={`transition-colors hover:text-slate-900 ${
                isActive("/") ? "text-slate-900 font-bold border-b-2 border-slate-900 pb-0.5" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-slate-900 ${
                isActive("/about") ? "text-slate-900 font-bold border-b-2 border-slate-900 pb-0.5" : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`transition-colors hover:text-slate-900 ${
                isActive("/contact") ? "text-slate-900 font-bold border-b-2 border-slate-900 pb-0.5" : ""
              }`}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="hidden lg:flex items-center w-80 bg-slate-100/80 rounded-full px-4 py-2 border border-slate-200/60 focus-within:bg-white focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all">
          <CiSearch className="text-xl text-slate-400 shrink-0" />
          <input
            type="search"
            placeholder="Search products..."
            className="w-full ml-2 bg-transparent outline-none text-xs text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>

        {/* Right Section: Cart + Auth Actions */}
        <div className="flex items-center gap-4">
          
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
            aria-label="Cart"
          >
            <CiShoppingCart className="text-2xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </Link>

          {/* Auth Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition shadow-sm active:scale-95"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogOut}
                  className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold uppercase tracking-wider transition active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition shadow-sm active:scale-95"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            {mobileMenuOpen ? <HiX className="text-2xl" /> : <HiOutlineMenuAlt3 className="text-2xl" />}
          </button>
        </div>
      </section>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          
          {/* Mobile Search */}
          <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2.5 border border-slate-200/60">
            <CiSearch className="text-xl text-slate-400 shrink-0" />
            <input
              type="search"
              placeholder="Search products..."
              className="w-full ml-2 bg-transparent outline-none text-xs text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-3 pt-2 text-sm font-semibold text-slate-700">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-slate-900 transition"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-slate-900 transition"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-slate-900 transition"
            >
              Contact
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;