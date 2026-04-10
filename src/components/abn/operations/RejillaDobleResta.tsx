/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Calculator, AlertCircle, CheckCircle2, RefreshCcw, Sparkles } from 'lucide-react';

interface Row {
  id: string;
  quitar: number;
  quedaSustraendo1: number;
  quedaSustraendo2: number;
  quedatotal: number;
}

export default function RejillaDobleResta({ grade = 2 }: { grade?: number }) {
  const [total, setTotal] = useState(150);
  const [sustraendo1, setSustraendo1] = useState(45);
  const [sustraendo2, setSustraendo2] = useState(30);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  
  const [rows, setRows] = useState<Row[]>([]);
  const [currentQuitar, setCurrentQuitar] = useState<string>("");

  const isFinished = rows.length > 0 && 
                   rows[rows.length - 1].quedaSustraendo1 === 0 && 
                   rows[rows.length - 1].quedaSustraendo2 === 0;

  const generateChallenge = () => {
    let t, s1, s2;
    if (grade <= 2) {
      t = Math.floor(Math.random() * 200) + 100;
      s1 = Math.floor(Math.random() * 40) + 10;
      s2 = Math.floor(Math.random() * 30) + 10;
    } else {
      t = Math.floor(Math.random() * 1000) + 500;
      s1 = Math.floor(Math.random() * 200) + 50;
      s2 = Math.floor(Math.random() * 150) + 50;
    }
    setTotal(t);
    setSustraendo1(s1);
    setSustraendo2(s2);
    setRows([]);
    setIsChallengeMode(true);
  };

  const handleAddRow = () => {
    const val = parseInt(currentQuitar);
    if (isNaN(val) || val <= 0) return;

    const lastRow = rows.length > 0 ? rows[rows.length - 1] : {
      quedaSustraendo1: sustraendo1,
      quedaSustraendo2: sustraendo2,
      quedatotal: total
    };

    // Validación ABN: No podemos quitar más de lo que queda en los sustraendos combinados
    // Pero en la doble resta, el alumno decide de dónde quita. 
    // Simplificamos: el valor 'quitar' se resta de lo que el alumno elija o proporcionalmente.
    // En una app real, el alumno indicaría cuánto quita de cada uno. 
    // Aquí implementaremos la lógica donde el sistema resta del primero hasta agotarlo y luego del segundo.
    
    let restoAQuitar = val;
    let nuevoS1 = lastRow.quedaSustraendo1;
    let nuevoS2 = lastRow.quedaSustraendo2;

    // Lógica de detracción automática para el ejemplo (en ABN manual el niño lo anota)
    const deS1 = Math.min(restoAQuitar, nuevoS1);
    nuevoS1 -= deS1;
    restoAQuitar -= deS1;

    const deS2 = Math.min(restoAQuitar, nuevoS2);
    nuevoS2 -= deS2;
    restoAQuitar -= deS2;

    if (restoAQuitar > 0) {
      alert("¡Cuidado! Estás intentando quitar más de lo que suman los dos sustraendos.");
      return;
    }

    const newRow: Row = {
      id: Math.random().toString(36).substr(2, 9),
      quitar: val,
      quedaSustraendo1: nuevoS1,
      quedaSustraendo2: nuevoS2,
      quedatotal: lastRow.quedatotal - val
    };

    setRows([...rows, newRow]);
    setCurrentQuitar("");
  };

  const reset = () => {
    setRows([]);
    setCurrentQuitar("");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-pastel-amber/60 rounded-3xl shadow-2xl border-t-8 border-orange-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Calculator className="text-orange-500" />
            Rejilla de Doble Resta
          </h2>
          <p className="text-slate-500 font-medium">Resta dos cantidades al mismo tiempo</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={generateChallenge}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
          >
            <Sparkles size={18} />
            ¡Nuevo Reto!
          </button>
          <button 
            onClick={reset}
            className="p-3 hover:bg-orange-50 text-orange-600 rounded-full transition-all"
            title="Reiniciar"
          >
            <RefreshCcw size={24} />
          </button>
        </div>
      </header>

      {/* Configuración Inicial */}
      <div className="grid grid-cols-3 gap-6 mb-10 bg-orange-50 p-6 rounded-2xl border-2 border-orange-100">
        <div className="space-y-2">
          <label className="text-xs font-bold text-orange-400 uppercase">Total Inicial</label>
          <input 
            type="number" 
            value={total} 
            onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
            disabled={rows.length > 0}
            className="w-full text-3xl font-black p-3 rounded-xl border-2 border-white focus:border-orange-300 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-orange-400 uppercase">Sustraendo 1</label>
          <input 
            type="number" 
            value={sustraendo1} 
            onChange={(e) => setSustraendo1(parseInt(e.target.value) || 0)}
            disabled={rows.length > 0}
            className="w-full text-3xl font-black p-3 rounded-xl border-2 border-white focus:border-orange-300 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-orange-400 uppercase">Sustraendo 2</label>
          <input 
            type="number" 
            value={sustraendo2} 
            onChange={(e) => setSustraendo2(parseInt(e.target.value) || 0)}
            disabled={rows.length > 0}
            className="w-full text-3xl font-black p-3 rounded-xl border-2 border-white focus:border-orange-300 outline-none transition-all"
          />
        </div>
      </div>

      {/* Tabla ABN */}
      <div className="overflow-hidden rounded-2xl border-2 border-slate-100 shadow-sm mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="p-4 font-bold uppercase text-xs tracking-widest border-r border-slate-700">Quito</th>
              <th className="p-4 font-bold uppercase text-xs tracking-widest border-r border-slate-700">Queda S1</th>
              <th className="p-4 font-bold uppercase text-xs tracking-widest border-r border-slate-700">Queda S2</th>
              <th className="p-4 font-bold uppercase text-xs tracking-widest">Queda Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila de inicio */}
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <td className="p-4 text-slate-300 font-mono italic">-</td>
              <td className="p-4 font-black text-slate-400">{sustraendo1}</td>
              <td className="p-4 font-black text-slate-400">{sustraendo2}</td>
              <td className="p-4 font-black text-slate-600 text-xl">{total}</td>
            </tr>
            
            {/* Filas dinámicas */}
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.tr 
                  key={row.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-black text-orange-600 text-xl bg-orange-50/30 border-r border-slate-100">{row.quitar}</td>
                  <td className={`p-4 font-bold border-r border-slate-100 ${row.quedaSustraendo1 === 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {row.quedaSustraendo1}
                  </td>
                  <td className={`p-4 font-bold border-r border-slate-100 ${row.quedaSustraendo2 === 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {row.quedaSustraendo2}
                  </td>
                  <td className="p-4 font-black text-slate-800 text-2xl">{row.quedatotal}</td>
                </motion.tr>
              ))}
            </AnimatePresence>

            {/* Fila de entrada (si no ha terminado) */}
            {!isFinished && (
              <tr className="bg-indigo-50/30">
                <td className="p-4">
                  <input 
                    type="number"
                    placeholder="¿Cuánto quitas?"
                    value={currentQuitar}
                    onChange={(e) => setCurrentQuitar(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRow()}
                    className="w-full p-2 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 outline-none font-bold"
                  />
                </td>
                <td colSpan={2} className="p-4">
                  <button 
                    onClick={handleAddRow}
                    className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
                  >
                    <Plus size={20} /> Añadir Paso
                  </button>
                </td>
                <td className="p-4"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mensaje de éxito */}
      {isFinished && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-2xl flex items-center gap-4"
        >
          <div className="bg-emerald-500 p-3 rounded-full text-white">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black text-emerald-800">¡Operación Completada!</h4>
            <p className="text-emerald-600 font-medium">Has restado correctamente ambas cantidades. El resultado final es {rows[rows.length - 1].quedatotal}.</p>
          </div>
        </motion.div>
      )}

      {/* Tips Didácticos */}
      <div className="mt-8 flex gap-4">
        <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-3">
          <AlertCircle className="text-orange-400 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Consejo ABN:</strong> No hay una forma única de resolverlo. Puedes quitar primero las decenas de un número, luego las del otro, o combinarlas. ¡Tú eliges el camino!
          </p>
        </div>
      </div>
    </div>
  );
}
