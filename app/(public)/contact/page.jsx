'use client'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">Contactez-nous</h1>
                <p className="text-slate-600 mb-12">Nous sommes là pour répondre à vos questions</p>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                                <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Votre nom" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input type="email" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="votre@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                <textarea rows="5" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Votre message..."></textarea>
                            </div>
                            <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                Envoyer
                            </button>
                        </form>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <Phone className="text-green-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-slate-800">Téléphone</h3>
                                <p className="text-slate-600">+33 1 23 45 67 89</p>
                                <p className="text-sm text-slate-500">Lun - Ven: 9h - 18h</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                            <Mail className="text-green-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-slate-800">Email</h3>
                                <p className="text-slate-600">contact@monvendeur.com</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                            <MapPin className="text-green-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-slate-800">Adresse</h3>
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