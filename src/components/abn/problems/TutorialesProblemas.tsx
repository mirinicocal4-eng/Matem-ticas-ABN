/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, X, ChevronRight, Info, 
  ArrowRightLeft, Scale, LayoutGrid, 
  Layers, Calculator, GraduationCap, Plus
} from 'lucide-react';

interface TutorialContent {
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  example: string;
  steps: string[];
  gridExample: {
    action: string;
    remains: string;
    accumulated: string;
  }[];
}

const TUTORIALS: Record<string, TutorialContent> = {
  cambio: {
    title: 'Problemas de Cambio',
    icon: <ArrowRightLeft size={24} />,
    color: 'indigo',
    description: 'Son problemas donde una cantidad inicial sufre una transformación (aumenta o disminuye) para llegar a una cantidad final.',
    example: 'Tenía 15 cromos y me dan 8 más. ¿Cuántos tengo ahora?',
    steps: [
      'Identifica la cantidad inicial (15).',
      'Identifica la transformación (+8).',
      'Usa la rejilla para ir sumando los 8 cromos poco a poco.',
      'El resultado final es lo que tienes acumulado.'
    ],
    gridExample: [
      { action: '5', remains: '3', accumulated: '20' },
      { action: '3', remains: '0', accumulated: '23' }
    ]
  },
  comparacion: {
    title: 'Problemas de Comparación',
    icon: <Scale size={24} />,
    color: 'amber',
    description: 'Comparamos dos cantidades para hallar la diferencia o una de las cantidades conociendo la diferencia.',
    example: 'Ana tiene 25 pegatinas y Luis tiene 10 más que Ana. ¿Cuántas tiene Luis?',
    steps: [
      'Identifica la cantidad de referencia (25).',
      'Identifica la diferencia (10 más).',
      'Suma la diferencia a la cantidad de referencia.',
      'En la rejilla, puedes anotar los pasos de la suma.'
    ],
    gridExample: [
      { action: '10', remains: '0', accumulated: '35' }
    ]
  },
  reparto_igualatorio: {
    title: 'Reparto Igualatorio',
    icon: <Layers size={24} />,
    color: 'emerald',
    description: 'Tenemos dos cantidades diferentes y queremos pasar de una a otra hasta que ambas sean iguales.',
    example: 'Juan tiene 30 caramelos y Ana tiene 10. ¿Cuántos le da Juan a Ana para que tengan los mismos?',
    steps: [
      'Calcula la diferencia total (30 - 10 = 20).',
      'La mitad de esa diferencia es lo que hay que pasar (20 / 2 = 10).',
      'En la rejilla, resta de la columna mayor y suma a la menor.',
      'Cuando ambas cantidades coincidan, habrás terminado.'
    ],
    gridExample: [
      { action: '5', remains: '25', accumulated: '15' },
      { action: '5', remains: '20', accumulated: '20' }
    ]
  },
  isomorfismo_medidas: {
    title: 'Isomorfismo de Medidas',
    icon: <Calculator size={24} />,
    color: 'rose',
    description: 'Problemas de proporcionalidad directa (multiplicación o división simple).',
    example: 'Si un paquete de chicles cuesta 2€, ¿cuánto cuestan 5 paquetes?',
    steps: [
      'Identifica el valor de la unidad (2€).',
      'Identifica el número de repeticiones (5 veces).',
      'Multiplica el valor por las repeticiones.',
      'En ABN, puedes usar la rejilla de multiplicar.'
    ],
    gridExample: [
      { action: 'x2', remains: '5', accumulated: '10' }
    ]
  },
  combinacion: {
    title: 'Combinación',
    icon: <Plus size={24} />,
    color: 'blue',
    description: 'Unimos dos o más cantidades para hallar el total, o conocemos el total y una parte para hallar la otra.',
    example: 'En un frutero hay 12 manzanas y 15 peras. ¿Cuántas piezas de fruta hay en total?',
    steps: [
      'Identifica las dos partes (12 y 15).',
      'Suma ambas partes para obtener el todo.',
      'En la rejilla, coloca una parte y ve sumando la otra poco a poco.'
    ],
    gridExample: [
      { action: '10', remains: '5', accumulated: '22' },
      { action: '5', remains: '0', accumulated: '27' }
    ]
  },
  igualacion: {
    title: 'Igualación',
    icon: <ArrowRightLeft size={24} />,
    color: 'orange',
    description: 'Buscamos cuánto le falta o le sobra a una cantidad para ser exactamente igual a otra.',
    example: 'María tiene 12 libros y Jorge tiene 20. ¿Cuántos libros le tienen que dar a María para tener los mismos que Jorge?',
    steps: [
      'Identifica la cantidad menor (12) y la meta (20).',
      'Calcula cuánto falta para llegar a la meta.',
      'En la rejilla, ve sumando a la cantidad menor hasta alcanzar la mayor.'
    ],
    gridExample: [
      { action: '8', remains: '0', accumulated: '20' }
    ]
  },
  producto_cartesiano: {
    title: 'Producto Cartesiano',
    icon: <LayoutGrid size={24} />,
    color: 'purple',
    description: 'Combinamos elementos de dos conjuntos diferentes para ver cuántas parejas podemos formar.',
    example: 'Tengo 3 tipos de pan y 4 tipos de queso. ¿Cuántos bocadillos diferentes puedo hacer?',
    steps: [
      'Identifica el número de elementos del primer grupo (3).',
      'Identifica el número de elementos del segundo grupo (4).',
      'Multiplica ambos números para hallar todas las combinaciones.'
    ],
    gridExample: [
      { action: 'x4', remains: '3', accumulated: '12' }
    ]
  },
  multi_operacion: {
    title: 'Dos o más Operaciones',
    icon: <Layers size={24} />,
    color: 'cyan',
    description: 'Problemas complejos que requieren realizar varios pasos u operaciones encadenadas.',
    example: 'En un bus viajan 20 personas. Bajan 5 y luego suben 8. ¿Cuántas personas hay ahora?',
    steps: [
      'Realiza la primera operación (20 - 5 = 15).',
      'Usa el resultado para la segunda operación (15 + 8 = 23).',
      'Puedes usar dos rejillas o una rejilla extendida.'
    ],
    gridExample: [
      { action: '-5', remains: '15', accumulated: '15' },
      { action: '+8', remains: '23', accumulated: '23' }
    ]
  },
  escala: {
    title: 'Escala',
    icon: <GraduationCap size={24} />,
    color: 'slate',
    description: 'Relacionamos medidas en un dibujo o mapa con la realidad usando una escala.',
    example: 'En un mapa 1cm son 10km. Si hay 5cm entre dos ciudades, ¿cuántos km hay en la realidad?',
    steps: [
      'Identifica el valor de la escala (1cm = 10km).',
      'Identifica la medida en el mapa (5cm).',
      'Multiplica la medida por el valor de la escala.'
    ],
    gridExample: [
      { action: 'x10', remains: '5', accumulated: '50' }
    ]
  }
};

interface TutorialesProblemasProps {
  onClose: () => void;
}

export default function TutorialesProblemas({ onClose }: TutorialesProblemasProps) {
  const [selectedCat, setSelectedCat] = React.useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <BookOpen size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">Tutoriales ABN</h2>
              <p className="text-indigo-100 font-bold">Aprende a resolver cada tipo de problema</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!selectedCat ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(TUTORIALS).map(([id, tut]) => (
                <button
                  key={id}
                  onClick={() => setSelectedCat(id)}
                  className="group p-8 rounded-[2.5rem] border-4 border-slate-50 hover:border-indigo-100 hover:bg-indigo-50 transition-all text-left flex items-start gap-6"
                >
                  <div className={`p-4 rounded-2xl bg-${tut.color}-100 text-${tut.color}-600 group-hover:scale-110 transition-transform`}>
                    {tut.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">{tut.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{tut.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <button 
                onClick={() => setSelectedCat(null)}
                className="flex items-center gap-2 text-indigo-600 font-black hover:gap-3 transition-all"
              >
                <ChevronRight size={20} className="rotate-180" /> Volver al menú
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100">
                    <h4 className="text-indigo-600 font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
                      <Info size={18} /> Ejemplo Práctico
                    </h4>
                    <p className="text-2xl font-bold text-slate-800 italic leading-relaxed">
                      "{TUTORIALS[selectedCat].example}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-slate-400 font-black uppercase text-sm tracking-widest px-2">Pasos a seguir</h4>
                    {TUTORIALS[selectedCat].steps.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black shrink-0">{i + 1}</div>
                        <p className="text-slate-600 font-medium pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-slate-400 font-black uppercase text-sm tracking-widest px-2">Modelo de Rejilla ABN</h4>
                  <div className="bg-white border-4 border-emerald-100 rounded-[2.5rem] overflow-hidden shadow-xl">
                    <table className="w-full">
                      <thead className="bg-emerald-50">
                        <tr className="text-xs font-black text-emerald-700 uppercase tracking-widest">
                          <th className="p-4">Acción</th>
                          <th className="p-4">Queda</th>
                          <th className="p-4">Acumulado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-50">
                        {TUTORIALS[selectedCat].gridExample.map((row, i) => (
                          <tr key={i} className="text-center font-black text-xl text-slate-700">
                            <td className="p-6 text-emerald-600">{row.action}</td>
                            <td className="p-6">{row.remains}</td>
                            <td className="p-6 text-indigo-600">{row.accumulated}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-400 text-center font-medium italic">
                    * Este es un ejemplo de cómo se vería la rejilla resuelta.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
          <div className="flex items-center gap-3 text-slate-400 font-bold">
            <GraduationCap size={20} />
            <span>Método ABN: Comprensión antes que cálculo</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
