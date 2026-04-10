/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Triangle, RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';

interface Props {
  targetNumber?: number;
}

export default function PiramideCalculo({ targetNumber: propTarget }: Props) {
  // Pirámide de 3 niveles (6 bloques)
  // [0]
  // [1][2]
  // [3][4][5]
  const [blocks, setBlocks] = useState<(number | null)[]>(Array(6).fill(null));
  const [userInputs, setUserInputs] = useState<string[]>(Array(6).fill(''));
  const [fixedIndices, setFixedIndices] = useState<number[]>([]);

  const generateChallenge = () => {
    let b0 = propTarget;
    let b1, b2, b3, b4, b5;

    if (b0 !== undefined && b0 > 0) {
      // Intentar descomponer b0 en una pirámide válida
      // b0 = b1 + b2
      // b1 = b3 + b4
      // b2 = b4 + b5
      // b0 = b3 + 2*b4 + b5
      b4 = Math.floor(Math.random() * (b0 / 2));
      const remaining = b0 - 2 * b4;
      b3 = Math.floor(Math.random() * remaining);
      b5 = remaining - b3;
      
      b1 = b3 + b4;
      b2 = b4 + b5;
    } else {
      b3 = Math.floor(Math.random() * 10) + 1;
      b4 = Math.floor(Math.random() * 10) + 1;
      b5 = Math.floor(Math.random() * 10) + 1;
      b1 = b3 + b4;
      b2 = b4 + b5;
      b0 = b1 + b2;
    }

    const fullPyramid = [b0, b1, b2, b3, b4, b5];
    
    // Elegir 3 índices para mostrar y 3 para ocultar
    const indices = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
    const fixed = indices.slice(0, 3);
    
    setBlocks(fullPyramid);
    setFixedIndices(fixed);
    setUserInputs(fullPyramid.map((val, i) => fixed.includes(i) ? val.toString() : ''));
  };

  useEffect(() => {
    generateChallenge();
  }, [propTarget]);

  const handleInput = (index: number, val: string) => {
    if (fixedIndices.includes(index)) return;
    const newInputs = [...userInputs];
    newInputs[index] = val;
    setUserInputs(newInputs);
  };

  const isCorrect = (index: number) => {
    if (userInputs[index] === '') return 'neutral';
    return parseInt(userInputs[index]) === blocks[index] ? 'correct' : 'incorrect';
  };

  const allSolved = userInputs.every((val, i) => parseInt(val) === blocks[i]);

  return (
    <div className="max-w-2xl mx-auto p-10 bg-pastel-blue/60 rounded-[3rem] border-4 border-pastel-blue-dark shadow-inner">
      <header className="text-center mb-12">
        <h2 className="text-4xl font-black text-indigo-800 flex items-center justify-center gap-4">
          <Triangle size={40} className="fill-indigo-100 text-indigo-600" />
          Pirámide de Cálculo
        </h2>
        <p className="text-indigo-900 font-black text-xl mt-3">Cada bloque es la suma de los dos que tiene debajo.</p>
        <button 
          onClick={generateChallenge}
          className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center gap-3 mx-auto shadow-xl active:scale-95"
          aria-label="Generar un nuevo reto de pirámide"
        >
          <RotateCcw size={22} /> ¡Nueva Pirámide!
        </button>
      </header>

      <div className="flex flex-col items-center gap-4">
        {/* Nivel 1 */}
        <div className="flex justify-center">
          <Block index={0} value={userInputs[0]} isFixed={fixedIndices.includes(0)} status={isCorrect(0)} onInput={handleInput} />
        </div>
        {/* Nivel 2 */}
        <div className="flex justify-center gap-4">
          <Block index={1} value={userInputs[1]} isFixed={fixedIndices.includes(1)} status={isCorrect(1)} onInput={handleInput} />
          <Block index={2} value={userInputs[2]} isFixed={fixedIndices.includes(2)} status={isCorrect(2)} onInput={handleInput} />
        </div>
        {/* Nivel 3 */}
        <div className="flex justify-center gap-4">
          <Block index={3} value={userInputs[3]} isFixed={fixedIndices.includes(3)} status={isCorrect(3)} onInput={handleInput} />
          <Block index={4} value={userInputs[4]} isFixed={fixedIndices.includes(4)} status={isCorrect(4)} onInput={handleInput} />
          <Block index={5} value={userInputs[5]} isFixed={fixedIndices.includes(5)} status={isCorrect(5)} onInput={handleInput} />
        </div>
      </div>

      {allSolved && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-16 bg-pastel-emerald border-4 border-emerald-400 p-8 rounded-[2.5rem] text-center shadow-xl"
        >
          <Trophy className="mx-auto text-emerald-600 mb-4" size={64} />
          <h3 className="text-3xl font-black text-emerald-900">¡Pirámide Completada!</h3>
          <p className="text-emerald-800 font-bold text-lg">Has dominado la lógica de la suma.</p>
        </motion.div>
      )}
    </div>
  );
}

function Block({ index, value, isFixed, status, onInput }: any) {
  return (
    <div className={`
      w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 flex items-center justify-center transition-all shadow-lg
      ${isFixed ? 'bg-indigo-700 border-indigo-900 text-white' : 
        status === 'correct' ? 'bg-pastel-emerald border-emerald-400 text-emerald-900' :
        status === 'incorrect' ? 'bg-pastel-rose border-rose-400 text-rose-900' :
        'bg-white border-pastel-slate-dark text-slate-800 focus-within:border-indigo-400 focus-within:ring-8 focus-within:ring-indigo-100'}
    `}>
      {isFixed ? (
        <span className="text-4xl font-black">{value}</span>
      ) : (
        <input 
          type="number"
          value={value}
          onChange={(e) => onInput(index, e.target.value)}
          aria-label={`Bloque número ${index + 1} de la pirámide`}
          className="w-full h-full bg-transparent text-center text-4xl font-black outline-none"
          placeholder="?"
        />
      )}
    </div>
  );
}
