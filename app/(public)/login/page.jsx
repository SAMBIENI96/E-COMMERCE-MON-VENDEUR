"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.success("Connexion réussie !");
        // Redirection selon le rôle (la session se recharge)
        router.push("/store");
        router.refresh();
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">Connexion</h1>
          <p className="text-slate-600 text-center mb-8">Connectez-vous a votre espace Go-shop</p>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300" />
                <span className="text-slate-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-green-600 hover:underline">Mot de passe oublie ?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            Pas encore de compte ? <a href="/register" className="text-green-600 hover:underline font-medium">Creer un compte</a>
          </p>
          <p className="text-center text-slate-600 mt-2 text-sm">
            Vous etes vendeur ? <a href="/create-store" className="text-green-600 hover:underline font-medium">Creer votre boutique</a>
          </p>
        </div>
      </div>
    </>
  );
}
