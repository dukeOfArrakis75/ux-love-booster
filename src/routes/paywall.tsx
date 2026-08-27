import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Lock, Sparkles, Check } from "lucide-react";

import chest from "../assets/chest.png";
import { CandyButton } from "../components/game/CandyButton";
import { fireConfetti } from "../components/game/confetti";
import { game } from "../lib/game-store";

export const Route = createFileRoute("/paywall")({
  head: () => ({
    meta: [
      { title: "Ouvre ton coffre — MyDot" },
      { name: "description", content: "Débloque ton estimation de dot personnalisée pour 4,90 € et ouvre ton coffre." },
      { property: "og:title", content: "Ouvre ton coffre — MyDot" },
      { property: "og:description", content: "Ton estimation personnalisée t'attend dans le coffre." },
    ],
  }),
  component: Paywall,
});

const PERKS = [
  "Ton montant estimé + fourchette basse/haute",
  "Les facteurs qui font monter ou baisser la dot",
  "Un récap partageable avec ta famille",
];

function Paywall() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function unlock() {
    setLoading(true);
    window.setTimeout(() => {
      game.setPaid();
      void fireConfetti("treasure");
      void navigate({ to: "/result" });
    }, 900);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="relative mx-auto w-52">
          <img src={chest} alt="Coffre verrouillé" className="animate-float-y w-full" />
          <span className="clay-soft absolute -right-2 bottom-2 grid size-12 place-items-center">
            <Lock className="size-5 text-primary" aria-hidden />
          </span>
        </div>

        <h1 className="sticker-title mt-6 text-3xl">Ton coffre est prêt !</h1>
        <p className="mt-3 text-sm font-bold text-muted-foreground">
          Quête terminée 🎉 Débloque ton estimation personnalisée.
        </p>

        <div className="clay mt-7 space-y-3 p-5 text-left">
          {PERKS.map((perk) => (
            <div key={perk} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint">
                <Check className="size-4 text-foreground" aria-hidden />
              </span>
              <span className="text-sm font-bold">{perk}</span>
            </div>
          ))}
          <div className="flex items-baseline justify-center gap-2 pt-2">
            <span className="font-display text-4xl font-extrabold text-primary">4,90 €</span>
            <span className="text-sm font-bold text-muted-foreground">une seule fois</span>
          </div>
        </div>

        <CandyButton variant="gold" className="mt-7 w-full" disabled={loading} onClick={unlock}>
          <Sparkles className="size-5 fill-current" aria-hidden />
          {loading ? "Ouverture…" : "Ouvrir le coffre"}
        </CandyButton>

        <button
          type="button"
          onClick={() => navigate({ to: "/quiz" })}
          className="mt-4 text-xs font-bold text-muted-foreground underline"
        >
          Revoir mes réponses
        </button>
      </motion.div>
    </main>
  );
}
