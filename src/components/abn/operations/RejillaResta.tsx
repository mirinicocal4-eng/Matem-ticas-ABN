/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, CheckCircle2, RefreshCcw, Sparkles, HelpCircle } from 'lucide-react';
import TutorialABN from './TutorialABN';

interface Row {
  id: string;
  quito: number;
  minuendo: number;
  sustraendo: number;
}

export default function RejillaResta({ grade = 2 }: { grade?: number }) {
  const [minuendo, setMinuendo] = useState(456);
  const [sustraendo, setSustraendo] = useState(123);
  const [rows, setRows] = useState<Row[]>([]);
  const [currentQuito, setCurrentQuito] = useState<string>("");
  const [showTutorial, setShowTutorial] = useState(false);

  const isFinished = rows.length > 0 && rows[rows.length - 1].sustraendo === 0;

  const handleAddRow = () => {
    const val = parseInt(currentQuito);
    if (isNaN(val) || val <= 0) return;

    const lastMinuendo = rows.length > 0 ? rows[rows.length - 1].minuendo : minuendo;
    const lastSustraendo = rows.length > 0 ? rows[rows.length - 1].sustraendo : sustraendo;

    if (val > lastSustraendo) {
      alert("No puedes quitar más de lo que hay en el sustraendo.");
      return;
    }
    if (val > lastMinuendo) {
      alert("No puedes quitar más de lo que hay en el minuendo.");
      return;
    }

    const newRow: Row = {
      id: Math.random().toString(36).substr(2, 9),
      quito: val,
      minuendo: lastMinuendo - val,
      sustraendo: lastSustraendo - val
    };

    setRows([...rows, newRow]);
    setCurrentQuito("");
  };

  const generateChallenge = () => {
    let m, s;
    if (grade === 1) {
      m = Math.floor(Math.random() * 80) + 20;
      s = Math.floor(Math.random() * (m - 10)) + 5;
    } else if (grade === 2) {
      m = Math.floor(Math.random() * 800) + 200;
      s = Math.floor(Math.random() * (m - 50)) + 50;
    } else {
      m = Math.floor(Math.random() * 8000) + 2000;
      s = Math.floor(Math.random() * (m - 500)) + 500;
    }
    setMinuendo(m);
    setSustraendo(s);
    setRows([]);
  };

  return (
    <div className="bg-pastel-rose/60 p-8 rounded-3xl shadow-xl border-t-8 border-rose-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Minus className="text-rose-500" /> Resta ABN (Detracción)
          </h2>
          <p className="text-slate-500 font-medium">Quita la misma cantidad de ambos números</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTutorial(true)} className="p-3 text-rose-400 hover:bg-rose-50 rounded-full transition-all">
            <HelpCircle size={24} />
          </button>
          <button onClick={generateChallenge} className="bg-rose-500 text-white px-6 py-2 rounded-full font-bold hover:bg-rose-600 transition-all shadow-lg">
            <Sparkles size={18} /> Reto
          </button>
          <button onClick={() => setRows([])} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <RefreshCcw size={24} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-8 bg-rose-50 p-6 rounded-2xl border-2 border-rose-100">
        <div className="text-center">
          <label className="text-xs font-bold text-rose-400 uppercase">Minuendo (Tengo)</label>
          <div className="text-4xl font-black text-rose-700">{minuendo}</div>
        </div>
        <div className="text-center">
          <label className="text-xs font-bold text-rose-400 uppercase">Sustraendo (Quito)</label>
          <div className="text-4xl font-black text-rose-700">{sustraendo}</div>
        </div>
      </div>

      <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm border-2 border-slate-100">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-4 text-center">¿Cuánto quito?</th>
            <th className="p-4 text-center">Queda en Minuendo</th>
            <th className="p-4 text-center">Queda en Sustraendo</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map(row => (
              <motion.tr key={row.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="border-b border-slate-100">
                <td className="p-4 text-center font-black text-rose-600 text-xl bg-rose-50/30">{row.quito}</td>
                <td className="p-4 text-center font-bold text-slate-700 text-xl">{row.minuendo}</td>
                <td className={`p-4 text-center font-bold text-xl ${row.sustraendo === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{row.sustraendo}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {!isFinished && (
            <tr className="bg-slate-50">
              <td className="p-4">
                <input 
                  type="number" 
                  value={currentQuito} 
                  onChange={(e) => setCurrentQuito(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRow()}
                  placeholder="Ej: 100"
                  className="w-full p-3 rounded-xl border-2 border-rose-200 focus:border-rose-500 outline-none text-center font-bold"
                />
              </td>
              <td colSpan={2} className="p-4">
                <button onClick={handleAddRow} className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition-all">
                  Quitar Cantidad
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isFinished && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 bg-emerald-50 border-2 border-emerald-200 p-6 rounded-2xl flex items-center gap-4">
          <CheckCircle2 className="text-emerald-500" size={32} />
          <div>
            <h4 className="text-xl font-black text-emerald-800">¡Resta Terminada!</h4>
            <p className="text-emerald-600">El resultado final es {rows[rows.length - 1].minuendo}.</p>
          </div>
        </motion.div>
      )}

      <TutorialABN 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
        title="Cómo Restar en ABN"
        steps={[
          "Decide qué cantidad quieres quitar de ambos números a la vez.",
          "Es más fácil quitar centenas completas, luego decenas y luego unidades.",
          "Resta esa cantidad tanto al minuendo como al sustraendo.",
          "Repite el proceso hasta que en el sustraendo no quede nada (llegue a 0).",
          "Lo que quede en el minuendo al final es el resultado."
        ]}
        example="Para 456 - 123: Quitas 100 (quedan 356 y 23). Luego quitas 20 (quedan 336 y 3). Finalmente quitas 3 (quedan 333 y 0). ¡Resultado 333!"
      />
    </div>
  );
}
