'use client'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-slate-800 mb-8">À propos de MON VENDEUR</h1>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Notre Mission</h2>
                        <p className="text-slate-600 leading-relaxed">
                            MON VENDEUR est une plateforme e-commerce multi-vendeurs qui connecte les acheteurs aux vendeurs indépendants. 
                            Nous permettons à chacun de créer sa propre boutique en ligne et de reach des clients à travers le monde.
                        </p>
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Pourquoi nous choisir ?</h2>
                        <ul className="space-y-3 text-slate-600">
                            <li>✓ Interface moderne et responsive</li>
                            <li>✓ Multi-vendeurs</li>
                            <li>✓ Gestion simplifiée des produits</li>
                            <li>✓ Suivi des commandes en temps réel</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 p-8 bg-slate-50 rounded-lg">
                    <h2 className="text-2xl font-semibold text-slate-700 mb-6">Contactez-nous</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4">
                            <Phone className="text-green-600" />
                            <div>
                                <p className="font-medium">Téléphone</p>
                                <p className="text-slate-600">+33 1 23 45 67 89</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="text-green-600" />
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-slate-600">contact@monvendeur.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin className="text-green-600" />
                            <div>
                                <p className="font-medium">Adresse</p>
                                <p className="text-slate-600">Paris, France</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}