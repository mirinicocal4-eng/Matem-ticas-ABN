/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, CheckCircle2, RefreshCcw, Sparkles, HelpCircle } from 'lucide-react';
import TutorialABN from './TutorialABN';

interface Row {
  id: string;
  pasoB: number;
  pasoC: number;
  a: number;
  b: number;
  c: number;
}

export default function RejillaDobleSuma({ grade = 2 }: { grade?: number }) {
  const [numA, setNumA] = useState(120);
  const [numB, setNumB] = useState(45);
  const [numC, setNumC] = useState(38);
  const [rows, setRows] = useState<Row[]>([]);
  const [currentPasoB, setCurrentPasoB] = useState<string>("");
  const [currentPasoC, setCurrentPasoC] = useState<string>("");
  const [showTutorial, setShowTutorial] = useState(false);

  const isFinished = rows.length > 0 && rows[rows.length - 1].b === 0 && rows[rows.length - 1].c === 0;

  const handleAddRow = () => {
    const valB = parseInt(currentPasoB) || 0;
    const valC = parseInt(currentPasoC) || 0;
    
    if (valB < 0 || valC < 0) return;
    if (valB === 0 && valC === 0) return;

    const lastA = rows.length > 0 ? rows[rows.length - 1].a : numA;
    const lastB = rows.length > 0 ? rows[rows.length - 1].b : numB;
    const lastC = rows.length > 0 ? rows[rows.length - 1].c : numC;

    if (valB > lastB || valC > lastC) {
      alert("No puedes pasar más de lo que queda en B o C.");
      return;
    }

    const newRow: Row = {
      id: Math.random().toString(36).substr(2, 9),
      pasoB: valB,
      pasoC: valC,
      a: lastA + valB + valC,
      b: lastB - valB,
      c: lastC - valC
    };

    setRows([...rows, newRow]);
    setCurrentPasoB("");
    setCurrentPasoC("");
  };

  const generateChallenge = () => {
    let a, b, c;
    if (grade <= 2) {
      a = Math.floor(Math.random() * 100) + 50;
      b = Math.floor(Math.random() * 40) + 10;
      c = Math.floor(Math.random() * 30) + 10;
    } else {
      a = Math.floor(Math.random() * 800) + 200;
      b = Math.floor(Math.random() * 200) + 50;
      c = Math.floor(Math.random() * 150) + 50;
    }
    setNumA(a);
    setNumB(b);
    setNumC(c);
    setRows([]);
  };

  return (
    <div className="bg-pastel-blue/60 p-8 rounded-3xl shadow-xl border-t-8 border-cyan-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <PlusCircle className="text-cyan-500" /> Doble Suma ABN
          </h2>
          <p className="text-slate-500 font-medium">Suma tres cantidades simultáneamente</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTutorial(true)} className="p-3 text-cyan-400 hover:bg-cyan-50 rounded-full transition-all">
            <HelpCircle size={24} />
          </button>
          <button onClick={generateChallenge} className="bg-cyan-500 text-white px-6 py-2 rounded-full font-bold hover:bg-cyan-600 transition-all shadow-lg">
            <Sparkles size={18} /> Reto
          </button>
          <button onClick={() => setRows([])} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <RefreshCcw size={24} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8 bg-cyan-50 p-6 rounded-2xl border-2 border-cyan-100">
        <div className="text-center">
          <label className="text-xs font-bold text-cyan-400 uppercase">A (Principal)</label>
          <div className="text-3xl font-black text-cyan-700">{numA}</div>
        </div>
        <div className="text-center">
          <label className="text-xs font-bold text-cyan-400 uppercase">B (Sumando 2)</label>
          <div className="text-3xl font-black text-cyan-700">{numB}</div>
        </div>
        <div className="text-center">
          <label className="text-xs font-bold text-cyan-400 uppercase">C (Sumando 3)</label>
          <div className="text-3xl font-black text-cyan-700">{numC}</div>
        </div>
      </div>

      <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm border-2 border-slate-100">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-4 text-center">Paso de B</th>
            <th className="p-4 text-center">Paso de C</th>
            <th className="p-4 text-center">Acumulado en A</th>
            <th className="p-4 text-center">Queda en B</th>
            <th className="p-4 text-center">Queda en C</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map(row => (
              <motion.tr key={row.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-b border-slate-100">
                <td className="p-4 text-center font-black text-cyan-600 text-xl bg-cyan-50/20">{row.pasoB}</td>
                <td className="p-4 text-center font-black text-cyan-600 text-xl bg-cyan-50/20">{row.pasoC}</td>
                <td className="p-4 text-center font-bold text-slate-700 text-xl">{row.a}</td>
                <td className={`p-4 text-center font-bold text-xl ${row.b === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{row.b}</td>
                <td className={`p-4 text-center font-bold text-xl ${row.c === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{row.c}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {!isFinished && (
            <tr className="bg-slate-50">
              <td className="p-4">
                <input 
                  type="number" 
                  value={currentPasoB} 
                  onChange={(e) => setCurrentPasoB(e.target.value)}
                  placeholder="De B"
                  className="w-full p-2 rounded-lg border-2 border-cyan-200 outline-none text-center font-bold"
                />
              </td>
              <td className="p-4">
                <input 
                  type="number" 
                  value={currentPasoC} 
                  onChange={(e) => setCurrentPasoC(e.target.value)}
                  placeholder="De C"
                  className="w-full p-2 rounded-lg border-2 border-cyan-200 outline-none text-center font-bold"
                />
              </td>
              <td colSpan={3} className="p-4">
                <button onClick={handleAddRow} className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold hover:bg-cyan-700 transition-all">
                  Sumar Cantidades
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
            <h4 className="text-xl font-black text-emerald-800">¡Doble Suma Terminada!</h4>
            <p className="text-emerald-600">El resultado final es {rows[rows.length - 1].a}.</p>
          </div>
        </motion.div>
      )}

      <TutorialABN 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
        title="Cómo hacer una Doble Suma"
        steps={[
          "Tienes un número principal (A) y dos números que quieres sumarle (B y C).",
          "En cada paso, puedes elegir cuánto pasar de B y cuánto pasar de C al número A.",
          "Suma ambos pasos al acumulado de A y réstalos de sus respectivos números.",
          "El objetivo es que tanto B como C lleguen a 0.",
          "El resultado final estará en la columna A."
        ]}
        example="Para 120 + 45 + 38: Pasas 40 de B y 30 de C (tienes 190, B=5, C=8). Luego pasas 5 de B y 8 de C (tienes 203, B=0, C=0). ¡Resultado 203!"
      />
    </div>
  );
}
