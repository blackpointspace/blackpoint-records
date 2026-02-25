import { supabase } from '@/lib/supabase';

export default async function AdminDashboard() {
  const { data: clients } = await supabase.from('users').select('count(*)').eq('role', 'artist');
  const { data: launches } = await supabase.from('releases').select('count(*)');
  const { data: sales } = await supabase.from('royalties').select('sum(amount)').eq('status', 'paid');
  const { data: pending } = await supabase.from('royalties').select('sum(amount)').eq('status', 'pending');

  const { data: launchesPending } = await supabase.from('releases').select('*, users(name)').eq('status', 'draft').limit(5);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Painel Admin</h1>

      {/* Cards coloridos como seu print */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-600 p-6 rounded-xl shadow-lg">
          <p className="text-lg">Total Clientes</p>
          <p className="text-4xl font-bold">{clients?.[0]?.count || 0}</p>
        </div>
        <div className="bg-green-600 p-6 rounded-xl shadow-lg">
          <p className="text-lg">Total Lançamentos</p>
          <p className="text-4xl font-bold">{launches?.[0]?.count || 0}</p>
        </div>
        <div className="bg-blue-800 p-6 rounded-xl shadow-lg">
          <p className="text-lg">Vendas (Streams)</p>
          <p className="text-4xl font-bold">R$ {sales?.[0]?.sum || 0}</p>
        </div>
        <div className="bg-yellow-600 p-6 rounded-xl shadow-lg">
          <p className="text-lg">Royalties Pagos</p>
          <p className="text-4xl font-bold">R$ {sales?.[0]?.sum || 0}</p>
        </div>
        <div className="bg-red-600 p-6 rounded-xl shadow-lg">
          <p className="text-lg">Pendentes</p>
          <p className="text-4xl font-bold">R$ {pending?.[0]?.sum || 0}</p>
        </div>
      </div>

      {/* Lançamentos pendentes (aprovação + download) */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <h2 className="text-2xl font-bold mb-4">Lançamentos Pendentes</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Título</th>
              <th className="py-2">Artista</th>
              <th className="py-2">Capa</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {launchesPending?.map((launch) => (
              <tr key={launch.id} className="border-b">
                <td className="py-4">{launch.title}</td>
                <td className="py-4">{launch.users?.name || 'Desconhecido'}</td>
                <td className="py-4">
                  {launch.cover_art && <img src={launch.cover_art} alt="Capa" className="w-16 h-16 object-cover rounded" />}
                </td>
                <td className="py-4">
                  <button className="bg-green-600 px-3 py-1 rounded mr-2">Aprovar</button>
                  <button className="bg-red-600 px-3 py-1 rounded mr-2">Rejeitar</button>
                  <a href={launch.tracks?.[0]?.audio_file} download className="bg-blue-600 px-3 py-1 rounded">Download Faixas</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
