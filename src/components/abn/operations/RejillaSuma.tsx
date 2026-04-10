/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, CheckCircle2, RefreshCcw, Sparkles, HelpCircle } from 'lucide-react';
import TutorialABN from './TutorialABN';

interface Row {
  id: string;
  paso: number;
  acumulado: number;
  restante: number;
}

export default function RejillaSuma({ grade = 2 }: { grade?: number }) {
  const [num1, setNum1] = useState(145);
  const [num2, setNum2] = useState(78);
  const [rows, setRows] = useState<Row[]>([]);
  const [currentPaso, setCurrentPaso] = useState<string>("");
  const [showTutorial, setShowTutorial] = useState(false);

  const isFinished = rows.length > 0 && rows[rows.length - 1].restante === 0;

  const handleAddRow = () => {
    const val = parseInt(currentPaso);
    if (isNaN(val) || val <= 0) return;

    const lastRestante = rows.length > 0 ? rows[rows.length - 1].restante : num2;
    const lastAcumulado = rows.length > 0 ? rows[rows.length - 1].acumulado : num1;

    if (val > lastRestante) {
      alert("No puedes pasar más de lo que queda.");
      return;
    }

    const newRow: Row = {
      id: Math.random().toString(36).substr(2, 9),
      paso: val,
      acumulado: lastAcumulado + val,
      restante: lastRestante - val
    };

    setRows([...rows, newRow]);
    setCurrentPaso("");
  };

  const generateChallenge = () => {
    let n1, n2;
    if (grade === 1) {
      n1 = Math.floor(Math.random() * 60) + 20;
      n2 = Math.floor(Math.random() * 20) + 5;
    } else if (grade === 2) {
      n1 = Math.floor(Math.random() * 800) + 100;
      n2 = Math.floor(Math.random() * 200) + 50;
    } else {
      n1 = Math.floor(Math.random() * 8000) + 1000;
      n2 = Math.floor(Math.random() * 2000) + 500;
    }
    setNum1(n1);
    setNum2(n2);
    setRows([]);
  };

  return (
    <div className="bg-pastel-indigo/60 p-4 md:p-8 rounded-3xl shadow-xl border-t-8 border-indigo-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <Plus className="text-indigo-500" /> Suma ABN
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">Pasa cantidades de un número a otro libremente</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button onClick={() => setShowTutorial(true)} className="p-3 text-indigo-400 hover:bg-indigo-50 rounded-full transition-all">
            <HelpCircle size={24} />
          </button>
          <button onClick={generateChallenge} className="bg-indigo-500 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-600 transition-all shadow-lg">
            <Sparkles size={18} /> Reto
          </button>
          <button onClick={() => setRows([])} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <RefreshCcw size={24} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 bg-indigo-50 p-4 md:p-6 rounded-2xl border-2 border-indigo-100">
        <div className="text-center">
          <label className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase">Número A (Recibe)</label>
          <div className="text-2xl md:text-4xl font-black text-indigo-700">{num1}</div>
        </div>
        <div className="text-center">
          <label className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase">Número B (Da)</label>
          <div className="text-2xl md:text-4xl font-black text-indigo-700">{num2}</div>
        </div>
      </div>

      <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm border-2 border-slate-100">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-4 text-center">¿Cuánto paso?</th>
            <th className="p-4 text-center">Acumulado en A</th>
            <th className="p-4 text-center">Queda en B</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map(row => (
              <motion.tr key={row.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="border-b border-slate-100">
                <td className="p-4 text-center font-black text-indigo-600 text-xl bg-indigo-50/30">{row.paso}</td>
                <td className="p-4 text-center font-bold text-slate-700 text-xl">{row.acumulado}</td>
                <td className={`p-4 text-center font-bold text-xl ${row.restante === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{row.restante}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {!isFinished && (
            <tr className="bg-slate-50">
              <td className="p-4">
                <input 
                  type="number" 
                  value={currentPaso} 
                  onChange={(e) => setCurrentPaso(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRow()}
                  placeholder="Ej: 40"
                  className="w-full p-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 outline-none text-center font-bold"
                />
              </td>
              <td colSpan={2} className="p-4">
                <button onClick={handleAddRow} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                  Añadir Paso
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
            <h4 className="text-xl font-black text-emerald-800">¡Suma Terminada!</h4>
            <p className="text-emerald-600">El resultado final es {rows[rows.length - 1].acumulado}.</p>
          </div>
        </motion.div>
      )}

      <TutorialABN 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
        title="Cómo Sumar en ABN"
        steps={[
          "Elige cuánto quieres pasar del número B al número A.",
          "Puedes pasar cantidades fáciles (como decenas completas) o lo que tú prefieras.",
          "Suma esa cantidad al acumulado de A y réstala de lo que queda en B.",
          "Repite el proceso hasta que en B no quede nada (llegue a 0)."
        ]}
        example="Si sumas 145 + 78, puedes pasar primero 70 (tendrías 215 y quedarían 8). Luego pasas los 8 y llegas a 223. ¡Tú decides los pasos!"
      />
    </div>
  );
}
