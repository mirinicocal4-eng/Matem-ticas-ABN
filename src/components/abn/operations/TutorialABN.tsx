/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, BookOpen, Lightbulb } from 'lucide-react';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: string[];
  example: string;
}

export default function TutorialABN({ isOpen, onClose, title, steps, example }: TutorialProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-pastel-slate w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-indigo-50"
          >
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <BookOpen size={28} />
                <h3 className="text-2xl font-black">{title}</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <h4 className="text-indigo-600 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                  <Lightbulb size={18} /> Pasos a seguir
                </h4>
                <ul className="space-y-3">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-slate-600 font-medium leading-relaxed">
                      <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-black text-xs">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-100">
                <h4 className="text-amber-700 font-black uppercase text-xs tracking-widest mb-2">Ejemplo Práctico</h4>
                <p className="text-amber-900 font-medium italic leading-relaxed">
                  {example}
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                ¡Entendido, vamos a practicar!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
