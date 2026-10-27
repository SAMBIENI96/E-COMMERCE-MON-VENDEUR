"use client";
import { Search, ShoppingCart, User, LogOut, Store, LayoutDashboard, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cartCount = useSelector((state) => state.cart.total);
  const { data: session, status } = useSession();

  const user = session?.user;

  // Fermer le menu au clic exterieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  // Préchauffe le cache de l'API catalogue au survol/focus des liens produits
  // pour que le clic soit instantané (la base est distante et lente).
  const warmCatalog = () => {
    fetch("/api/products?limit=50").catch(() => {});
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Deconnexion reussie");
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          <Link href="/" className="relative text-4xl font-semibold text-slate-700">
            <span className="text-green-600">Go</span>-shop
            <span className="text-green-600 text-5xl leading-0">.</span>
            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
              Benin
            </p>
          </Link>

          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/" prefetch onMouseEnter={warmCatalog} onFocus={warmCatalog}>Accueil</Link>
            <Link href="/shop" prefetch onMouseEnter={warmCatalog} onFocus={warmCatalog}>Boutique</Link>
            <Link href="/about" prefetch>A propos</Link>
            <Link href="/contact" prefetch>Contact</Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Rechercher un produit"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
              <ShoppingCart size={18} />
              Panier
              <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                {cartCount}
              </button>
            </Link>

            {status === "loading" ? (
              <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-full" />
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Utilisateur"}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="size-8 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-medium">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="hidden lg:inline text-sm font-medium max-w-24 truncate">
                    {user.name}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-medium text-slate-800 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                    >
                      <ShoppingCart size={16} />
                      Mes commandes
                    </Link>

                    {user.role === "SELLER" && (
                      <Link
                        href="/store"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard vendeur
                      </Link>
                    )}

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                      >
                        <LayoutDashboard size={16} />
                        Panel admin
                      </Link>
                    )}

                    {!user.role || user.role === "USER" ? (
                      <Link
                        href="/create-store"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                      >
                        <Store size={16} />
                        Creer ma boutique
                      </Link>
                    ) : null}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={16} />
                      Deconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Connexion
              </Link>
            )}
          </div>

          <div className="sm:hidden">
            {user ? (
              <Link href="/orders" className="px-5 py-1.5 bg-slate-600 text-sm text-white rounded-full">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;
