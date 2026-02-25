'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewRelease() {
  const [formData, setFormData] = useState({
    genre: '',
    title: '',
    version: '',
    main_artist: '',
    featuring: '',
    label: '',
    copyright: '',
    cover: null,
    ean_upc: '',
    catalog_number: '',
    previous_release: false,
    original_date: '',
    copyright_year: '',
    revenue_splits: [{ artist: '', percentage: '' }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload capa
    let coverUrl = null;
    if (formData.cover) {
      const { data, error } = await supabase.storage.from('covers').upload(`capa_${Date.now()}`, formData.cover);
      if (error) return alert('Erro na capa');
      coverUrl = data.path;
    }

    // Upload faixas (múltiplas)
    const tracks = [];
    // ... lógica para upload múltiplo (adicione input file multiple)

    const { error } = await supabase.from('releases').insert({
      user_id: 'seu-user-id', // pegue do auth
      title: formData.title,
      genre: formData.genre,
      version: formData.version,
      main_artist: formData.main_artist,
      featuring: formData.featuring,
      label: formData.label,
      copyright: formData.copyright,
      cover_art: coverUrl,
      ean_upc: formData.ean_upc,
      catalog_number: formData.catalog_number,
      previous_release: formData.previous_release,
      original_date: formData.original_date,
      copyright_year: formData.copyright_year,
      revenue_splits: formData.revenue_splits,
      status: 'draft',
    });

    if (error) alert('Erro');
    else alert('Lançamento criado!');
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Novo Lançamento</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label>Gênero</label>
          <select value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} className="w-full p-2 bg-gray-800 rounded">
            <option>Rock</option>
            {/* adicione mais */}
          </select>
        </div>
        <div>
          <label>Título do lançamento</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 bg-gray-800 rounded" />
        </div>
        <div>
          <label>Versão</label>
          <input type="text" value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} className="w-full p-2 bg-gray-800 rounded" />
        </div>
        <div>
          <label>Artistas (principal)</label>
          <input type="text" value={formData.main_artist} onChange={(e) => setFormData({ ...formData, main_artist: e.target.value })} className="w-full p-2 bg-gray-800 rounded" />
        </div>
        {/* Adicione featuring, selo, direitos, capa (input file), EAN/UPC, catálogo, data original, © ano, revenue splits (array de inputs) */}
        <button type="submit" className="bg-purple-700 px-6 py-3 rounded">Criar Lançamento</button>
      </form>
    </div>
  );
}
