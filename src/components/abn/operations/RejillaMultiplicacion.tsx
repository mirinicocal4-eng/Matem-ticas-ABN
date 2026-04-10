/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, RefreshCcw, HelpCircle, CheckCircle2 } from 'lucide-react';
import TutorialABN from './TutorialABN';

interface MultiRow {
  id: string;
  decomposed: number;
  product: number | null;
  accumulated: number | null;
}

export default function RejillaMultiplicacion({ grade = 3 }: { grade?: number }) {
  const [multiplicand, setMultiplicand] = useState(145);
  const [multiplier, setMultiplier] = useState(6);
  const [rows, setRows] = useState<MultiRow[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  const generateChallenge = () => {
    let m1, m2;
    if (grade <= 2) {
      m1 = Math.floor(Math.random() * 50) + 10;
      m2 = Math.floor(Math.random() * 4) + 2;
    } else if (grade === 3) {
      m1 = Math.floor(Math.random() * 400) + 20;
      m2 = Math.floor(Math.random() * 8) + 2;
    } else {
      m1 = Math.floor(Math.random() * 2000) + 100;
      m2 = Math.floor(Math.random() * 15) + 5;
    }
    setMultiplicand(m1);
    setMultiplier(m2);
    
    // Decompose multiplicand
    const str = m1.toString();
    const newRows: MultiRow[] = [];
    for (let i = 0; i < str.length; i++) {
      const digit = parseInt(str[i]);
      if (digit !== 0) {
        const val = digit * Math.pow(10, str.length - 1 - i);
        newRows.push({
          id: Math.random().toString(36).substr(2, 9),
          decomposed: val,
          product: null,
          accumulated: null
        });
      }
    }
    setRows(newRows);
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const updateRow = (id: string, field: 'product' | 'accumulated', val: string) => {
    const numVal = val === '' ? null : parseInt(val);
    setRows(rows.map(r => r.id === id ? { ...r, [field]: numVal } : r));
  };

  const checkRow = (index: number) => {
    const row = rows[index];
    if (row.product === null || row.accumulated === null) return 'neutral';
    
    const expectedProduct = row.decomposed * multiplier;
    const prevAccumulated = index > 0 ? rows[index - 1].accumulated : 0;
    const expectedAccumulated = (prevAccumulated || 0) + expectedProduct;

    const productCorrect = row.product === expectedProduct;
    const accumulatedCorrect = row.accumulated === expectedAccumulated;

    if (productCorrect && accumulatedCorrect) return 'correct';
    return 'incorrect';
  };

  const isFinished = rows.length > 0 && rows.every((r, i) => checkRow(i) === 'correct');

  return (
    <div className="bg-pastel-amber/60 p-8 rounded-3xl shadow-xl border-t-8 border-amber-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <X className="text-amber-500" /> Multiplicación ABN
          </h2>
          <p className="text-slate-500 font-medium">Descompón el número y multiplica por partes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTutorial(true)} className="p-3 text-amber-400 hover:bg-amber-50 rounded-full transition-all">
            <HelpCircle size={24} />
          </button>
          <button onClick={generateChallenge} className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg">
            <Sparkles size={18} /> Reto
          </button>
          <button onClick={() => setRows(rows.map(r => ({ ...r, product: null, accumulated: null })))} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <RefreshCcw size={24} />
          </button>
        </div>
      </header>

      <div className="bg-amber-50 p-6 rounded-2xl mb-8 flex justify-center items-center gap-6 border-2 border-amber-100">
        <div className="text-center">
          <label className="text-xs font-bold text-amber-400 uppercase">Multiplicando</label>
          <div className="text-4xl font-black text-slate-800">{multiplicand}</div>
        </div>
        <div className="text-4xl font-black text-amber-300">×</div>
        <div className="text-center">
          <label className="text-xs font-bold text-amber-400 uppercase">Multiplicador</label>
          <div className="text-4xl font-black text-amber-600">{multiplier}</div>
        </div>
      </div>

      <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm border-2 border-slate-100">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-4 text-center">Descomposición</th>
            <th className="p-4 text-center">x {multiplier}</th>
            <th className="p-4 text-center">Acumulado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const status = checkRow(index);
            return (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="p-4 text-center font-black text-slate-400 text-xl bg-slate-50/50">
                  {row.decomposed}
                </td>
                <td className="p-4">
                  <input 
                    type="number"
                    value={row.product === null ? '' : row.product}
                    onChange={(e) => updateRow(row.id, 'product', e.target.value)}
                    className={`w-full p-3 rounded-xl border-2 text-center font-black text-xl outline-none transition-all ${
                      status === 'correct' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' :
                      status === 'incorrect' ? 'bg-rose-50 border-rose-400 text-rose-700' :
                      'bg-white border-amber-100 focus:border-amber-400'
                    }`}
                    placeholder="?"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="number"
                    value={row.accumulated === null ? '' : row.accumulated}
                    onChange={(e) => updateRow(row.id, 'accumulated', e.target.value)}
                    className={`w-full p-3 rounded-xl border-2 text-center font-black text-xl outline-none transition-all ${
                      status === 'correct' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' :
                      status === 'incorrect' ? 'bg-rose-50 border-rose-400 text-rose-700' :
                      'bg-white border-amber-100 focus:border-amber-400'
                    }`}
                    placeholder="?"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isFinished && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="mt-8 bg-emerald-50 border-2 border-emerald-200 p-6 rounded-2xl flex items-center gap-4"
        >
          <CheckCircle2 className="text-emerald-500" size={32} />
          <div>
            <h4 className="text-xl font-black text-emerald-800">¡Multiplicación Perfecta!</h4>
            <p className="text-emerald-600 font-medium">El resultado final es {rows[rows.length - 1].accumulated}.</p>
          </div>
        </motion.div>
      )}

      <TutorialABN 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
        title="Cómo Multiplicar en ABN"
        steps={[
          "Descompón el número grande en centenas, decenas y unidades.",
          "Multiplica cada parte por el multiplicador (ej. 100 x 6 = 600).",
          "En la columna de 'Acumulado', ve sumando los resultados parciales.",
          "El último número de la columna 'Acumulado' será el resultado final."
        ]}
        example="Para 145 x 6: Primero 100 x 6 = 600. Luego 40 x 6 = 240 (acumulado 840). Finalmente 5 x 6 = 30 (acumulado 870). ¡Resultado 870!"
      />
    </div>
  );
}
