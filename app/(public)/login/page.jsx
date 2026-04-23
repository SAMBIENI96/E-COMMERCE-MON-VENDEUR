'use client'
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError("Veuillez remplir tous les champs");
            return;
        }
        
        // Simulation de connexion
        // Ici vous pouvez ajouter la logique réelle d'authentification
        console.log("Connexion:", { email, password });
        
        // Redirection vers le dashboard vendeur ou admin
        router.push("/store");
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto px-6 py-16">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">Connexion</h1>
                    <p className="text-slate-600 text-center mb-8">Connectez-vous à votre compte</p>
                    
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input 
                                    type="email" 
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="••••••••"
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
                            <a href="#" className="text-green-600 hover:underline">Mot de passe oublié ?</a>
                        </div>
                        
                        <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                            Se connecter
                        </button>
                    </form>
                    
                    <p className="text-center text-slate-600 mt-6">
                        Pas de compte ? <a href="/create-store" className="text-green-600 hover:underline font-medium">Créer une boutique</a>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}