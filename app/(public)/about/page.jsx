"use client";
import { Mail, MapPin, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">A propos de Go-shop</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Notre mission</h2>
            <p className="text-slate-600 leading-relaxed">
              Go-shop est une place de marche digitale pensee pour le Benin. Nous aidons
              les vendeurs locaux a exposer leurs produits en ligne et les acheteurs a
              commander facilement depuis Cotonou, Porto-Novo, Abomey-Calavi et au-dela.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Pourquoi Go-shop ?</h2>
            <ul className="space-y-3 text-slate-600">
              <li>Interface claire et rapide sur mobile</li>
              <li>Boutiques locales mises en avant</li>
              <li>Gestion simple des produits et commandes</li>
              <li>Service adapte aux habitudes d'achat au Benin</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 p-8 bg-slate-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">Nos contacts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <Phone className="text-green-600" />
              <div>
                <p className="font-medium">Telephone</p>
                <p className="text-slate-600">+229 01 90 00 00 00</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="text-green-600" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-slate-600">bonjour@goshop.bj</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-green-600" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-slate-600">Marche Dantokpa, Cotonou, Benin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
