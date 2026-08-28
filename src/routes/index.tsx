import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, ShieldCheck, Clock, ListChecks, Star, Quote } from "lucide-react";

import chest from "../assets/chest.png";
import mascot from "../assets/mascot.png";
import { CandyButton } from "../components/game/CandyButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Test de la dot — Estime ton montant en 2 minutes | MyDot" },
      {
        name: "description",
        content:
          "Réponds à 9 questions et obtiens une estimation personnalisée du montant de ta dot selon ton pays, tes origines et ton style de mariage.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Test de la dot — MyDot" },
      {
        property: "og:description",
        content: "9 questions, 2 minutes : découvre une estimation personnalisée de ta dot.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Test de la dot — MyDot" },
      {
        name: "twitter:description",
        content: "9 questions, 2 minutes : découvre une estimation personnalisée de ta dot.",
      },
    ],
  }),
  component: Home,
});

const STEPS = [
  {
    icon: ListChecks,
    title: "Réponds à 9 questions",
    text: "Pays, origines familiales, style de cérémonie, calendrier. Tout se fait en quelques taps.",
  },
  {
    icon: Sparkles,
    title: "On analyse ton profil",
    text: "Ton contexte est comparé aux fourchettes observées pour des mariages similaires.",
  },
  {
    icon: ShieldCheck,
    title: "Reçois ton estimation",
    text: "Un montant, une fourchette basse/haute et les facteurs qui expliquent le résultat.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah, 27 ans",
    text: "On tournait en rond avec ma famille. Avoir un ordre de grandeur clair a débloqué la discussion.",
  },
  {
    name: "Yanis, 31 ans",
    text: "Fait en deux minutes dans le métro. Le détail des facteurs est ce qui m'a le plus servi.",
  },
  {
    name: "Aïcha, 24 ans",
    text: "Simple, respectueux des traditions, et zéro jugement. Je l'ai envoyé à mes cousines.",
  },
];

const FAQ = [
  {
    q: "Sur quoi repose l'estimation ?",
    a: "Sur le pays du mariage, tes origines familiales, le style de cérémonie et ton calendrier, comparés aux fourchettes couramment observées.",
  },
  {
    q: "Combien de temps ça prend ?",
    a: "Environ 2 minutes. Le questionnaire compte 9 étapes, une question par écran.",
  },
  {
    q: "Mes réponses sont-elles confidentielles ?",
    a: "Oui. Tes réponses servent uniquement à calculer ton estimation, et ton email à te l'envoyer.",
  },
  {
    q: "Est-ce que c'est un montant officiel ?",
    a: "Non, c'est une estimation indicative. Chaque famille a ses traditions et le dernier mot.",
  },
];

function Home() {
  const navigate = useNavigate();
  const start = () => void navigate({ to: "/quiz" });

  return (
    <main className="relative overflow-hidden pb-28">
      <div className="pointer-events-none absolute -left-24 top-0 size-64 rounded-full bg-candy-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-72 size-72 rounded-full bg-gold/25 blur-3xl" />

      {/* Hero */}
      <section className="relative z-10 mx-auto w-full max-w-md px-5 pb-10 pt-10 text-center">
        <span className="level-badge mx-auto mb-6">
          <Sparkles className="size-4 fill-current" aria-hidden />
          Test de la dot
        </span>

        <div className="relative">
          <motion.img
            src={mascot}
            alt=""
            aria-hidden
            className="animate-float-y-slow absolute -right-2 -top-2 w-16 opacity-90"
          />
          <motion.img
            src={chest}
            alt="Coffre au trésor"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="animate-chest-glow animate-float-y mx-auto w-44"
          />
        </div>

        <h1 className="sticker-title mt-6 text-[2rem] leading-tight sm:text-4xl">
          Quel est le montant
          <br /> de ta dot ?
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] font-semibold text-muted-foreground">
          Un test rapide et confidentiel qui estime ta dot à partir de ton pays, de tes
          origines et de ton style de mariage.
        </p>

        <CandyButton className="mt-7 w-full" onClick={start}>
          Commencer le test
          <ArrowRight className="size-5" aria-hidden />
        </CandyButton>

        <ul className="mt-5 flex items-center justify-center gap-4 text-[11px] font-bold text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" aria-hidden /> 2 minutes
          </li>
          <li className="flex items-center gap-1.5">
            <ListChecks className="size-3.5 text-primary" aria-hidden /> 9 questions
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden /> Confidentiel
          </li>
        </ul>

        <div className="clay mt-7 flex items-center justify-center gap-3 px-4 py-3">
          <div className="flex" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-4 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-[12px] font-bold text-muted-foreground">
            4,8/5 · <span className="text-foreground">12 480</span> estimations réalisées
          </p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="relative z-10 mx-auto w-full max-w-md px-5 py-8">
        <h2 className="sticker-title text-center text-xl">Comment ça marche</h2>
        <div className="mt-5 space-y-3">
          {STEPS.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06 }}
              className="clay-soft flex items-start gap-3 p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <step.icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-[15px] font-extrabold">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-1 text-[13px] font-semibold text-muted-foreground">{step.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="relative z-10 mx-auto w-full max-w-md px-5 py-8">
        <h2 className="sticker-title text-center text-xl">Ils ont fait le test</h2>
        <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.name}
              className="clay-soft w-[85%] shrink-0 snap-center p-4 text-left"
            >
              <Quote className="size-5 text-candy-pink" aria-hidden />
              <p className="mt-2 text-[13px] font-semibold text-foreground">{item.text}</p>
              <p className="mt-3 text-[12px] font-extrabold text-muted-foreground">{item.name}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 mx-auto w-full max-w-md px-5 py-8">
        <h2 className="sticker-title text-center text-xl">Questions fréquentes</h2>
        <div className="mt-5 space-y-2.5">
          {FAQ.map((item) => (
            <details key={item.q} className="clay-soft group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-[14px] font-extrabold">
                {item.q}
                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
                  aria-hidden
                />
              </summary>
              <p className="mt-2 text-[13px] font-semibold text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA sticky */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background to-transparent px-5 pb-4 pt-8">
        <div className="mx-auto max-w-md">
          <CandyButton className="w-full" onClick={start}>
            Commencer le test
            <ArrowRight className="size-5" aria-hidden />
          </CandyButton>
        </div>
      </div>
    </main>
  );
}
