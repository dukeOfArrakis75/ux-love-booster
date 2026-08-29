import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { RotateCcw, Share2, CheckCircle2 } from "lucide-react";

import { CandyButton } from "../components/game/CandyButton";
import { fireConfetti } from "../components/game/confetti";
import { game, useGame } from "../lib/game-store";
import { computeEstimation } from "../lib/quiz-data";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Ton estimation — MyDot" },
      {
        name: "description",
        content: "Voici l'estimation personnalisée de ta dot, avec sa fourchette et ses facteurs.",
      },
      { property: "og:title", content: "Ton estimation — MyDot" },
      {
        property: "og:description",
        content: "J'ai découvert mon estimation MyDot : fais le test toi aussi.",
      },
    ],
  }),
  component: Result,
});

function Result() {
  const navigate = useNavigate();
  const state = useGame();
  const estimation = useMemo(() => computeEstimation(state.answers), [state.answers]);

  useEffect(() => {
    game.complete();
    void fireConfetti("pop");
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
    <main className="relative min-h-screen overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-md"
      >
        <div className="text-center">
          <span className="chip mx-auto">
            <CheckCircle2 className="size-3.5" aria-hidden />
            Estimation terminée
          </span>
          <h1 className="page-title mt-4 text-2xl">Ton estimation</h1>
        </div>

        <div className="glass-card mt-6 p-7 text-center">
          <div className="bg-gradient-to-r from-primary to-cyan-glow bg-clip-text font-display text-5xl font-extrabold tracking-tight text-transparent">
            {format(estimation.amount)}
          </div>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Fourchette : {format(estimation.minimum)} – {format(estimation.maximum)}
          </p>
        </div>

        <div className="glass-card-soft mt-5 space-y-3.5 p-6">
          <h2 className="font-display text-base font-bold tracking-tight">
            Ce qui compte dans ton calcul
          </h2>
          {estimation.factors.map((factor) => (
            <div key={factor} className="flex items-start gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span className="text-sm font-medium">{factor}</span>
            </div>
          ))}
        </div>

        <p className="mt-5 px-1 text-xs font-medium leading-relaxed text-muted-foreground">
          {estimation.summary}
        </p>

        <CandyButton className="mt-6 w-full" onClick={() => void share()}>
          <Share2 className="size-5" aria-hidden />
          Partager mon résultat
        </CandyButton>

        <button
          type="button"
          onClick={() => {
            game.reset();
            void navigate({ to: "/" });
          }}
          className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground underline underline-offset-2"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Recommencer
        </button>
      </motion.div>
    </main>
  );
}
