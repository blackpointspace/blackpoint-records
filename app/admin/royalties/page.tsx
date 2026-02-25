'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Royalties() {
  const [csvFile, setCsvFile] = useState(null);

  const handleCsvUpload = async () => {
    if (!csvFile) return;

    // Lógica para ler CSV e inserir no Supabase
    // Exemplo com PapaParse ou manual
    alert('CSV importado! (implemente a lógica)');
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Royalties & Streams</h1>
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-2xl mb-4">Importar via CSV</h2>
        <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
        <button onClick={handleCsvUpload} className="bg-green-600 px-4 py-2 rounded mt-4">Importar</button>
        <p className="mt-2">Formato: track_title,platform,streams,downloads,date</p>
      </div>
      {/* Formulário manual para adicionar um royalty/stream */}
    </div>
  );
}
