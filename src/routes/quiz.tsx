import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";

import { CandyButton } from "../components/game/CandyButton";
import { Hud } from "../components/game/Hud";
import { game, useGame } from "../lib/game-store";
import { CITIES, COUNTRIES, QUIZ_STEPS, cityKeyFor, type QuizOption } from "../lib/quiz-data";
import { THEME_LABELS, applyProfileTheme, themeForProfile } from "../lib/theme";

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

  const theme = themeForProfile(state.answers["marriage.profile"]);

  useEffect(() => {
    applyProfileTheme(theme);
  }, [theme]);

  function goNext() {
    if (isLast) {
      void navigate({ to: "/paywall" });
      return;
    }
    setIndex((i) => i + 1);
  }

  function pick(value: string) {
    game.answer(step.key, value);
    if (step.type === "profile") applyProfileTheme(themeForProfile(value));
    if (step.type === "location") return;
    window.setTimeout(goNext, step.type === "profile" ? 520 : 320);
  }

  const canContinue =
    step.type === "email"
      ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
      : step.type === "location"
        ? Boolean(selectedCountry && selectedCity)
        : state.answers[step.key] !== undefined;

  const options: QuizOption[] = step.type === "location" ? COUNTRIES : (step.options ?? []);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-28 pt-28">
      <div className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full bg-primary/12 blur-3xl transition-colors duration-500" />

      <Hud
        stepLabel={`Question ${index + 1} sur ${QUIZ_STEPS.length}`}
        sectionLabel={step.section}
        progress={(index + 1) / QUIZ_STEPS.length}
      />

      <AnimatePresence mode="wait">
        <motion.section
          key={step.key}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="glass-card p-5">
            <h1 className="page-title text-[22px] leading-snug sm:text-2xl">{step.title}</h1>
            {step.subtitle && (
              <p className="mt-2 text-[13px] font-medium text-muted-foreground">{step.subtitle}</p>
            )}
          </div>

          <div className="mt-4 space-y-2.5">
            {step.type === "email" ? (
              <>
                <input
                  className="input-clean"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-label="Adresse email"
                />
                <p className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: optionIndex * 0.035, type: "spring", stiffness: 320, damping: 24 }}
                    onClick={() => pick(option.value)}
                    className={`option-item ${selected ? "option-item-selected" : ""}`}
                  >
                    {option.emoji ? (
                      <span className="emoji-bubble" aria-hidden>
                        {option.emoji}
                      </span>
                    ) : (
                      <span
                        aria-hidden
                        className={`emoji-bubble font-display text-[13px] font-bold ${
                          selected ? "text-current" : "text-primary"
                        }`}
                      >
                        {LETTERS[optionIndex] ?? "•"}
                      </span>
                    )}
                    <span className="flex-1">{option.label}</span>
                    {selected && <Check className="size-5 shrink-0" aria-hidden />}
                  </motion.button>
                );
              })
            )}

            {step.type === "profile" && theme && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="chip mx-auto mt-3 flex w-fit"
              >
                {THEME_LABELS[theme]} activé
              </motion.p>
            )}

            {step.type === "location" && selectedCountry && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="glass-card-soft mt-4 space-y-2.5 p-4"
              >
                <p className="text-sm font-bold">Et plus précisément ?</p>
                <div className="flex flex-wrap gap-2">
                  {(CITIES[selectedCountry] ?? ["Autre"]).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => game.answer(cityKey, city)}
                      className={`option-item w-auto px-4 py-2 text-sm ${
                        selectedCity === city ? "option-item-selected" : ""
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
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
            className="glass-card-soft grid size-14 shrink-0 place-items-center rounded-full"
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
