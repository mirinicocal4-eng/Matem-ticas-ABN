/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RefreshCcw, Sparkles, HelpCircle, ArrowRightLeft } from 'lucide-react';
import TutorialABN from './TutorialABN';

interface Row {
  id: string;
  paso: number;
  tipo: 'sumar' | 'restar';
  a: number;
  b: number;
  c: number;
}

export default function RejillaSumirresta({ grade = 2 }: { grade?: number }) {
  const [numA, setNumA] = useState(100);
  const [numB, setNumB] = useState(50);
  const [numC, setNumC] = useState(30);
  const [rows, setRows] = useState<Row[]>([]);
  const [currentPaso, setCurrentPaso] = useState<string>("");
  const [tipoPaso, setTipoPaso] = useState<'sumar' | 'restar'>('sumar');
  const [showTutorial, setShowTutorial] = useState(false);

  const isFinished = rows.length > 0 && rows[rows.length - 1].b === 0 && rows[rows.length - 1].c === 0;

  const handleAddRow = () => {
    const val = parseInt(currentPaso);
    if (isNaN(val) || val <= 0) return;

    const lastA = rows.length > 0 ? rows[rows.length - 1].a : numA;
    const lastB = rows.length > 0 ? rows[rows.length - 1].b : numB;
    const lastC = rows.length > 0 ? rows[rows.length - 1].c : numC;

    if (tipoPaso === 'sumar') {
      if (val > lastB) {
        alert("No puedes pasar más de lo que queda en B.");
        return;
      }
      const newRow: Row = {
        id: Math.random().toString(36).substr(2, 9),
        paso: val,
        tipo: 'sumar',
        a: lastA + val,
        b: lastB - val,
        c: lastC
      };
      setRows([...rows, newRow]);
    } else {
      if (val > lastC) {
        alert("No puedes quitar más de lo que queda en C.");
        return;
      }
      if (val > lastA) {
        alert("No puedes quitar más de lo que hay en A.");
        return;
      }
      const newRow: Row = {
        id: Math.random().toString(36).substr(2, 9),
        paso: val,
        tipo: 'restar',
        a: lastA - val,
        b: lastB,
        c: lastC - val
      };
      setRows([...rows, newRow]);
    }
    setCurrentPaso("");
  };

  const generateChallenge = () => {
    let a, b, c;
    if (grade <= 2) {
      a = Math.floor(Math.random() * 100) + 50;
      b = Math.floor(Math.random() * 50) + 20;
      c = Math.floor(Math.random() * 40) + 10;
    } else {
      a = Math.floor(Math.random() * 800) + 200;
      b = Math.floor(Math.random() * 400) + 100;
      c = Math.floor(Math.random() * 300) + 50;
    }
    setNumA(a);
    setNumB(b);
    setNumC(c);
    setRows([]);
  };

  return (
    <div className="bg-pastel-indigo/60 p-8 rounded-3xl shadow-xl border-t-8 border-violet-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <ArrowRightLeft className="text-violet-500" /> Sumirresta ABN
          </h2>
          <p className="text-slate-500 font-medium">Resuelve A + B - C paso a paso</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTutorial(true)} className="p-3 text-violet-400 hover:bg-violet-50 rounded-full transition-all">
            <HelpCircle size={24} />
          </button>
          <button onClick={generateChallenge} className="bg-violet-500 text-white px-6 py-2 rounded-full font-bold hover:bg-violet-600 transition-all shadow-lg">
            <Sparkles size={18} /> Reto
          </button>
          <button onClick={() => setRows([])} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <RefreshCcw size={24} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8 bg-violet-50 p-6 rounded-2xl border-2 border-violet-100">
        <div className="text-center">
          <label className="text-xs font-bold text-violet-400 uppercase">A (Acumulado)</label>
          <div className="text-3xl font-black text-violet-700">{numA}</div>
        </div>
        <div className="text-center">
          <label className="text-xs font-bold text-emerald-400 uppercase">B (Para Sumar)</label>
          <div className="text-3xl font-black text-emerald-600">+{numB}</div>
        </div>
        <div className="text-center">
          <label className="text-xs font-bold text-rose-400 uppercase">C (Para Restar)</label>
          <div className="text-3xl font-black text-rose-600">-{numC}</div>
        </div>
      </div>

      <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm border-2 border-slate-100">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-4 text-center">¿Cuánto paso/quito?</th>
            <th className="p-4 text-center">Resultado A</th>
            <th className="p-4 text-center">Queda en B</th>
            <th className="p-4 text-center">Queda en C</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map(row => (
              <motion.tr key={row.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-b border-slate-100">
                <td className={`p-4 text-center font-black text-xl ${row.tipo === 'sumar' ? 'bg-emerald-50/30 text-emerald-600' : 'bg-rose-50/30 text-rose-600'}`}>
                  {row.tipo === 'sumar' ? '+' : '-'}{row.paso}
                </td>
                <td className="p-4 text-center font-bold text-slate-700 text-xl">{row.a}</td>
                <td className={`p-4 text-center font-bold text-xl ${row.b === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{row.b}</td>
                <td className={`p-4 text-center font-bold text-xl ${row.c === 0 ? 'text-rose-500' : 'text-slate-400'}`}>{row.c}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {!isFinished && (
            <tr className="bg-slate-50">
              <td className="p-4 flex gap-2">
                <select 
                  value={tipoPaso} 
                  onChange={(e) => setTipoPaso(e.target.value as 'sumar' | 'restar')}
                  className="p-2 rounded-lg border-2 border-violet-200 font-bold outline-none"
                >
                  <option value="sumar">Sumar B</option>
                  <option value="restar">Restar C</option>
                </select>
                <input 
                  type="number" 
                  value={currentPaso} 
                  onChange={(e) => setCurrentPaso(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRow()}
                  placeholder="Cant."
                  className="w-20 p-2 rounded-lg border-2 border-violet-200 focus:border-violet-500 outline-none text-center font-bold"
                />
              </td>
              <td colSpan={3} className="p-4">
                <button onClick={handleAddRow} className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-all">
                  Realizar Operación
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
            <h4 className="text-xl font-black text-emerald-800">¡Sumirresta Terminada!</h4>
            <p className="text-emerald-600">El resultado final de A + B - C es {rows[rows.length - 1].a}.</p>
          </div>
        </motion.div>
      )}

      <TutorialABN 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
        title="Cómo hacer una Sumirresta"
        steps={[
          "Tienes tres números: A (el principal), B (para sumar) y C (para restar).",
          "Puedes elegir sumar una parte de B al número A.",
          "O puedes elegir restar una parte de C al número A.",
          "El objetivo es que B y C lleguen a 0.",
          "El número final en A será el resultado de la operación completa."
        ]}
        example="Para 100 + 50 - 30: Primero sumas 50 de B a A (tienes 150, B=0, C=30). Luego restas 30 de C a A (tienes 120, B=0, C=0). ¡Resultado 120!"
      />
    </div>
  );
}
