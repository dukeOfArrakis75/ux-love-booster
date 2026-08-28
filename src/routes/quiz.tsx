import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { CandyButton } from "../components/game/CandyButton";
import { Hud } from "../components/game/Hud";
import { game, useGame } from "../lib/game-store";
import { CITIES, COUNTRIES, QUIZ_STEPS, cityKeyFor, type QuizOption } from "../lib/quiz-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "La quête — MyDot" },
      { name: "description", content: "Réponds aux 9 étapes de la quête MyDot et gagne de l'XP à chaque réponse." },
      { property: "og:title", content: "La quête — MyDot" },
      { property: "og:description", content: "9 étapes, de l'XP et un coffre au trésor à la clé." },
    ],
  }),
  component: Quiz,
});

function Quiz() {
  const navigate = useNavigate();
  const state = useGame();
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState(state.email);

  const step = QUIZ_STEPS[index]!;
  const isLast = index === QUIZ_STEPS.length - 1;
  const cityKey = cityKeyFor(step.key);
  const selectedCountry = String(state.answers[step.key] ?? "");
  const selectedCity = String(state.answers[cityKey] ?? "");

  function goNext() {
    if (isLast) {
      void navigate({ to: "/paywall" });
      return;
    }
    setIndex((i) => i + 1);
  }

  function pick(value: string) {
    game.answer(step.key, value);
    if (step.type === "location") return;
    window.setTimeout(goNext, 320);
  }

  const canContinue =
    step.type === "email"
      ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
      : step.type === "location"
        ? Boolean(selectedCountry && selectedCity)
        : state.answers[step.key] !== undefined;

  const options: QuizOption[] =
    step.type === "location" ? COUNTRIES : (step.options ?? []);

  return (
    <div className="min-h-screen px-4 pb-28 pt-24">
      <Hud
        stepLabel={`${index + 1}/${QUIZ_STEPS.length} · ${step.section}`}
        progress={(index + 1) / QUIZ_STEPS.length}
      />

      <AnimatePresence mode="wait">
        <motion.section
          key={step.key}
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="mx-auto w-full max-w-md"
        >
          <h1 className="sticker-title text-2xl leading-snug sm:text-3xl">{step.title}</h1>
          {step.subtitle && (
            <p className="mt-2 text-sm font-bold text-muted-foreground">{step.subtitle}</p>
          )}

          <div className="mt-6 space-y-3">
            {step.type === "email" ? (
              <>
                <input
                  className="clay-input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-label="Adresse email"
                />
                <p className="px-1 text-xs font-semibold text-muted-foreground">
                  Zéro spam, promis. Juste ton résultat 🍬
                </p>
              </>
            ) : (
              options.map((option, optionIndex) => {
                const selected =
                  step.type === "location"
                    ? selectedCountry === option.value
                    : state.answers[step.key] === option.value;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: optionIndex * 0.04 }}
                    onClick={() => pick(option.value)}
                    className={`option-clay ${selected ? "option-clay-selected" : ""}`}
                  >
                    <span className="text-2xl" aria-hidden>
                      {option.emoji ?? "✨"}
                    </span>
                    <span className="flex-1">{option.label}</span>
                    {selected && <Check className="size-5 shrink-0" aria-hidden />}
                  </motion.button>
                );
              })
            )}

            {step.type === "location" && selectedCountry && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="clay-soft mt-4 space-y-2 p-4"
              >
                <p className="text-sm font-extrabold">Et plus précisément ?</p>
                <div className="flex flex-wrap gap-2">
                  {(CITIES[selectedCountry] ?? ["Autre"]).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => game.answer(cityKey, city)}
                      className={`option-clay w-auto px-4 py-2 text-sm ${
                        selectedCity === city ? "option-clay-selected" : ""
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
      </AnimatePresence>

      {xpToast > 0 && (
        <span
          key={xpToast}
          className="animate-xp-pop pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2 font-display text-2xl font-extrabold text-primary"
        >
          +{XP_PER_ANSWER} XP
        </span>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background to-transparent px-4 pb-5 pt-8">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            onClick={() => (index === 0 ? navigate({ to: "/" }) : setIndex((i) => i - 1))}
            className="clay-soft grid size-14 shrink-0 place-items-center"
            aria-label="Étape précédente"
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <CandyButton
            className="flex-1"
            disabled={!canContinue}
            onClick={() => {
              if (step.type === "email") {
                game.setEmail(email);
                game.answer(step.key, email);
              }
              goNext();
            }}
          >
            {isLast ? "Ouvrir le coffre" : "Continuer"}
            <ArrowRight className="size-5" aria-hidden />
          </CandyButton>
        </div>
      </div>
    </div>
  );
}
