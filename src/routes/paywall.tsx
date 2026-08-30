import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Lock, Check, Gem } from "lucide-react";

import { CandyButton } from "../components/game/CandyButton";
import { applyProfileTheme, themeForProfile } from "../lib/theme";
import { game } from "../lib/game-store";

export const Route = createFileRoute("/paywall")({
  head: () => ({
    meta: [
      { title: "Débloque ton estimation — MyDot" },
      {
        name: "description",
        content: "Accède à ton estimation de dot personnalisée pour 4,90 €.",
      },
      { property: "og:title", content: "Débloque ton estimation — MyDot" },
      {
        property: "og:description",
        content: "Ton estimation personnalisée est prête.",
      },
    ],
  }),
  component: Paywall,
});

const PERKS = [
  "Ton montant estimé + fourchette basse/haute",
  "Les facteurs qui influencent le résultat",
  "Un récapitulatif partageable avec ta famille",
];

function Paywall() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function unlock() {
    setLoading(true);
    window.setTimeout(() => {
      game.setPaid();
      void navigate({ to: "/result" });
    }, 900);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-glow/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md text-center"
      >
        <span className="chip mx-auto">
          <Lock className="size-3.5" aria-hidden />
          Résultat prêt
        </span>

        <h1 className="page-title mt-5 text-3xl">Ton estimation est prête</h1>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Questionnaire terminé. Débloque ton résultat détaillé en un paiement unique.
        </p>

        <div className="glass-card mt-8 space-y-3.5 p-6 text-left">
          {PERKS.map((perk) => (
            <div key={perk} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Check className="size-4" aria-hidden />
              </span>
              <span className="text-sm font-semibold">{perk}</span>
            </div>
          ))}
          <div className="flex items-baseline justify-center gap-2 border-t border-border pt-4">
            <span className="font-display text-4xl font-extrabold tracking-tight">4,90 €</span>
            <span className="text-sm font-medium text-muted-foreground">paiement unique</span>
          </div>
        </div>

        <CandyButton className="mt-7 w-full" disabled={loading} onClick={unlock}>
          <Gem className="size-5" aria-hidden />
          {loading ? "Déblocage…" : "Débloquer mon estimation"}
        </CandyButton>

        <button
          type="button"
          onClick={() => navigate({ to: "/quiz" })}
          className="mt-4 text-xs font-semibold text-muted-foreground underline underline-offset-2"
        >
          Revoir mes réponses
        </button>
      </motion.div>
    </main>
  );
}
