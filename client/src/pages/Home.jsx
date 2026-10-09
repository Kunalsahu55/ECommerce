import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaSearch,
  FaMagic,
} from "react-icons/fa";
import api from "../utils/Axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Home & Kitchen",
    "Fashion",
    "Electronics",
    "Office Equipment",
    "Sports & Outdoors",
    "Beauty & Care",
    "Food & Beverage",
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {};
      if (search.trim() !== "") {
        params.search = search.trim();
      }
      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }

      const { data } = await api.get("/products", { params });

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative mx-4 my-6 lg:mx-8 overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 min-h-[75vh] flex flex-col lg:flex-row items-center justify-between gap-12 border border-slate-200/80 shadow-xl bg-slate-900 text-white">
        {/* Background Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column */}
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <FaMagic className="text-xs" />
            <span>Exclusive Drop 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white max-w-2xl">
            Next-Gen <br />
            <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Collection & Style
            </span>
          </h1>

          <p className="text-slate-300 font-normal text-base sm:text-lg max-w-lg mt-6 leading-relaxed">
            Discover street-ready silhouettes, premium urban wear, and standout
            cyber accessories curated for every aesthetic.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-xs uppercase tracking-wider">
              Shop Now
            </button>
            <button className="bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-bold px-6 py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider backdrop-blur-md">
              Explore Catalog
            </button>
          </div>
        </div>

        {/* Right Column / Showcase Card */}
        <div className="flex-1 w-full flex justify-center items-center relative z-10">
          <div className="relative w-full max-w-sm sm:max-w-md bg-slate-800/40 backdrop-blur-2xl p-3.5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden group">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
                alt="Urban Fashion Showcase"
                className="w-full h-[380px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  Featured Drop
                </p>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Cyber Grunge Jacket
                </h3>
              </div>
              <span className="text-base font-black text-rose-300">₹8,999</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Header & Controls */}
        <div className="flex flex-col gap-6 mb-8 border-b border-slate-200 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore handcrafted items, clothing, and high-tech gear.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid / Empty / Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-100 rounded-2xl p-4 h-[420px] flex flex-col justify-between animate-pulse"
              >
                <div className="bg-slate-200 rounded-xl h-48 w-full" />
                <div className="space-y-3 mt-4">
                  <div className="bg-slate-200 h-5 w-3/4 rounded" />
                  <div className="bg-slate-200 h-4 w-1/2 rounded" />
                </div>
                <div className="bg-slate-200 h-10 w-full rounded-xl mt-6" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FaSearch className="text-xl" />
            </div>
            <p className="text-lg font-bold text-slate-800">
              No products found
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find anything matching your filters. Try adjusting
              your search query or active category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const total = product.totalSeats || 100;
              const available =
                product.availableSeats !== undefined
                  ? product.availableSeats
                  : 10;
              const filledPercentage =
                Math.round(((total - available) / total) * 100) || 0;
              const isAlmostFull = available <= total * 0.2;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
                >
                  {/* Card Image Wrapper */}
                  <div className="h-56 bg-slate-100 overflow-hidden relative">
                    <img
                      src={
                        product.image ||
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-white/10">
                      {product.category || "General"}
                    </span>

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-black shadow-md border border-slate-100">
                      {product.price === 0 || product.ticketPrice === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        <span>₹{product.price || product.ticketPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-1">
                        {product.title}
                      </h3>

                      <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Meta Details */}
                      <div className="space-y-1.5 mb-5 text-slate-500 text-xs font-medium">
                        {product.date && (
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-slate-400 shrink-0 text-xs" />
                            <span>
                              {new Date(product.date).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        )}
                        {product.location && (
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-slate-400 shrink-0 text-xs" />
                            <span className="truncate">{product.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress / Actions */}
                    <div>
                      {product.totalSeats !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center text-[11px] font-medium mb-1.5">
                            <span
                              className={
                                isAlmostFull
                                  ? "text-rose-600 font-bold"
                                  : "text-slate-500"
                              }
                            >
                              {available === 0
                                ? "Sold Out"
                                : `${available} / ${total} left`}
                            </span>
                            <span className="text-slate-400">
                              {filledPercentage}% filled
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isAlmostFull ? "bg-rose-500" : "bg-slate-900"
                              }`}
                              style={{ width: `${filledPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <Link
                        to={`/products/${product._id}`}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-xs shadow-sm hover:shadow-md"
                      >
                        View Details <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;