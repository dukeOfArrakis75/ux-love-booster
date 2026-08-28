import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";

import { CandyButton } from "../components/game/CandyButton";
import { Hud } from "../components/game/Hud";
import { game, useGame } from "../lib/game-store";
import { CITIES, COUNTRIES, QUIZ_STEPS, cityKeyFor, type QuizOption } from "../lib/quiz-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Le questionnaire — MyDot" },
      {
        name: "description",
        content: "Réponds aux 9 questions MyDot pour obtenir l'estimation de ta dot.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Le questionnaire — MyDot" },
      { property: "og:description", content: "9 questions et une estimation personnalisée à la clé." },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Le questionnaire — MyDot" },
      { name: "twitter:description", content: "9 questions et une estimation personnalisée à la clé." },
    ],
  }),
  component: Quiz,
});

const LETTERS = "ABCDEFGHIJ";

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

  const options: QuizOption[] = step.type === "location" ? COUNTRIES : (step.options ?? []);

  return (
    <div className="min-h-screen px-4 pb-28 pt-24">
      <Hud
        stepLabel={`Question ${index + 1} sur ${QUIZ_STEPS.length}`}
        sectionLabel={step.section}
        progress={(index + 1) / QUIZ_STEPS.length}
      />

      <AnimatePresence mode="wait">
        <motion.section
          key={step.key}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="clay p-5">
            <h1 className="font-display text-[22px] font-extrabold leading-snug sm:text-2xl">
              {step.title}
            </h1>
            {step.subtitle && (
              <p className="mt-2 text-[13px] font-semibold text-muted-foreground">{step.subtitle}</p>
            )}
          </div>

          <div className="mt-4 space-y-2.5">
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
                <p className="flex items-center gap-1.5 px-1 text-xs font-semibold text-muted-foreground">
                  <Lock className="size-3.5" aria-hidden />
                  Confidentiel. Aucun spam, uniquement ton résultat.
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
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: optionIndex * 0.035 }}
                    onClick={() => pick(option.value)}
                    className={`option-clay ${selected ? "option-clay-selected" : ""}`}
                  >
                    <span
                      aria-hidden
                      className={`grid size-8 shrink-0 place-items-center rounded-full font-display text-[13px] font-extrabold ${
                        selected
                          ? "bg-card/25 text-current"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {LETTERS[optionIndex] ?? "•"}
                    </span>
                    <span className="flex-1">
                      {option.emoji && (
                        <span className="mr-2" aria-hidden>
                          {option.emoji}
                        </span>
                      )}
                      {option.label}
                    </span>
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

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-muted-foreground">
            <Lock className="size-3.5" aria-hidden />
            Tes réponses restent privées
          </p>
        </motion.section>
      </AnimatePresence>

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
            {isLast ? "Voir mon estimation" : "Continuer"}
            <ArrowRight className="size-5" aria-hidden />
          </CandyButton>
        </div>
      </div>
    </div>
  );
}
