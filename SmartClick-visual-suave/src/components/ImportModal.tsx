'use client';

import React, { useState, useRef } from 'react';
import {getMeatImage} from '@/utils/meatImages';
import * as XLSX from 'xlsx';
import { Product, ProductCategory, CATEGORIES } from '@/types';
import {
  parsePrice,
  extractPackageAndUnit,
  guessCategory,
  formatCurrencyBRL,
  ParsedRowResult,
} from '@/utils/importHelper';
import { generateSampleExcelFile } from '@/utils/sampleSheetGenerator';
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Download,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingProducts: Product[];
  onImportConfirmed: (products: Product[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  existingProducts,
  onImportConfirmed,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRowResult[]>([]);
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    processFile(selectedFile);
  };

  const processFile = async (f: File) => {
    setIsProcessing(true);
    try {
      const buffer = await f.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      const results: ParsedRowResult[] = rows.map((row, index) => {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Buscar campos por variações de nomes de colunas
        const findField = (names: string[]) => {
          for (const key of Object.keys(row)) {
            const cleanKey = key.trim().toLowerCase();
            if (names.some((n) => cleanKey.includes(n))) {
              return row[key];
            }
          }
          return undefined;
        };

        const rawName = findField(['nome', 'produto', 'descriç', 'item']) as string;
        const rawBrand = findField(['marca', 'fabricante']) as string;
        const rawContent = findField(['conteudo', 'conteúdo', 'embalagem', 'tamanho', 'peso', 'ml', 'g']) as string;
        const rawUnit = findField(['unidade', 'und', 'un']) as string;
        const rawPrice = findField(['preço', 'preco', 'valor', 'atual', 'venda', 'promo']);
        const rawCategory = findField(['categoria', 'setor', 'departamento']) as string;
        const rawImage = findField(['foto', 'imagem', 'url', 'link']) as string;

        if (!rawName || String(rawName).trim() === '') {
          errors.push('Nome do produto é obrigatório.');
        }

        const price = parsePrice(rawPrice);
        if (price === null || price <= 0) {
          errors.push('Preço inválido ou não informado.');
        }

        // Extração inteligente de conteúdo da embalagem se não informado
        let content = rawContent ? String(rawContent).trim() : '';
        let unit = rawUnit ? String(rawUnit).trim().toLowerCase() : '';

        if (!content && rawName) {
          const extracted = extractPackageAndUnit(String(rawName));
          content = extracted.content;
          if (!unit) unit = extracted.unit;
        }

        if (!unit) {
          unit = 'unidade';
          warnings.push('Unidade definida como padrão (unidade).');
        }

        // Categoria
        let category: ProductCategory = 'mercearia-basica';
        if (rawCategory) {
          const matched = CATEGORIES.find((c) =>
            c.label.toLowerCase().includes(String(rawCategory).toLowerCase().trim())
          );
          if (matched) category = matched.id;
          else category = guessCategory(String(rawName || ''));
        } else if (rawName) {
          category = guessCategory(String(rawName));
        }

        // Verificar duplicados potenciais
        const isDuplicate = existingProducts.some(
          (p) => p.name.trim().toLowerCase() === String(rawName || '').trim().toLowerCase()
        );
        if (isDuplicate) {
          warnings.push('Produto com nome idêntico ou similar já existe no catálogo.');
        }

        return {
          rowIndex: index + 1,
          raw: row,
          errors,
          warnings,
          isDuplicate,
          product: {
            id: `prod-${Date.now()}-${index}`,
            name: String(rawName || '').trim(),
            brand: rawBrand ? String(rawBrand).trim() : '',
            packageContent: content,
            saleUnit: unit,
            currentPrice: price || 0,
            category,
            imageUrl: rawImage ? String(rawImage).trim() : (getMeatImage(String(rawName || '')) || ''),
            isFavorite: false,
            createdAt: new Date().toISOString(),
          },
        };
      });

      setParsedRows(results);
      setStep('review');
    } catch (err) {
      console.error('Erro ao ler planilha:', err);
      alert('Erro ao processar o arquivo. Verifique se o formato é XLSX ou CSV válido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    const validProducts: Product[] = parsedRows
      .filter((r) => r.errors.length === 0 && r.product)
      .map((r) => r.product as Product);

    if (validProducts.length === 0) {
      alert('Nenhum produto válido para importar.');
      return;
    }

    onImportConfirmed(validProducts);
    onClose();
  };

  const handleUpdateRow = (index: number, updatedProd: Partial<Product>) => {
    setParsedRows((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        product: { ...copy[index].product, ...updatedProd },
        errors: [], // Ao editar manualmente, limpamos erro se estiver correto
      };
      return copy;
    });
  };

  const handleRemoveRow = (index: number) => {
    setParsedRows((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Importar Lista de Produtos</h2>
              <p className="text-xs text-slate-500">
                Aceita planilhas Excel (.xlsx) e CSV sem exigir código de barras
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' ? (
            <div className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-purple-50/30 hover:bg-purple-50/60 transition-all cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-purple-600 mb-4 group-hover:scale-105 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-slate-800 mb-1">
                  Clique ou arraste sua planilha aqui
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  Suporta arquivos .xlsx e .csv. Reconhecemos automaticamente colunas como Produto,
                  Preço, Marca e Conteúdo.
                </p>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-200 group-hover:bg-purple-700">
                  Selecionar arquivo do computador
                </span>
              </div>

              {/* Download Demo Excel */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    XLSX
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">
                      Não tem uma planilha pronta agora?
                    </h4>
                    <p className="text-xs text-slate-500">
                      Baixe nossa planilha de demonstração com 10 produtos fictícios já formatados.
                    </p>
                  </div>
                </div>
                <button
                  onClick={generateSampleExcelFile}
                  className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 transition-colors shrink-0"
                >
                  <Download className="w-4 h-4 text-purple-600" />
                  Baixar Planilha Modelo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-purple-50 p-3 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>
                    {parsedRows.length} linhas lidas •{' '}
                    {parsedRows.filter((r) => r.errors.length === 0).length} prontas para importar
                  </span>
                </div>
                <button
                  onClick={() => setStep('upload')}
                  className="text-xs font-bold text-purple-700 hover:underline"
                >
                  Trocar planilha
                </button>
              </div>

              {/* Table Review */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Produto</th>
                      <th className="p-2.5">Marca</th>
                      <th className="p-2.5">Conteúdo</th>
                      <th className="p-2.5">Unidade</th>
                      <th className="p-2.5">Preço Atual</th>
                      <th className="p-2.5">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((row, idx) => {
                      const hasErr = row.errors.length > 0;
                      const hasWarn = row.warnings.length > 0;
                      const prod = row.product;

                      return (
                        <tr
                          key={idx}
                          className={`${
                            hasErr ? 'bg-red-50/50' : hasWarn ? 'bg-amber-50/30' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="p-2.5">
                            {hasErr ? (
                              <span
                                title={row.errors.join(' | ')}
                                className="inline-flex items-center gap-1 text-red-600 font-bold"
                              >
                                <AlertTriangle className="w-4 h-4" />
                                Erro
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                <CheckCircle className="w-4 h-4" />
                                OK
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 font-medium">
                            <input
                              type="text"
                              value={prod?.name || ''}
                              onChange={(e) => handleUpdateRow(idx, { name: e.target.value })}
                              className="w-full bg-transparent border-b border-transparent focus:border-purple-600 outline-none text-slate-900 font-semibold"
                            />
                            {hasWarn && (
                              <div className="text-[10px] text-amber-600 mt-0.5">
                                {row.warnings.join(' ')}
                              </div>
                            )}
                            {hasErr && (
                              <div className="text-[10px] text-red-600 mt-0.5">
                                {row.errors.join(' ')}
                              </div>
                            )}
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={prod?.brand || ''}
                              onChange={(e) => handleUpdateRow(idx, { brand: e.target.value })}
                              className="w-full bg-transparent border-b border-transparent focus:border-purple-600 outline-none text-slate-600"
                              placeholder="Opcional"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={prod?.packageContent || ''}
                              onChange={(e) =>
                                handleUpdateRow(idx, { packageContent: e.target.value })
                              }
                              className="w-20 bg-transparent border-b border-transparent focus:border-purple-600 outline-none text-slate-600"
                              placeholder="Ex: 500g"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={prod?.saleUnit || ''}
                              onChange={(e) => handleUpdateRow(idx, { saleUnit: e.target.value })}
                              className="w-16 bg-transparent border-b border-transparent focus:border-purple-600 outline-none text-slate-600"
                              placeholder="Ex: kg"
                            />
                          </td>
                          <td className="p-2.5 font-bold text-slate-900">
                            {formatCurrencyBRL(prod?.currentPrice || 0)}
                          </td>
                          <td className="p-2.5">
                            <button
                              onClick={() => handleRemoveRow(idx)}
                              className="text-slate-400 hover:text-red-600"
                              title="Remover linha"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>

          {step === 'review' && (
            <button
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-all"
            >
              <span>Confirmar e Importar {parsedRows.filter((r) => r.errors.length === 0).length} Itens</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
