import React from 'react';
import { motion } from 'motion/react';
import { Hash, Heart, Grid3X3, Calculator, BrainCircuit, BookOpen } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden p-6"
    >
      {/* Elementos decorativos animados */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"
      />
      
      <div className="relative z-10 max-w-4xl w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block bg-white p-6 rounded-[3rem] shadow-2xl shadow-indigo-200/50 mb-10 border-8 border-indigo-50"
        >
          <div className="bg-indigo-600 p-6 rounded-[2rem] text-white inline-block mb-6 shadow-xl">
            <BookOpen size={64} strokeWidth={2.5} />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-800 tracking-tighter leading-none mb-2">
            ABN <span className="text-indigo-600">Pro</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-slate-500 italic">
            Matemáticas divertidas y manipulativas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {[
            { icon: Hash, label: "Números", color: "bg-indigo-100 text-indigo-600" },
            { icon: Heart, label: "Amigos", color: "bg-rose-100 text-rose-600" },
            { icon: Grid3X3, label: "Tabla 100", color: "bg-purple-100 text-purple-600" },
            { icon: Calculator, label: "Cálculo", color: "bg-orange-100 text-orange-600" },
            { icon: BrainCircuit, label: "Problemas", color: "bg-emerald-100 text-emerald-600" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`${item.color} p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm border-2 border-white`}
            >
              <item.icon size={24} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative px-12 py-6 bg-indigo-600 text-white rounded-full font-black text-2xl shadow-2xl shadow-indigo-300 hover:bg-indigo-700 transition-all overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            ¡Empezar a jugar!
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🚀
            </motion.span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </motion.button>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-slate-400 font-medium"
        >
          Método de Algoritmos Abiertos Basados en Números
        </motion.p>
      </div>
    </motion.div>
  );
}
