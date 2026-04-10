/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, BrainCircuit, GraduationCap, ChevronRight, CheckCircle2, 
  Loader2, BookOpen, RotateCcw, Plus, PencilLine, Table as TableIcon, 
  MessageSquareQuote, Info, XCircle, Lightbulb
} from 'lucide-react';
import { generateAbnProblem, Problem as AIProblem } from '../../../services/geminiService';
import TutorialesProblemas from './TutorialesProblemas';

type Grade = '1º' | '2º' | '3º' | '4º' | '5º' | '6º';

type ProblemCategory = 
  | 'cambio' 
  | 'combinacion' 
  | 'comparacion' 
  | 'igualacion' 
  | 'reparto_igualatorio' 
  | 'isomorfismo_medidas' 
  | 'producto_cartesiano' 
  | 'multi_operacion' 
  | 'escala';

interface LocalProblem {
  text: string;
  answer: number;
  category: ProblemCategory;
  subType: string;
}

interface GridRow {
  id: string;
  col1: string;
  col2: string;
  col3: string;
}

const CATEGORIAS = [
  { id: 'cambio', name: 'Cambio', desc: '6 tipos (C1-C6): Añadir o quitar a una cantidad inicial.' },
  { id: 'combinacion', name: 'Combinación', desc: '2 tipos (CB1-CB2): Unir partes o hallar una parte.' },
  { id: 'comparacion', name: 'Comparación', desc: '6 tipos (CP1-CP6): Diferencia entre dos cantidades.' },
  { id: 'igualacion', name: 'Igualación', desc: '6 tipos (I1-I6): Hacer que dos cantidades sean iguales.' },
  { id: 'reparto_igualatorio', name: 'Reparto Igualatorio', desc: '12 tipos (RI1-RI12): Distribuir equitativamente.' },
  { id: 'isomorfismo_medidas', name: 'Isomorfismo de Medidas', desc: '3 tipos (IM1-IM3): Proporcionalidad simple.' },
  { id: 'producto_cartesiano', name: 'Producto Cartesiano', desc: '3 tipos (PC1-PC3): Combinatoria de elementos.' },
  { id: 'multi_operacion', name: 'Dos o más Operaciones', desc: 'Problemas combinados de varios pasos.' },
  { id: 'escala', name: 'Escala', desc: 'Proporcionalidad en mapas y distancias.' },
];

const SUBTYPES: Record<string, string[]> = {
  cambio: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
  combinacion: ['CB1', 'CB2'],
  comparacion: ['CP1', 'CP2', 'CP3', 'CP4', 'CP5', 'CP6'],
  igualacion: ['I1', 'I2', 'I3', 'I4', 'I5', 'I6'],
  reparto_igualatorio: ['RI1', 'RI2', 'RI3', 'RI4', 'RI5', 'RI6', 'RI7', 'RI8', 'RI9', 'RI10', 'RI11', 'RI12'],
  isomorfismo_medidas: ['IM1', 'IM2', 'IM3'],
  producto_cartesiano: ['PC1', 'PC2', 'PC3'],
};

const NIVELES: Grade[] = ['1º', '2º', '3º', '4º', '5º', '6º'];

export default function GeneradorProblemas() {
  const [nivel, setNivel] = useState<Grade>('1º');
  const [categoria, setCategoria] = useState<string>('cambio');
  const [subTipoSeleccionado, setSubTipoSeleccionado] = useState<string>('Aleatorio');
  const [problem, setProblem] = useState<LocalProblem | AIProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showTutorials, setShowTutorials] = useState(false);
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');

  // Workspace State
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'none'>('none');
  const [userData, setUserData] = useState<{ id: string; text: string }[]>([{ id: '1', text: '' }]);
  const [gridRows, setGridRows] = useState<GridRow[]>([
    { id: '1', col1: '', col2: '', col3: '' }
  ]);

  const resetWorkspace = () => {
    setUserData([{ id: '1', text: '' }]);
    setGridRows([{ id: '1', col1: '', col2: '', col3: '' }]);
    setUserAnswer('');
    setFeedback('none');
    setShowSolution(false);
  };

  const generateManualProblem = () => {
    setLoading(true);
    setTimeout(() => {
      const cat = categoria as ProblemCategory;
      let text = "";
      let subType = "";
      
      const availableSubtypes = SUBTYPES[cat] || [];
      if (subTipoSeleccionado === 'Aleatorio' || !availableSubtypes.includes(subTipoSeleccionado)) {
        subType = availableSubtypes[Math.floor(Math.random() * availableSubtypes.length)] || cat.toUpperCase();
      } else {
        subType = subTipoSeleccionado;
      }

      // Base numbers for generation
      const base = nivel === '1º' || nivel === '2º' ? 20 : nivel === '3º' || nivel === '4º' ? 100 : 500;
      const ans = Math.floor(Math.random() * base) + 10;
      const n1 = Math.floor(Math.random() * (ans - 5)) + 5;
      const n2 = ans - n1;
      const nLarge = ans + Math.floor(Math.random() * 20) + 5;
      const nDiff = nLarge - ans;

      switch (cat) {
        case 'cambio': {
          if (subType === 'C1') text = `Tenía ${n1} cromos y mi abuela me ha dado ${n2}. ¿Cuántos tengo ahora?`;
          if (subType === 'C2') text = `Tenía ${nLarge} caramelos y me he comido ${nDiff}. ¿Cuántos me quedan?`;
          if (subType === 'C3') text = `Tenía ${n1} canicas y después de jugar tengo ${ans}. ¿Cuántas he ganado?`;
          if (subType === 'C4') text = `Tenía ${nLarge} globos y ahora solo tengo ${ans}. ¿Cuántos se han explotado?`;
          if (subType === 'C5') text = `Me han dado ${n2} lápices y ahora tengo ${ans}. ¿Cuántos tenía al principio?`;
          if (subType === 'C6') text = `He perdido ${nDiff} euros y ahora me quedan ${ans}. ¿Cuánto dinero tenía antes?`;
          break;
        }
        case 'combinacion': {
          if (subType === 'CB1') text = `En un frutero hay ${n1} manzanas y ${n2} peras. ¿Cuántas piezas de fruta hay en total?`;
          if (subType === 'CB2') text = `En clase somos ${ans} alumnos. Si ${n1} son niñas, ¿cuántos niños hay?`;
          break;
        }
        case 'comparacion': {
          if (subType === 'CP1') text = `Ana tiene ${n1} pegatinas y Luis tiene ${n2} más que Ana. ¿Cuántas tiene Luis?`;
          if (subType === 'CP2') text = `Pedro tiene ${nLarge} canicas y Marta tiene ${nDiff} menos que Pedro. ¿Cuántas tiene Marta?`;
          if (subType === 'CP3') text = `Sofía tiene ${ans} euros y Lucas tiene ${n1}. ¿Cuántos euros tiene Sofía más que Lucas?`;
          if (subType === 'CP4') text = `Hugo tiene ${ans} coches y Elena tiene ${nLarge}. ¿Cuántos coches tiene Hugo menos que Elena?`;
          if (subType === 'CP5') text = `Carlos tiene ${nLarge} puntos. Si Carlos tiene ${nDiff} más que Sara, ¿cuántos puntos tiene Sara?`;
          if (subType === 'CP6') text = `Julia tiene ${n1} flores. Si Julia tiene ${n2} menos que Dani, ¿cuántas flores tiene Dani?`;
          break;
        }
        case 'igualacion': {
          if (subType === 'I1') text = `María tiene ${n1} libros y Jorge tiene ${ans}. ¿Cuántos libros le tienen que dar a María para tener los mismos que Jorge?`;
          if (subType === 'I2') text = `Lola tiene ${nLarge} tizas y Ramón tiene ${ans}. ¿Cuántas tizas tiene que perder Lola para tener las mismas que Ramón?`;
          if (subType === 'I3') text = `Inés tiene ${ans} cartas. Si a Pablo le dieran ${nDiff}, tendría las mismas que Inés. ¿Cuántas tiene Pablo?`;
          if (subType === 'I4') text = `Raúl tiene ${ans} canicas. Si a Clara le quitaran ${n2}, tendría las mismas que Raúl. ¿Cuántas tiene Clara?`;
          if (subType === 'I5') text = `Santi tiene ${n1} fichas y Alba tiene ${ans}. Si a Santi le dan ${n2} fichas, ¿cuántas tendrá Alba?`;
          if (subType === 'I6') text = `Mario tiene ${nLarge} pegatinas y Eva tiene ${ans}. Si Mario pierde ${nDiff} pegatinas, ¿cuántas tendrá Eva?`;
          break;
        }
        case 'reparto_igualatorio': {
          const diff = Math.floor(Math.random() * 10) + 2;
          const a = ans + diff;
          const b = ans - diff;
          const total = a + b;
          
          if (subType === 'RI1') text = `Juan tiene ${a} caramelos y Ana tiene ${b}. ¿Cuántos caramelos le tiene que dar Juan a Ana para que los dos tengan los mismos?`;
          if (subType === 'RI2') text = `Juan tiene ${a} caramelos y Ana tiene ${b}. Si Juan le da ${diff} a Ana, ¿cuántos caramelos tendrán cada uno?`;
          if (subType === 'RI3') text = `Juan tiene ${a} caramelos. Le da ${diff} a Ana y ahora los dos tienen los mismos. ¿Cuántos tenía Ana al principio?`;
          if (subType === 'RI4') text = `Ana tiene ${b} caramelos. Juan le da ${diff} y ahora los dos tienen los mismos. ¿Cuántos tenía Juan al principio?`;
          if (subType === 'RI5') text = `Juan y Ana tienen ${total} caramelos entre los dos. Si Juan le da ${diff} a Ana, tendrán los mismos. ¿Cuántos tiene Juan?`;
          if (subType === 'RI6') text = `Juan y Ana tienen ${total} caramelos entre los dos. Si Juan le da ${diff} a Ana, tendrán los mismos. ¿Cuántos tiene Ana?`;
          if (subType === 'RI7') text = `Juan tiene ${a} caramelos y Ana tiene algunos. Si Juan le da ${diff}, Ana tendrá ${ans}. ¿Cuántos tiene Ana ahora?`;
          if (subType === 'RI8') text = `Juan tiene algunos caramelos y Ana tiene ${b}. Si Juan le da ${diff}, él se queda con ${ans}. ¿Cuántos tenía Juan?`;
          if (subType === 'RI9') text = `Juan tiene ${a} y Ana tiene ${b}. ¿Cuántos tendrán cada uno si se reparten el total a partes iguales?`;
          if (subType === 'RI10') text = `Juan tiene ${a} y Ana tiene ${b}. Juan le da algunos a Ana y ahora ella tiene ${ans}. ¿Cuántos le ha dado?`;
          if (subType === 'RI11') text = `Juan tiene ${a} y Ana tiene ${b}. Juan le da algunos a Ana y ahora él tiene ${ans}. ¿Cuántos le ha dado?`;
          if (subType === 'RI12') text = `Juan tiene ${a} y Ana tiene ${b}. ¿Cuál es la diferencia de caramelos entre los dos si queremos que tengan los mismos?`;
          
          const finalAns = (subType === 'RI1' || subType === 'RI3' || subType === 'RI4' || subType === 'RI10' || subType === 'RI11') ? diff : 
                           (subType === 'RI2' || subType === 'RI7' || subType === 'RI8' || subType === 'RI9') ? ans :
                           (subType === 'RI5') ? a : (subType === 'RI6') ? b : diff;
          
          setProblem({ text, answer: finalAns, category: cat, subType });
          resetWorkspace();
          setLoading(false);
          return;
        }
        case 'isomorfismo_medidas': {
          const factor = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
          const unitPrice = Math.floor(ans / factor) || 2;
          const total = unitPrice * factor;

          if (subType === 'IM1') text = `Si un paquete de cromos cuesta ${unitPrice} euros, ¿cuánto costarán ${factor} paquetes iguales?`;
          if (subType === 'IM2') text = `He pagado ${total} euros por ${factor} paquetes de cromos iguales. ¿Cuánto cuesta cada paquete?`;
          if (subType === 'IM3') text = `Cada paquete de cromos cuesta ${unitPrice} euros. Si tengo ${total} euros, ¿cuántos paquetes puedo comprar?`;
          
          const finalAns = (subType === 'IM1') ? total : (subType === 'IM2') ? unitPrice : factor;
          setProblem({ text, answer: finalAns, category: cat, subType });
          resetWorkspace();
          setLoading(false);
          return;
        }
        case 'producto_cartesiano': {
          const f1 = Math.floor(Math.random() * 4) + 2;
          const f2 = Math.floor(Math.random() * 3) + 2;
          const total = f1 * f2;

          if (subType === 'PC1') text = `Tengo ${f1} tipos de pan y ${f2} tipos de queso. ¿Cuántos bocadillos diferentes puedo hacer?`;
          if (subType === 'PC2') text = `Puedo hacer ${total} bocadillos diferentes combinando panes y quesos. Si tengo ${f1} tipos de pan, ¿cuántos quesos tengo?`;
          if (subType === 'PC3') text = `Puedo hacer ${total} bocadillos diferentes combinando panes y quesos. Si tengo ${f2} tipos de queso, ¿cuántos panes tengo?`;
          
          const finalAns = (subType === 'PC1') ? total : (subType === 'PC2') ? f2 : f1;
          setProblem({ text, answer: finalAns, category: cat, subType });
          resetWorkspace();
          setLoading(false);
          return;
        }
        case 'multi_operacion': {
          subType = "MO";
          const start = ans + 10;
          const minus = 15;
          const plus = ans - (start - minus);
          text = `En un autobús viajan ${start} personas. En la primera parada bajan ${minus} y en la segunda suben ${plus}. ¿Cuántas personas hay ahora en el autobús?`;
          break;
        }
        case 'escala': {
          subType = "E";
          text = `En un mapa, 1 cm representa 10 km. Si la distancia real entre dos pueblos es de ${ans * 10} km, ¿cuántos cm medirán en el mapa?`;
          break;
        }
      }

      setProblem({ text, answer: ans, category: cat, subType });
      resetWorkspace();
      setLoading(false);
    }, 800);
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    resetWorkspace();
    try {
      const p = await generateAbnProblem(categoria, nivel);
      setProblem(p);
    } catch (error) {
      alert("Hubo un error generando el problema con IA. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!problem) return;
    const correctAns = 'answer' in problem ? problem.answer : parseInt(problem.solucion);
    const userAns = parseFloat(userAnswer);
    if (userAns === correctAns) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const addDataRow = () => setUserData([...userData, { id: Math.random().toString(), text: '' }]);
  const addGridRow = () => setGridRows([...gridRows, { id: Math.random().toString(), col1: '', col2: '', col3: '' }]);
  
  const updateDataRow = (id: string, text: string) => {
    setUserData(userData.map(row => row.id === id ? { ...row, text } : row));
  };

  const updateGridRow = (id: string, col: 'col1' | 'col2' | 'col3', val: string) => {
    setGridRows(gridRows.map(row => row.id === id ? { ...row, [col]: val } : row));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20">
      {/* Configuración del Motor */}
      <section className="bg-pastel-emerald/60 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border-4 border-emerald-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-emerald-600 p-3 md:p-4 rounded-2xl md:rounded-3xl text-white shadow-xl shadow-emerald-100">
              <BrainCircuit size={32} className="md:w-10 md:h-10" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">Motor de Problemas ABN</h2>
              <p className="text-slate-500 font-bold text-sm md:text-lg">Configura y genera desafíos matemáticos</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={() => setShowTutorials(true)}
              className="px-6 py-3 rounded-2xl bg-amber-50 text-amber-600 font-black flex items-center gap-2 hover:bg-amber-100 transition-all border-2 border-amber-100"
            >
              <BookOpen size={20} /> Ver Tutoriales
            </button>

            <div className="flex bg-slate-100 p-1 md:p-2 rounded-2xl w-full md:w-auto">
              <button 
                onClick={() => setMode('manual')}
                className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-xl font-black transition-all text-sm md:text-base ${mode === 'manual' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Estructurado
              </button>
              <button 
                onClick={() => setMode('ai')}
                className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 text-sm md:text-base ${mode === 'ai' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Sparkles size={16} className="md:w-[18px] md:h-[18px]" /> IA Gemini
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Selector de Categoría */}
          <div className="lg:col-span-2 space-y-4">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
              <BookOpen size={18} className="text-emerald-400" /> Categoría ABN
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIAS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoria(cat.id)}
                  className={`p-4 rounded-2xl text-left border-4 transition-all group ${
                    categoria === cat.id 
                    ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-50' 
                    : 'bg-white border-slate-50 hover:border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className={`font-black text-lg ${categoria === cat.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {cat.name}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1 leading-tight">
                    {cat.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Nivel */}
          <div className="space-y-4">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
              <GraduationCap size={18} className="text-emerald-400" /> Nivel Educativo
            </label>
            <div className="grid grid-cols-2 gap-3">
              {NIVELES.map(n => (
                <button
                  key={n}
                  onClick={() => setNivel(n)}
                  className={`p-5 rounded-2xl font-black text-xl transition-all border-4 ${
                    nivel === n 
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-xl shadow-emerald-100 scale-105' 
                    : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {mode === 'manual' && SUBTYPES[categoria] && (
              <div className="mt-8 space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                  <Info size={18} className="text-emerald-400" /> Sub-tipo Específico
                </label>
                <select 
                  value={subTipoSeleccionado}
                  onChange={(e) => setSubTipoSeleccionado(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 focus:border-emerald-500 outline-none transition-all appearance-none"
                >
                  <option value="Aleatorio">🎲 Aleatorio</option>
                  {SUBTYPES[categoria].map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={mode === 'manual' ? generateManualProblem : handleGenerateAI}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-emerald-100 flex items-center justify-center gap-4 transition-all text-2xl group active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" size={32} /> : mode === 'ai' ? <Sparkles size={32} /> : <RotateCcw size={32} />}
          {loading ? 'Generando Desafío...' : 'Crear Nuevo Problema'}
        </button>
      </section>

      {/* Resultado del Problema y Zona de Trabajo */}
      <AnimatePresence mode="wait">
        {problem && !loading && (
          <motion.div
            key={('text' in problem ? problem.text : problem.enunciado)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-10"
          >
            {/* Enunciado */}
            <div className="bg-pastel-emerald/40 p-12 rounded-[3.5rem] shadow-2xl border-4 border-emerald-100 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-5">
                <BrainCircuit size={200} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest border border-emerald-200">
                    {'category' in problem ? problem.category.replace('_', ' ') : problem.categoria}
                  </span>
                  {'subType' in problem && (
                    <span className="bg-amber-100 text-amber-700 px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest border border-amber-200">
                      Tipo: {problem.subType}
                    </span>
                  )}
                </div>

                <h3 className="text-3xl font-black text-slate-800 leading-relaxed italic text-center">
                  "{'text' in problem ? problem.text : problem.enunciado}"
                </h3>
              </div>
            </div>

            {/* Zona de Trabajo Interactiva */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Sección Datos */}
              <div className="bg-pastel-emerald/50 p-10 rounded-[3rem] border-4 border-dashed border-emerald-200 shadow-lg">
                <h3 className="text-2xl font-black text-emerald-800 flex items-center gap-4 mb-8">
                  <div className="bg-emerald-100 p-2 rounded-xl"><PencilLine size={28} /></div>
                  Datos del Problema
                </h3>
                <div className="space-y-4">
                  {userData.map((row) => (
                    <input
                      key={row.id}
                      type="text"
                      value={row.text}
                      onChange={(e) => updateDataRow(row.id, e.target.value)}
                      placeholder="Anota un dato importante..."
                      className="w-full p-5 rounded-2xl border-2 border-emerald-50 bg-white focus:border-emerald-300 outline-none font-bold text-slate-700 text-lg shadow-sm"
                    />
                  ))}
                  <button 
                    onClick={addDataRow}
                    className="w-full py-4 border-2 border-dashed border-emerald-200 rounded-2xl text-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 font-black text-lg"
                  >
                    <Plus size={24} /> Añadir dato
                  </button>
                </div>
              </div>

              {/* Sección Rejilla ABN */}
              <div className="bg-pastel-emerald/50 p-10 rounded-[3rem] border-4 border-dashed border-emerald-200 shadow-lg">
                <h3 className="text-2xl font-black text-emerald-800 flex items-center gap-4 mb-8">
                  <div className="bg-emerald-100 p-2 rounded-xl"><TableIcon size={28} /></div>
                  Rejilla de Operación
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-3">
                    <thead>
                      <tr className="text-sm font-black text-emerald-600 uppercase tracking-widest">
                        <th className="p-2">Acción</th>
                        <th className="p-2">Queda</th>
                        <th className="p-2">Acumulado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridRows.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <input 
                              type="text" 
                              value={row.col1} 
                              onChange={(e) => updateGridRow(row.id, 'col1', e.target.value)}
                              className="w-full p-4 rounded-2xl border-2 border-emerald-50 text-center font-black text-emerald-900 outline-none focus:border-emerald-300 shadow-sm"
                            />
                          </td>
                          <td>
                            <input 
                              type="text" 
                              value={row.col2} 
                              onChange={(e) => updateGridRow(row.id, 'col2', e.target.value)}
                              className="w-full p-4 rounded-2xl border-2 border-emerald-50 text-center font-black text-emerald-900 outline-none focus:border-emerald-300 shadow-sm"
                            />
                          </td>
                          <td>
                            <input 
                              type="text" 
                              value={row.col3} 
                              onChange={(e) => updateGridRow(row.id, 'col3', e.target.value)}
                              className="w-full p-4 rounded-2xl border-2 border-emerald-50 text-center font-black text-emerald-900 outline-none focus:border-emerald-300 shadow-sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button 
                    onClick={addGridRow}
                    className="w-full mt-6 py-4 border-2 border-dashed border-emerald-200 rounded-2xl text-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 font-black text-lg"
                  >
                    <Plus size={24} /> Añadir fila a la rejilla
                  </button>
                </div>
              </div>
            </div>

            {/* Resultado Final y Verificación */}
            <div className="bg-pastel-emerald/50 p-12 rounded-[4rem] border-4 border-emerald-100 shadow-2xl flex flex-col items-center gap-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <label htmlFor="answer" className="text-3xl font-black text-emerald-800 uppercase tracking-widest">Resultado Final:</label>
                <div className="relative">
                  <input
                    id="answer"
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="?"
                    className={`w-48 p-8 text-center text-6xl font-black rounded-[2.5rem] border-4 transition-all outline-none shadow-inner ${
                      feedback === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-900' :
                      feedback === 'incorrect' ? 'border-rose-400 bg-rose-50 text-rose-900 animate-shake' :
                      'border-slate-100 bg-slate-50 text-slate-800 focus:border-indigo-400'
                    }`}
                  />
                  {feedback === 'correct' && <CheckCircle2 className="absolute -top-4 -right-4 text-emerald-500 bg-white rounded-full" size={48} />}
                  {feedback === 'incorrect' && <XCircle className="absolute -top-4 -right-4 text-rose-500 bg-white rounded-full" size={48} />}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={checkAnswer}
                  className="bg-emerald-500 text-white px-20 py-6 rounded-3xl font-black text-3xl hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-100 active:scale-95"
                >
                  Comprobar Solución
                </button>
                
                <button 
                  onClick={() => setShowSolution(!showSolution)}
                  className="bg-slate-100 text-slate-600 px-10 py-6 rounded-3xl font-black text-xl hover:bg-slate-200 transition-all flex items-center gap-3"
                >
                  <Lightbulb size={24} /> {showSolution ? 'Ocultar Ayuda' : 'Ver Ayuda'}
                </button>
              </div>

              <AnimatePresence>
                {showSolution && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full max-w-2xl bg-amber-50 p-8 rounded-[2.5rem] border-4 border-amber-100"
                  >
                    <h4 className="text-amber-800 font-black text-xl mb-4 flex items-center gap-3">
                      <Info size={24} /> Estrategia Sugerida
                    </h4>
                    <p className="text-amber-900 text-lg leading-relaxed font-medium">
                      {'explicacion' in problem ? problem.explicacion : `Para resolver este problema de ${problem.category}, identifica primero los datos clave. La solución es ${problem.answer}. Puedes usar la rejilla para ir sumando o restando las cantidades de forma flexible.`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showTutorials && (
          <TutorialesProblemas onClose={() => setShowTutorials(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
