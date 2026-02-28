import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones, Globe, BarChart3, Shield, Zap, Music2, Check } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  { icon: Globe, title: "150+ Plataformas", description: "Spotify, Apple Music, YouTube Music, Deezer, Amazon Music e muito mais." },
  { icon: BarChart3, title: "Analytics em Tempo Real", description: "Acompanhe streams, downloads e receita com gráficos detalhados." },
  { icon: Shield, title: "Content ID", description: "Proteja sua música no YouTube com nosso sistema de Content ID." },
  { icon: Zap, title: "Distribuição Rápida", description: "Sua música nas plataformas em até 48 horas após aprovação." },
  { icon: Headphones, title: "Pitching Playlists", description: "Enviamos sua música para curadores de playlists editoriais." },
  { icon: Music2, title: "Masterização IA", description: "Masterize suas faixas gratuitamente com nossa tecnologia de IA." },
];

const platforms = ["Spotify", "Apple Music", "YouTube Music", "Deezer", "Amazon Music", "Tidal", "TikTok", "Instagram", "SoundCloud", "Shazam", "Pandora", "iHeartRadio"];

const steps = [
  { num: "01", title: "Crie sua conta", desc: "Cadastre-se gratuitamente e configure seu perfil de artista." },
  { num: "02", title: "Envie sua música", desc: "Faça upload das faixas, arte de capa e preencha os metadados." },
  { num: "03", title: "Distribua globalmente", desc: "Sua música estará em 150+ plataformas em até 48h." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — editorial Behance style */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-40">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-primary/20 bg-primary/5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium tracking-wide">Distribua sua música para o mundo</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 max-w-5xl mx-auto leading-[1.05] tracking-tight">
            Sua Música em{" "}
            <span className="gradient-purple-text">Todas as Plataformas</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            A Black Point distribui sua música para mais de 150 plataformas digitais. Sem complicações, com total controle e transparência nos seus royalties.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-purple text-primary-foreground border-0 text-base px-10 py-6 glow-purple rounded-xl" asChild>
              <Link to="/login?tab=register">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-10 py-6 border-border rounded-xl" asChild>
              <Link to="/precos">Ver Preços</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-16 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> 150+ plataformas</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Sem taxa anual</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> 100% dos royalties</span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-28 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Como <span className="gradient-purple-text">Funciona</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Três passos simples para distribuir sua música globalmente.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <span className="font-display text-5xl font-bold gradient-purple-text">{s.num}</span>
                <h3 className="font-display font-semibold text-lg mt-4 mb-2 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Tudo que Você Precisa para{" "}
              <span className="gradient-purple-text">Crescer</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Ferramentas profissionais de distribuição e analytics para levar sua carreira musical ao próximo nível.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-7 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center mb-5 group-hover:glow-purple transition-all">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-28 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Distribuição para <span className="gradient-purple-text">150+ Plataformas</span>
          </h2>
          <p className="text-muted-foreground mb-14 max-w-xl mx-auto">Sua música disponível nas maiores plataformas de streaming do mundo.</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {platforms.map((p) => (
              <div key={p} className="px-5 py-3 rounded-full border border-border bg-card text-sm text-foreground font-medium hover:border-primary/40 transition-colors">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto p-16 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">Pronto para Lançar?</h2>
              <p className="text-muted-foreground mb-10 max-w-lg mx-auto">Crie sua conta e comece a distribuir sua música hoje mesmo. A partir de R$ 19,90 por lançamento.</p>
              <Button size="lg" className="gradient-purple text-primary-foreground border-0 px-10 py-6 glow-purple rounded-xl" asChild>
                <Link to="/login?tab=register">
                  Criar Conta Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
