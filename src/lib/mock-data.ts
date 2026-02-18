export const mockStreamsData = [
  { date: "Jan", streams: 12400, downloads: 340 },
  { date: "Fev", streams: 18200, downloads: 520 },
  { date: "Mar", streams: 24100, downloads: 680 },
  { date: "Abr", streams: 21800, downloads: 610 },
  { date: "Mai", streams: 31200, downloads: 890 },
  { date: "Jun", streams: 28700, downloads: 760 },
  { date: "Jul", streams: 35400, downloads: 1020 },
];

export const mockPlatformData = [
  { name: "Spotify", value: 45, color: "hsl(141, 73%, 42%)" },
  { name: "Apple Music", value: 22, color: "hsl(0, 0%, 60%)" },
  { name: "YouTube Music", value: 18, color: "hsl(0, 100%, 50%)" },
  { name: "Deezer", value: 8, color: "hsl(270, 70%, 55%)" },
  { name: "Outros", value: 7, color: "hsl(40, 80%, 55%)" },
];

export const mockReleases = [
  { id: "1", title: "Noite Estrelada", type: "single" as const, cover: "/placeholder.svg", releaseDate: "2025-01-15", status: "published" as const, streams: 45200 },
  { id: "2", title: "Ecos do Amanhã", type: "album" as const, cover: "/placeholder.svg", releaseDate: "2024-11-20", status: "approved" as const, streams: 128700 },
  { id: "3", title: "Frequência", type: "single" as const, cover: "/placeholder.svg", releaseDate: "2025-02-01", status: "draft" as const, streams: 0 },
  { id: "4", title: "Pulse", type: "single" as const, cover: "/placeholder.svg", releaseDate: "2024-09-10", status: "published" as const, streams: 67300 },
];

export const mockRoyalties = [
  { id: "1", month: "2025-01", amount: 342.50, status: "pending" as const },
  { id: "2", month: "2024-12", amount: 512.80, status: "available" as const },
  { id: "3", month: "2024-11", amount: 478.20, status: "paid" as const },
  { id: "4", month: "2024-10", amount: 389.10, status: "paid" as const },
  { id: "5", month: "2024-09", amount: 295.60, status: "paid" as const },
];

export const mockNotifications = [
  { id: "1", title: "Lançamento aprovado", message: "Seu single 'Noite Estrelada' foi aprovado e está sendo distribuído.", isRead: false, createdAt: "2025-02-15" },
  { id: "2", title: "Royalties disponíveis", message: "R$ 512,80 em royalties de Dezembro/2024 estão disponíveis para saque.", isRead: false, createdAt: "2025-02-10" },
  { id: "3", title: "Novo documento", message: "Um novo relatório foi adicionado à sua área de documentos.", isRead: true, createdAt: "2025-02-05" },
];

export const mockArtists = [
  { id: "1", name: "MC Luna", email: "luna@email.com", avatar: "/placeholder.svg", releases: 5, totalStreams: 241200, plan: "AMPLIFY" },
  { id: "2", name: "DJ Cosmos", email: "cosmos@email.com", avatar: "/placeholder.svg", releases: 3, totalStreams: 89400, plan: "Starter" },
  { id: "3", name: "Aria Nova", email: "aria@email.com", avatar: "/placeholder.svg", releases: 8, totalStreams: 567800, plan: "AMPLIFY Pro" },
];

export const plans = {
  perRelease: [
    {
      name: "Starter",
      price: "R$ 19,90",
      period: "por lançamento",
      commission: "10%",
      features: ["Distribuição para 150+ plataformas", "Estatísticas básicas", "Suporte por email", "1 artista"],
      highlighted: false,
    },
    {
      name: "Rockstar",
      price: "R$ 49,90",
      period: "por lançamento",
      commission: "0%",
      features: ["Distribuição para 150+ plataformas", "0% de comissão", "Pitching para playlists", "Content ID YouTube", "Suporte prioritário", "1 artista"],
      highlighted: true,
    },
  ],
  subscriptions: [
    {
      name: "AMPLIFY",
      price: "R$ 199,90",
      period: "/ano",
      commission: "0%",
      features: ["Lançamentos ilimitados", "0% de comissão", "1 artista", "Estatísticas avançadas", "Suporte prioritário"],
      highlighted: false,
    },
    {
      name: "AMPLIFY+",
      price: "R$ 349,90",
      period: "/ano",
      commission: "0%",
      features: ["Tudo do AMPLIFY", "Até 5 artistas", "Pitching para playlists", "Content ID YouTube", "Relatórios detalhados"],
      highlighted: true,
    },
    {
      name: "AMPLIFY Pro",
      price: "R$ 599,90",
      period: "/ano",
      commission: "0%",
      features: ["Tudo do AMPLIFY+", "Artistas ilimitados", "Ideal para selos", "Masterização grátis", "Suporte VIP dedicado", "API de integração"],
      highlighted: false,
    },
  ],
};
