import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { RotateCcw, Share2, Sparkles } from "lucide-react";

import mascot from "../assets/mascot.png";
import { CandyButton } from "../components/game/CandyButton";
import { fireConfetti } from "../components/game/confetti";
import { game, useGame, levelForXp } from "../lib/game-store";
import { computeEstimation } from "../lib/quiz-data";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Ton trésor — MyDot" },
      { name: "description", content: "Voici l'estimation personnalisée de ta dot, avec sa fourchette et ses facteurs." },
      { property: "og:title", content: "Ton trésor — MyDot" },
      { property: "og:description", content: "J'ai ouvert mon coffre MyDot : découvre le tien." },
    ],
  }),
  component: Result,
});

function Result() {
  const navigate = useNavigate();
  const state = useGame();
  const estimation = useMemo(() => computeEstimation(state.answers), [state.answers]);
  const level = levelForXp(state.xp);

  useEffect(() => {
    game.complete();
    void fireConfetti("treasure");
  }, []);

  const format = (value: number) => `${value.toLocaleString("fr-FR")} €`;

  async function share() {
    const text = `Ma dot estimée par MyDot : ${format(estimation.amount)} 💍`;
    try {
      if (navigator.share) await navigator.share({ title: "MyDot", text, url: window.location.origin });
      else await navigator.clipboard.writeText(`${text} — ${window.location.origin}`);
    } catch {
      /* partage annulé */
    }
  }

  return (
    <main className="min-h-screen px-5 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="mx-auto w-full max-w-md"
      >
        <div className="text-center">
          <img src={mascot} alt="" aria-hidden className="animate-wiggle mx-auto w-24" />
          <span className="level-badge mx-auto mt-3">
            <Sparkles className="size-4 fill-current" aria-hidden />
            Quête terminée · Niv. {level}
          </span>
          <h1 className="sticker-title mt-4 text-2xl">Ton estimation</h1>
        </div>

        <div className="clay mt-6 p-6 text-center">
          <div className="font-display text-5xl font-extrabold text-primary">
            {format(estimation.amount)}
          </div>
          <p className="mt-2 text-sm font-bold text-muted-foreground">
            Fourchette : {format(estimation.minimum)} – {format(estimation.maximum)}
          </p>
        </div>

        <div className="clay-soft mt-5 space-y-3 p-5">
          <h2 className="font-display text-lg font-extrabold">Ce qui compte dans ton calcul</h2>
          {estimation.factors.map((factor) => (
            <div key={factor} className="flex items-start gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-candy-pink" aria-hidden />
              <span className="text-sm font-semibold">{factor}</span>
            </div>
          ))}
        </div>

        <p className="mt-5 px-1 text-xs font-semibold leading-relaxed text-muted-foreground">
          {estimation.summary}
        </p>

        <CandyButton variant="gold" className="mt-6 w-full" onClick={() => void share()}>
          <Share2 className="size-5" aria-hidden />
          Partager mon résultat
        </CandyButton>

        <button
          type="button"
          onClick={() => {
            game.reset();
            void navigate({ to: "/" });
          }}
          className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-bold text-muted-foreground underline"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Rejouer la quête
        </button>
      </motion.div>
    </main>
  );
}
