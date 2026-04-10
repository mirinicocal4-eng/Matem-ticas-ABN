/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, CheckCircle2, RefreshCcw, Sparkles, HelpCircle } from 'lucide-react';
import TutorialABN from './TutorialABN';

interface Row {
  id: string;
  quito: number;
  a: number;
  b: number;
}

export default function RejillaComparacion({ grade = 2 }: { grade?: number }) {
  const [numA, setNumA] = useState(150);
  const [numB, setNumB] = useState(80);
  const [rows, setRows] = useState<Row[]>([]);
  const [currentQuito, setCurrentQuito] = useState<string>("");
  const [showTutorial, setShowTutorial] = useState(false);

  const lastA = rows.length > 0 ? rows[rows.length - 1].a : numA;
  const lastB = rows.length > 0 ? rows[rows.length - 1].b : numB;
  const isFinished = lastA === 0 || lastB === 0;

  const handleAddRow = () => {
    const val = parseInt(currentQuito);
    if (isNaN(val) || val <= 0) return;

    if (val > lastA || val > lastB) {
      alert("No puedes quitar más de lo que hay en cualquiera de los dos números.");
      return;
    }

    const newRow: Row = {
      id: Math.random().toString(36).substr(2, 9),
      quito: val,
      a: lastA - val,
      b: lastB - val
    };

    setRows([...rows, newRow]);
    setCurrentQuito("");
  };

  const generateChallenge = () => {
    let a, b;
    if (grade <= 2) {
      a = Math.floor(Math.random() * 100) + 50;
      b = Math.floor(Math.random() * 100) + 20;
    } else {
      a = Math.floor(Math.random() * 800) + 200;
      b = Math.floor(Math.random() * 800) + 100;
    }
    setNumA(a);
    setNumB(b);
    setRows([]);
  };

  const difference = Math.abs(lastA - lastB);

  return (
    <div className="bg-pastel-blue/60 p-8 rounded-3xl shadow-xl border-t-8 border-sky-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Scale className="text-sky-500" /> Resta por Comparación
          </h2>
          <p className="text-slate-500 font-medium">¿Cuánto tiene uno más que el otro?</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTutorial(true)} className="p-3 text-sky-400 hover:bg-sky-50 rounded-full transition-all">
            <HelpCircle size={24} />
          </button>
          <button onClick={generateChallenge} className="bg-sky-500 text-white px-6 py-2 rounded-full font-bold hover:bg-sky-600 transition-all shadow-lg">
            <Sparkles size={18} /> Reto
          </button>
          <button onClick={() => setRows([])} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <RefreshCcw size={24} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-8 bg-sky-50 p-6 rounded-2xl border-2 border-sky-100">
        <div className="text-center">
          <label className="text-xs font-bold text-sky-400 uppercase">Cantidad A</label>
          <div className="text-4xl font-black text-sky-700">{numA}</div>
        </div>
        <div className="text-center">
          <label className="text-xs font-bold text-sky-400 uppercase">Cantidad B</label>
          <div className="text-4xl font-black text-sky-700">{numB}</div>
        </div>
      </div>

      <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm border-2 border-slate-100">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-4 text-center">Quito a los dos...</th>
            <th className="p-4 text-center">Queda en A</th>
            <th className="p-4 text-center">Queda en B</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map(row => (
              <motion.tr key={row.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border-b border-slate-100">
                <td className="p-4 text-center font-black text-sky-600 text-xl bg-sky-50/30">{row.quito}</td>
                <td className="p-4 text-center font-bold text-slate-700 text-xl">{row.a}</td>
                <td className="p-4 text-center font-bold text-slate-700 text-xl">{row.b}</td>
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
                  placeholder="Ej: 50"
                  className="w-full p-3 rounded-xl border-2 border-sky-200 focus:border-sky-500 outline-none text-center font-bold"
                />
              </td>
              <td colSpan={2} className="p-4">
                <button onClick={handleAddRow} className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition-all">
                  Quitar de ambos
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
            <h4 className="text-xl font-black text-emerald-800">¡Comparación Terminada!</h4>
            <p className="text-emerald-600 font-medium">La diferencia entre ambos es de {difference}.</p>
          </div>
        </motion.div>
      )}

      <TutorialABN 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
        title="Cómo Restar por Comparación"
        steps={[
          "Esta resta sirve para saber cuánto tiene un número más que otro.",
          "Ve quitando la misma cantidad a los dos números a la vez.",
          "El objetivo es que uno de los dos números llegue a 0.",
          "Cuando uno llegue a 0, lo que quede en el otro número es la diferencia.",
          "¡Ese es el resultado de tu comparación!"
        ]}
        example="Para comparar 150 y 80: Quitas 80 a los dos. El de 80 se queda en 0 y el de 150 se queda en 70. ¡La diferencia es 70!"
      />
    </div>
  );
}
