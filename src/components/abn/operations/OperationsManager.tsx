/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, X, Divide, BookOpen, Layers, ArrowRightLeft, MinusCircle, PlusCircle, ArrowUpRight, Scale, GraduationCap } from 'lucide-react';
import RejillaSuma from './RejillaSuma';
import RejillaResta from './RejillaResta';
import RejillaDobleResta from './RejillaDobleResta';
import RejillaSumirresta from './RejillaSumirresta';
import RejillaDivision from './RejillaDivision';
import RejillaMultiplicacion from './RejillaMultiplicacion';
import RejillaDobleSuma from './RejillaDobleSuma';
import RejillaEscalera from './RejillaEscalera';
import RejillaComparacion from './RejillaComparacion';

type OpType = 'suma' | 'resta' | 'doble-resta' | 'sumirresta' | 'multi' | 'divi' | 'doble-suma' | 'escalera' | 'comparacion';
type Grade = 1 | 2 | 3 | 4;

export default function OperationsManager() {
  const [activeOp, setActiveOp] = useState<OpType>('suma');
  const [grade, setGrade] = useState<Grade>(2);

  const operationsByGrade: Record<Grade, OpType[]> = {
    1: ['suma', 'resta'],
    2: ['suma', 'resta', 'doble-suma', 'doble-resta', 'escalera', 'comparacion', 'sumirresta'],
    3: ['suma', 'resta', 'doble-suma', 'doble-resta', 'escalera', 'comparacion', 'sumirresta', 'multi', 'divi'],
    4: ['suma', 'resta', 'doble-suma', 'doble-resta', 'escalera', 'comparacion', 'sumirresta', 'multi', 'divi'],
  };

  const isOpAvailable = (op: OpType) => operationsByGrade[grade].includes(op);

  // Ensure activeOp is available when grade changes
  React.useEffect(() => {
    if (!isOpAvailable(activeOp)) {
      setActiveOp(operationsByGrade[grade][0]);
    }
  }, [grade]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Selector de Curso */}
      <div className="flex justify-center mb-8">
        <div className="bg-pastel-slate p-2 rounded-2xl shadow-md border border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {[1, 2, 3, 4].map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g as Grade)}
              className={`px-6 py-2 rounded-xl font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                grade === g 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <GraduationCap size={18} />
              {g === 4 ? '4º-6º' : `${g}º`} Curso
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Operación */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
        {isOpAvailable('suma') && (
          <OpButton 
            active={activeOp === 'suma'} 
            onClick={() => setActiveOp('suma')} 
            icon={<Plus />} 
            label="Suma" 
            color="indigo" 
          />
        )}
        {isOpAvailable('doble-suma') && (
          <OpButton 
            active={activeOp === 'doble-suma'} 
            onClick={() => setActiveOp('doble-suma')} 
            icon={<PlusCircle />} 
            label="Doble Suma" 
            color="cyan" 
          />
        )}
        {isOpAvailable('resta') && (
          <OpButton 
            active={activeOp === 'resta'} 
            onClick={() => setActiveOp('resta')} 
            icon={<Minus />} 
            label="Resta" 
            color="rose" 
          />
        )}
        {isOpAvailable('doble-resta') && (
          <OpButton 
            active={activeOp === 'doble-resta'} 
            onClick={() => setActiveOp('doble-resta')} 
            icon={<MinusCircle />} 
            label="Doble Resta" 
            color="orange" 
          />
        )}
        {isOpAvailable('escalera') && (
          <OpButton 
            active={activeOp === 'escalera'} 
            onClick={() => setActiveOp('escalera')} 
            icon={<ArrowUpRight />} 
            label="Escalera" 
            color="teal" 
          />
        )}
        {isOpAvailable('comparacion') && (
          <OpButton 
            active={activeOp === 'comparacion'} 
            onClick={() => setActiveOp('comparacion')} 
            icon={<Scale />} 
            label="Comparación" 
            color="sky" 
          />
        )}
        {isOpAvailable('sumirresta') && (
          <OpButton 
            active={activeOp === 'sumirresta'} 
            onClick={() => setActiveOp('sumirresta')} 
            icon={<ArrowRightLeft />} 
            label="Sumirresta" 
            color="violet" 
          />
        )}
        {isOpAvailable('multi') && (
          <OpButton 
            active={activeOp === 'multi'} 
            onClick={() => setActiveOp('multi')} 
            icon={<X />} 
            label="Multiplicación" 
            color="amber" 
          />
        )}
        {isOpAvailable('divi') && (
          <OpButton 
            active={activeOp === 'divi'} 
            onClick={() => setActiveOp('divi')} 
            icon={<Divide />} 
            label="División" 
            color="emerald" 
          />
        )}
      </div>

      <motion.div
        key={activeOp}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeOp === 'suma' && <RejillaSuma grade={grade} />}
        {activeOp === 'resta' && <RejillaResta grade={grade} />}
        {activeOp === 'doble-resta' && <RejillaDobleResta grade={grade} />}
        {activeOp === 'sumirresta' && <RejillaSumirresta grade={grade} />}
        {activeOp === 'multi' && <RejillaMultiplicacion grade={grade} />}
        {activeOp === 'divi' && <RejillaDivision grade={grade} />}
        {activeOp === 'doble-suma' && <RejillaDobleSuma grade={grade} />}
        {activeOp === 'escalera' && <RejillaEscalera grade={grade} />}
        {activeOp === 'comparacion' && <RejillaComparacion grade={grade} />}
      </motion.div>
    </div>
  );
}

function OpButton({ active, onClick, icon, label, color }: any) {
  const colors: any = {
    indigo: active ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-indigo-600 hover:bg-indigo-50',
    rose: active ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-white text-rose-500 hover:bg-rose-50',
    orange: active ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-white text-orange-500 hover:bg-orange-50',
    violet: active ? 'bg-violet-500 text-white shadow-violet-200' : 'bg-white text-violet-500 hover:bg-violet-50',
    amber: active ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-white text-amber-500 hover:bg-amber-50',
    emerald: active ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white text-emerald-500 hover:bg-emerald-50',
    cyan: active ? 'bg-cyan-500 text-white shadow-cyan-200' : 'bg-white text-cyan-500 hover:bg-cyan-50',
    teal: active ? 'bg-teal-500 text-white shadow-teal-200' : 'bg-white text-teal-500 hover:bg-teal-50',
    sky: active ? 'bg-sky-500 text-white shadow-sky-200' : 'bg-white text-sky-500 hover:bg-sky-50',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-lg transition-all shadow-lg ${colors[color]}`}
    >
      {React.cloneElement(icon, { size: 20 })}
      {label}
    </button>
  );
}
