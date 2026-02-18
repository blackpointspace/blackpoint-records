import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/mock-data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PlanCard = ({ plan }: { plan: typeof plans.subscriptions[0] }) => (
  <div className={`relative p-6 rounded-xl border ${plan.highlighted ? "border-primary glow-purple" : "border-border"} bg-card flex flex-col`}>
    {plan.highlighted && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-purple text-xs font-bold text-primary-foreground">
        Popular
      </div>
    )}
    <h3 className="font-display text-xl font-bold text-foreground mb-1">{plan.name}</h3>
    <div className="mb-1">
      <span className="text-3xl font-display font-bold text-foreground">{plan.price}</span>
      <span className="text-sm text-muted-foreground">{plan.period}</span>
    </div>
    <p className="text-sm text-primary font-medium mb-6">{plan.commission} comissão</p>
    <ul className="space-y-3 mb-8 flex-1">
      {plan.features.map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          {f}
        </li>
      ))}
    </ul>
    <Button className={plan.highlighted ? "gradient-purple text-primary-foreground border-0" : ""} variant={plan.highlighted ? "default" : "outline"}>
      {plan.period === "por lançamento" ? "Comprar" : "Assinar"}
    </Button>
  </div>
);

const Pricing = () => {
  const [tab, setTab] = useState<"release" | "subscription">("subscription");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-purple-text">Preços</span> Simples e Transparentes
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Escolha o plano ideal para você. Sem surpresas, sem custos escondidos.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setTab("release")}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${tab === "release" ? "gradient-purple text-primary-foreground" : "text-muted-foreground"}`}
            >
              Por Lançamento
            </button>
            <button
              onClick={() => setTab("subscription")}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${tab === "subscription" ? "gradient-purple text-primary-foreground" : "text-muted-foreground"}`}
            >
              Assinaturas Anuais
            </button>
          </div>
        </div>

        <div className={`grid gap-6 max-w-5xl mx-auto ${tab === "release" ? "grid-cols-1 md:grid-cols-2 max-w-2xl" : "grid-cols-1 md:grid-cols-3"}`}>
          {(tab === "release" ? plans.perRelease : plans.subscriptions).map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
