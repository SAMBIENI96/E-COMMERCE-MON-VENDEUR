"use client";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Contactez Go-shop</h1>
        <p className="text-slate-600 mb-12">Notre equipe vous repond du lundi au samedi.</p>

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
                <textarea rows="5" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Votre message..." ></textarea>
              </div>
              <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Envoyer</button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <Phone className="text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-800">Telephone</h3>
                <p className="text-slate-600">+229 01 90 00 00 00</p>
                <p className="text-sm text-slate-500">Lun - Sam : 8h - 19h</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-800">Email</h3>
                <p className="text-slate-600">bonjour@goshop.bj</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-800">Adresse</h3>
                <p className="text-slate-600">Marche Dantokpa, Cotonou, Benin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
