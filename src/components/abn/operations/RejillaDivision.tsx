/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Divide, Sparkles, RefreshCcw, HelpCircle, CheckCircle2, Table } from 'lucide-react';
import TutorialABN from './TutorialABN';

interface Row {
  id: string;
  reparto: number;
  cociente: number;
  quedatotal: number;
}

export default function RejillaDivision({ grade = 3 }: { grade?: number }) {
  const [dividendo, setDividendo] = useState(456);
  const [divisor, setDivisor] = useState(12);
  const [rows, setRows] = useState<Row[]>([]);
  const [currentReparto, setCurrentReparto] = useState<string>("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [showEscala, setShowEscala] = useState(true);

  const isFinished = rows.length > 0 && rows[rows.length - 1].quedatotal < divisor;

  const handleAddRow = () => {
    const val = parseInt(currentReparto);
    if (isNaN(val) || val <= 0) return;

    const lastQueda = rows.length > 0 ? rows[rows.length - 1].quedatotal : dividendo;
    
    if (val > lastQueda) {
      alert("No puedes repartir más de lo que queda.");
      return;
    }

    const cocienteParcial = Math.floor(val / divisor);
    const restoParcial = val % divisor;

    if (restoParcial !== 0) {
      alert("En ABN, el reparto de cada fila debe ser múltiplo del divisor para que el cociente sea exacto en ese paso.");
      return;
    }

    const newRow: Row = {
      id: Math.random().toString(36).substr(2, 9),
      reparto: val,
      cociente: cocienteParcial,
      quedatotal: lastQueda - val
    };

    setRows([...rows, newRow]);
    setCurrentReparto("");
  };

  const generateChallenge = () => {
    let d, v;
    if (grade <= 2) {
      d = Math.floor(Math.random() * 90) + 10;
      v = Math.floor(Math.random() * 4) + 2;
    } else if (grade === 3) {
      d = Math.floor(Math.random() * 900) + 100;
      v = Math.floor(Math.random() * 10) + 2;
    } else {
      d = Math.floor(Math.random() * 9000) + 1000;
      v = Math.floor(Math.random() * 25) + 5;
    }
    setDividendo(d);
    setDivisor(v);
    setRows([]);
  };

  // Lógica de Escala (Ayuda visual)
  const escala = [
    { label: '1x', val: divisor },
    { label: '10x', val: divisor * 10 },
    { label: '100x', val: divisor * 100 },
    { label: '2x', val: divisor * 2 },
    { label: '5x', val: divisor * 5 },
    { label: '50x', val: divisor * 50 },
  ].sort((a, b) => a.val - b.val);

  return (
    <div className="bg-pastel-emerald/60 p-8 rounded-3xl shadow-xl border-t-8 border-emerald-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Divide className="text-emerald-500" /> División ABN
          </h2>
          <p className="text-slate-500 font-medium">Reparte el total en grupos del divisor</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTutorial(true)} className="p-3 text-emerald-400 hover:bg-emerald-50 rounded-full transition-all">
            <HelpCircle size={24} />
          </button>
          <button onClick={() => setShowEscala(!showEscala)} className={`p-3 rounded-full transition-all ${showEscala ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400'}`}>
            <Table size={24} />
          </button>
          <button onClick={generateChallenge} className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg">
            <Sparkles size={18} /> Reto
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Escala de Ayuda */}
        {showEscala && (
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100">
              <h4 className="text-xs font-black text-emerald-700 uppercase mb-4 tracking-widest">Escala de Apoyo</h4>
              <div className="space-y-2">
                {escala.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm border border-emerald-100">
                    <span className="text-xs font-bold text-slate-400">{item.label}</span>
                    <span className="font-black text-emerald-600">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rejilla */}
        <div className={showEscala ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <div className="bg-slate-50 p-6 rounded-2xl mb-6 flex justify-around items-center border-2 border-slate-100">
            <div className="text-center">
              <label className="text-xs font-bold text-slate-400 uppercase">Dividendo</label>
              <div className="text-4xl font-black text-slate-800">{dividendo}</div>
            </div>
            <div className="text-5xl font-thin text-slate-200">/</div>
            <div className="text-center">
              <label className="text-xs font-bold text-slate-400 uppercase">Divisor</label>
              <div className="text-4xl font-black text-emerald-600">{divisor}</div>
            </div>
          </div>

          <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm border-2 border-slate-100">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-4 text-center">¿Cuánto reparto?</th>
                <th className="p-4 text-center">Cociente Parcial</th>
                <th className="p-4 text-center">Queda por repartir</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="p-4 text-center font-black text-emerald-600 text-xl bg-emerald-50/30">{row.reparto}</td>
                  <td className="p-4 text-center font-bold text-slate-700 text-xl">{row.cociente}</td>
                  <td className="p-4 text-center font-bold text-slate-400 text-xl">{row.quedatotal}</td>
                </tr>
              ))}
              {!isFinished && (
                <tr className="bg-emerald-50/20">
                  <td className="p-4">
                    <input 
                      type="number" 
                      value={currentReparto} 
                      onChange={(e) => setCurrentReparto(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddRow()}
                      placeholder="Ej: 120"
                      className="w-full p-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 outline-none text-center font-bold"
                    />
                  </td>
                  <td colSpan={2} className="p-4">
                    <button onClick={handleAddRow} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all">
                      Repartir
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {isFinished && (
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-2xl flex items-center gap-4">
                <CheckCircle2 className="text-emerald-500" size={32} />
                <div>
                  <h4 className="text-xl font-black text-emerald-800">Cociente: {rows.reduce((acc, r) => acc + r.cociente, 0)}</h4>
                  <p className="text-emerald-600 font-medium">Reparto completado con éxito.</p>
                </div>
              </div>
              <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl flex items-center gap-4">
                <div className="text-2xl font-black text-amber-700">Resto: {rows[rows.length - 1].quedatotal}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <TutorialABN 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
        title="Cómo Dividir en ABN"
        steps={[
          "Usa la 'Escala de Apoyo' para ver cuánto puedes repartir de una vez (ej. 10 veces el divisor, 100 veces...).",
          "En la primera columna, escribe la cantidad total que vas a repartir en este paso.",
          "En la segunda columna, anota cuántas veces cabe el divisor en esa cantidad.",
          "En la tercera columna, resta lo repartido al total que tenías.",
          "Sigue hasta que lo que quede sea más pequeño que el divisor."
        ]}
        example="Para dividir 456 entre 12, puedes repartir primero 360 (que son 30 veces 12). Te quedarían 96. Luego repartes 96 (que son 8 veces 12). Sumas 30 + 8 = 38. ¡Listo!"
      />
    </div>
  );
}
