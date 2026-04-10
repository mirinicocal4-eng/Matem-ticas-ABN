/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, CheckCircle2, RefreshCcw, Sparkles, HelpCircle, ArrowUpRight } from 'lucide-react';
import TutorialABN from './TutorialABN';

interface Row {
  id: string;
  paso: number;
  acumulado: number;
}

export default function RejillaEscalera({ grade = 2 }: { grade?: number }) {
  const [mode, setMode] = useState<'asc' | 'desc'>('asc');
  const [startNum, setStartNum] = useState(45);
  const [targetNum, setTargetNum] = useState(123);
  const [rows, setRows] = useState<Row[]>([]);
  const [currentPaso, setCurrentPaso] = useState<string>("");
  const [showTutorial, setShowTutorial] = useState(false);

  const currentTotal = rows.length > 0 ? rows[rows.length - 1].acumulado : (mode === 'asc' ? startNum : targetNum);
  const isFinished = mode === 'asc' ? currentTotal === targetNum : currentTotal === startNum;

  const handleAddRow = () => {
    const val = parseInt(currentPaso);
    if (isNaN(val) || val <= 0) return;

    if (mode === 'asc') {
      if (currentTotal + val > targetNum) {
        alert("Te has pasado del número objetivo.");
        return;
      }
    } else {
      if (currentTotal - val < startNum) {
        alert("Te has pasado del número objetivo.");
        return;
      }
    }

    const newRow: Row = {
      id: Math.random().toString(36).substr(2, 9),
      paso: val,
      acumulado: mode === 'asc' ? currentTotal + val : currentTotal - val
    };

    setRows([...rows, newRow]);
    setCurrentPaso("");
  };

  const generateChallenge = () => {
    let s, t;
    if (grade <= 2) {
      s = Math.floor(Math.random() * 50) + 10;
      t = s + Math.floor(Math.random() * 80) + 20;
    } else {
      s = Math.floor(Math.random() * 500) + 100;
      t = s + Math.floor(Math.random() * 400) + 100;
    }
    setStartNum(s);
    setTargetNum(t);
    setRows([]);
  };

  const totalAdded = rows.reduce((acc, r) => acc + r.paso, 0);

  return (
    <div className="bg-pastel-emerald/60 p-8 rounded-3xl shadow-xl border-t-8 border-teal-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <ArrowUpRight className={`text-teal-500 transition-transform ${mode === 'desc' ? 'rotate-180' : ''}`} /> 
            Resta en Escalera {mode === 'asc' ? 'Ascendente' : 'Descendente'}
          </h2>
          <p className="text-slate-500 font-medium">
            {mode === 'asc' 
              ? 'Sube desde el número pequeño hasta el grande' 
              : 'Baja desde el número grande hasta el pequeño'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
            <button 
              onClick={() => { setMode('asc'); setRows([]); }}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${mode === 'asc' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
            >
              Ascendente
            </button>
            <button 
              onClick={() => { setMode('desc'); setRows([]); }}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${mode === 'desc' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
            >
              Descendente
            </button>
          </div>
          
          <button onClick={() => setShowTutorial(true)} className="p-3 text-teal-400 hover:bg-teal-50 rounded-full transition-all">
            <HelpCircle size={24} />
          </button>
          <button onClick={generateChallenge} className="bg-teal-500 text-white px-6 py-2 rounded-full font-bold hover:bg-teal-600 transition-all shadow-lg">
            <Sparkles size={18} /> Reto
          </button>
          <button onClick={() => setRows([])} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <RefreshCcw size={24} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-8 bg-teal-50 p-6 rounded-2xl border-2 border-teal-100">
        <div className="text-center">
          <label className="text-xs font-bold text-teal-400 uppercase">
            {mode === 'asc' ? 'Empiezo en' : 'Empiezo en (Grande)'}
          </label>
          <div className="text-4xl font-black text-teal-700">
            {mode === 'asc' ? startNum : targetNum}
          </div>
        </div>
        <div className="text-center">
          <label className="text-xs font-bold text-teal-400 uppercase">
            {mode === 'asc' ? 'Quiero llegar a' : 'Quiero llegar a (Pequeño)'}
          </label>
          <div className="text-4xl font-black text-teal-700">
            {mode === 'asc' ? targetNum : startNum}
          </div>
        </div>
      </div>

      <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm border-2 border-slate-100">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-4 text-center">
              {mode === 'asc' ? '¿Cuánto subo?' : '¿Cuánto bajo?'}
            </th>
            <th className="p-4 text-center">Llego al número...</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map(row => (
              <motion.tr key={row.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="border-b border-slate-100">
                <td className="p-4 text-center font-black text-teal-600 text-xl bg-teal-50/30">
                  {mode === 'asc' ? `+${row.paso}` : `-${row.paso}`}
                </td>
                <td className="p-4 text-center font-bold text-slate-700 text-xl">{row.acumulado}</td>
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
                  placeholder="Ej: 5"
                  className="w-full p-3 rounded-xl border-2 border-teal-200 focus:border-teal-500 outline-none text-center font-bold"
                />
              </td>
              <td className="p-4">
                <button onClick={handleAddRow} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all">
                  {mode === 'asc' ? 'Subir Escalón' : 'Bajar Escalón'}
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
            <h4 className="text-xl font-black text-emerald-800">¡Escalera Completada!</h4>
            <p className="text-emerald-600 font-medium">La diferencia total es {totalAdded}.</p>
          </div>
        </motion.div>
      )}

      <TutorialABN 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
        title={`Cómo hacer la Resta en Escalera ${mode === 'asc' ? 'Ascendente' : 'Descendente'}`}
        steps={mode === 'asc' ? [
          "Esta resta consiste en ver cuánto le falta al número pequeño para ser igual al grande.",
          "Empieza en el número pequeño y ve añadiendo cantidades fáciles.",
          "Primero llega a la decena más cercana, luego suma decenas completas, etc.",
          "Cuando llegues al número objetivo, suma todos los pasos que has dado.",
          "Esa suma total es el resultado de la resta."
        ] : [
          "Esta resta consiste en quitarle al número grande hasta llegar al pequeño.",
          "Empieza en el número grande y ve restando cantidades fáciles.",
          "Primero baja hasta la decena anterior, luego quita decenas completas, etc.",
          "Cuando llegues al número pequeño, suma todos los pasos (lo que has quitado).",
          "Esa suma total es el resultado de la resta."
        ]}
        example={mode === 'asc' 
          ? "Para 123 - 45: De 45 subes 5 (llegas a 50). De 50 subes 50 (llegas a 100). De 100 subes 23 (llegas a 123). Sumas 5 + 50 + 23 = 78."
          : "Para 123 - 45: De 123 bajas 3 (llegas a 120). De 120 bajas 20 (llegas a 100). De 100 bajas 50 (llegas a 50). De 50 bajas 5 (llegas a 45). Sumas 3 + 20 + 50 + 5 = 78."}
      />
    </div>
  );
}
