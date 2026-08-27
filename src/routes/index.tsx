import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, Play, Trophy } from "lucide-react";

import chest from "../assets/chest.png";
import mascot from "../assets/mascot.png";
import { CandyButton } from "../components/game/CandyButton";
import { fireConfetti } from "../components/game/confetti";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyDot — La quête de ta dot en 2 minutes" },
      {
        name: "description",
        content:
          "Joue à MyDot : un mini-jeu de 9 étapes qui estime le montant de ta dot selon ton pays, ton style de mariage et tes traditions.",
      },
      { property: "og:title", content: "MyDot — La quête de ta dot" },
      {
        property: "og:description",
        content: "Gagne de l'XP, ouvre le coffre et découvre l'estimation de ta dot.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute -left-20 top-10 size-56 rounded-full bg-candy-pink/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-16 size-64 rounded-full bg-gold/30 blur-3xl" />

      <motion.img
        src={mascot}
        alt=""
        aria-hidden
        className="animate-float-y-slow absolute right-4 top-16 w-20 opacity-90 sm:w-28"
      />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <span className="level-badge mx-auto mb-6">
          <Sparkles className="size-4 fill-current" aria-hidden />
          Nouveau : saison 1
        </span>

        <img src={chest} alt="Coffre au trésor" className="animate-chest-glow animate-float-y mx-auto w-52 sm:w-60" />

        <h1 className="sticker-title mt-6 text-4xl leading-tight sm:text-5xl">
          Découvre le montant
          <br /> de ta dot 💍
        </h1>
        <p className="mt-4 text-base font-semibold text-muted-foreground">
          9 questions, plein d'XP à gagner, et un coffre à ouvrir à la fin.
        </p>

        <div className="clay mt-8 grid grid-cols-3 gap-2 p-4 text-center">
          {[
            { label: "Étapes", value: "9" },
            { label: "Durée", value: "2 min" },
            { label: "XP max", value: "135" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-xl font-extrabold text-primary">{stat.value}</div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <CandyButton
          className="mt-8 w-full"
          onClick={() => {
            void fireConfetti("pop");
            void navigate({ to: "/quiz" });
          }}
        >
          <Play className="size-5 fill-current" aria-hidden />
          Commencer la quête
        </CandyButton>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground">
          <Trophy className="size-4 text-gold" aria-hidden />
          Déjà 12 480 joueurs ont ouvert leur coffre
        </p>
      </motion.div>
    </main>
  );
}
