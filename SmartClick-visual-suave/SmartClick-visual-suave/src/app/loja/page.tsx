'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { StoreProfile } from '@/types';
import { getStoreProfile, saveStoreProfile } from '@/utils/storage';
import {
  Store,
  Save,
  MapPin,
  Phone,
  CheckCircle2,
  Palette,
  FileCheck,
} from 'lucide-react';

export default function StoreSettingsPage() {
  const [profile, setProfile] = useState<StoreProfile>(getStoreProfile());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProfile(getStoreProfile());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Minha Loja</h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Configure as informações do seu comércio uma única vez para saírem automaticamente em todos os encartes.
          </p>
        </div>

        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Dados da loja atualizados com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identificação Básica */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Store className="w-4 h-4 text-purple-600" />
              <span>Identificação do Estabelecimento</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nome Fantasia do Mercado / Loja *
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Ex: Supermercado Bom Preço"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  CNPJ (Opcional)
                </label>
                <input
                  type="text"
                  value={profile.cnpj || ''}
                  onChange={(e) => setProfile({ ...profile, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Endereço Completo (Bairro, Cidade, Número)
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Ex: Av. Brasil, 1200 - Centro, São Paulo - SP"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Telefone Fixo / Comercial
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="(11) 3333-4444"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  WhatsApp de Ofertas
                </label>
                <input
                  type="text"
                  value={profile.whatsapp || ''}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Instagram da Loja (@)
                </label>
                <input
                  type="text"
                  value={profile.instagram || ''}
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                  placeholder="@seumercado"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL da Logomarca (Opcional)
                </label>
                <input
                  type="url"
                  value={profile.logoUrl || ''}
                  onChange={(e) => setProfile({ ...profile, logoUrl: e.target.value })}
                  placeholder="https://exemplo.com/logo.png"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rodapé Padrão */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-600" />
              <span>Texto Legal Padrão para Rodapés</span>
            </h2>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">
                Informações legais e regras de pagamento
              </label>
              <textarea
                rows={3}
                value={profile.footerLegalText || ''}
                onChange={(e) => setProfile({ ...profile, footerLegalText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Este texto sairá automaticamente na base de todas as páginas impressas ou digitais dos encartes.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
