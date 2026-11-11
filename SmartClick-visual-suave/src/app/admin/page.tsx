'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import {
  ShieldAlert,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  Search,
  Lock,
  Building2,
} from 'lucide-react';

interface ClientStore {
  id: string;
  name: string;
  ownerEmail: string;
  plan: 'mensal' | 'trimestral' | 'anual';
  status: 'ativo' | 'pendente_pix' | 'expirado';
  validUntil: string;
  lastPaymentDate?: string;
}

const INITIAL_CLIENTS: ClientStore[] = [
  {
    id: 'store-1',
    name: 'Supermercado Bom Preço',
    ownerEmail: 'contato@bompreco.com.br',
    plan: 'mensal',
    status: 'ativo',
    validUntil: '2026-12-31',
    lastPaymentDate: '2026-11-01',
  },
  {
    id: 'store-2',
    name: 'Mini Mercado da Esquina',
    ownerEmail: 'esquina@gmail.com',
    plan: 'mensal',
    status: 'pendente_pix',
    validUntil: '2026-11-15',
  },
  {
    id: 'store-3',
    name: 'Hortifruti & Mercearia São José',
    ownerEmail: 'saojose@hotmail.com',
    plan: 'trimestral',
    status: 'ativo',
    validUntil: '2027-02-15',
    lastPaymentDate: '2026-11-10',
  },
];

export default function AdminPage() {
  const [clients, setClients] = useState<ClientStore[]>(INITIAL_CLIENTS);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção, isso é validado via token assinado no servidor / Supabase RLS
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Senha administrativa inválida.');
    }
  };

  const handleManualPixApproval = (id: string) => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const updated = clients.map((c) =>
      c.id === id
        ? {
            ...c,
            status: 'ativo' as const,
            lastPaymentDate: today.toISOString().split('T')[0],
            validUntil: nextMonth.toISOString().split('T')[0],
          }
        : c
    );
    setClients(updated);
  };

  if (!isAdminAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto px-4 py-16 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7 text-purple-400" />
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900">Acesso Administrativo</h1>
              <p className="text-xs text-slate-500 mt-1">
                Área protegida para gestão de assinaturas e liberações de acesso das lojas.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chave Mestra de Acesso
                </label>
                <input
                  type="password"
                  required
                  placeholder="Digite a senha (padrão demo: admin123)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              {errorMsg && (
                <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Entrar no Painel Seguro
              </button>
            </form>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Ambiente Protegido</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Gestão de Clientes e Assinaturas
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Controle de validade de acesso, cobranças e liberação manual de comprovantes Pix.
            </p>
          </div>

          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Sair do Admin
          </button>
        </div>

        {/* Tabela de Lojas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Lojas Cadastradas ({clients.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Estabelecimento</th>
                  <th className="p-3.5">E-mail do Responsável</th>
                  <th className="p-3.5">Plano</th>
                  <th className="p-3.5">Status de Acesso</th>
                  <th className="p-3.5">Validade</th>
                  <th className="p-3.5 text-right">Ação Comercial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((cli) => (
                  <tr key={cli.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      <span>{cli.name}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">{cli.ownerEmail}</td>
                    <td className="p-3.5 capitalize font-semibold">{cli.plan}</td>
                    <td className="p-3.5">
                      {cli.status === 'ativo' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Aguardando Pix
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-medium">{cli.validUntil}</td>
                    <td className="p-3.5 text-right">
                      {cli.status === 'pendente_pix' ? (
                        <button
                          onClick={() => handleManualPixApproval(cli.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                        >
                          Liberar Acesso (Pix Recebido)
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Regular</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
