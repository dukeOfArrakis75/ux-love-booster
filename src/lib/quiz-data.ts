export interface QuizOption {
  value: string;
  label: string;
  emoji?: string;
}

export type StepType = "email" | "profile" | "single" | "location";

export interface QuizStep {
  key: string;
  section: string;
  title: string;
  subtitle?: string;
  type: StepType;
  options?: QuizOption[];
}

export const COUNTRIES: QuizOption[] = [
  { value: "FRANCE", label: "France", emoji: "🇫🇷" },
  { value: "MOROCCO", label: "Maroc", emoji: "🇲🇦" },
  { value: "ALGERIA", label: "Algérie", emoji: "🇩🇿" },
  { value: "TUNISIA", label: "Tunisie", emoji: "🇹🇳" },
  { value: "SENEGAL", label: "Sénégal", emoji: "🇸🇳" },
  { value: "IVORY_COAST", label: "Côte d'Ivoire", emoji: "🇨🇮" },
  { value: "BELGIUM", label: "Belgique", emoji: "🇧🇪" },
  { value: "CANADA", label: "Canada", emoji: "🇨🇦" },
  { value: "OTHER", label: "Autre", emoji: "🌍" },
];

export const CITIES: Record<string, string[]> = {
  FRANCE: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Lille", "Bordeaux", "Autre"],
  MOROCCO: ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Autre"],
  ALGERIA: ["Alger", "Oran", "Constantine", "Annaba", "Tlemcen", "Blida", "Autre"],
  TUNISIA: ["Tunis", "Sfax", "Sousse", "Monastir", "Djerba", "Autre"],
  SENEGAL: ["Dakar", "Saint-Louis", "Thiès", "Touba", "Kaolack", "Autre"],
  IVORY_COAST: ["Abidjan", "Yamoussoukro", "Bouaké", "Daloa", "San Pedro", "Autre"],
  BELGIUM: ["Bruxelles", "Bruges", "Gand", "Anvers", "Liège", "Autre"],
  CANADA: ["Montréal", "Québec", "Toronto", "Ottawa", "Vancouver", "Autre"],
  OTHER: ["Autre"],
};

export const QUIZ_STEPS: QuizStep[] = [
  {
    key: "player.email",
    section: "Pour commencer",
    title: "Ton email",
    subtitle: "Pour recevoir ton estimation, rien d'autre.",
    type: "email",
  },
  {
    key: "marriage.profile",
    section: "Ton profil",
    title: "Tu es… ?",
    subtitle: "L'interface s'adapte à ton choix.",
    type: "profile",

    options: [
      { value: "HUSBAND", label: "Le futur époux", emoji: "🤵" },
      { value: "SPOUSE", label: "La future épouse", emoji: "👰" },
    ],
  },
  {
    key: "marriage.current_country",
    section: "Ton contexte",
    title: "Tu vis actuellement où ?",
    type: "location",
  },
  {
    key: "marriage.family_origin",
    section: "Ton contexte",
    title: "Tes origines familiales viennent d'où ?",

    type: "single",
    options: COUNTRIES,
  },
  {
    key: "marriage.country",
    section: "Le grand jour",
    title: "Le mariage aura lieu où ?",
    type: "location",
  },
  {
    key: "marriage.year",
    section: "Le grand jour",
    title: "C'est prévu pour quand ?",
    type: "single",
    options: [
      { value: "2026", label: "2026", emoji: "🗓️" },
      { value: "2027", label: "2027", emoji: "🗓️" },
      { value: "2028", label: "2028", emoji: "🗓️" },
      { value: "2029", label: "2029", emoji: "🗓️" },
      { value: "2030", label: "2030", emoji: "🗓️" },
      { value: "LATER", label: "Plus tard", emoji: "⏳" },
      { value: "UNDECIDED", label: "Pas encore décidé", emoji: "🤷" },
    ],
  },
  {
    key: "marriage.style",
    section: "Le grand jour",
    title: "Quel style de mariage ?",
    type: "single",
    options: [
      { value: "CIVIL", label: "Civil", emoji: "🏛️" },
      { value: "RELIGIOUS", label: "Religieux", emoji: "⛪" },
      { value: "TRADITIONAL", label: "Traditionnel", emoji: "🥁" },
    ],
  },
  {
    key: "marriage.first_marriage",
    section: "Entre nous",
    title: "Premier mariage pour toi ?",
    type: "single",
    options: [
      { value: "YES", label: "Oui", emoji: "😇" },
      { value: "NO", label: "Non", emoji: "😅" },
      { value: "PREFER_NOT_TO_SAY", label: "Je préfère ne pas répondre", emoji: "🤐" },
    ],
  },
  {
    key: "religion.identity",
    section: "Entre nous",
    title: "Tu te reconnais dans quoi ?",
    type: "single",
    options: [
      { value: "ISLAM", label: "Islam", emoji: "☪️" },
      { value: "CHRISTIANITY", label: "Christianisme", emoji: "✝️" },
      { value: "JUDAISM", label: "Judaïsme", emoji: "✡️" },
      { value: "BUDDHISM", label: "Bouddhisme", emoji: "☸️" },
      { value: "NONE", label: "Sans religion", emoji: "🌈" },
      { value: "PREFER_NOT_TO_SAY", label: "Je préfère ne pas répondre", emoji: "🤐" },
    ],
  },
];

export function cityKeyFor(stepKey: string): string {
  return stepKey === "marriage.current_country" ? "marriage.current_city" : "marriage.city";
}

const OPTION_LABELS: Record<string, string> = Object.fromEntries(
  QUIZ_STEPS.flatMap((step) => (step.options ?? []).map((option) => [option.value, option.label])),
);

export function labelFor(value: string): string {
  return OPTION_LABELS[value] ?? value.replaceAll("_", " ");
}

/* ============ Estimation ============ */

export interface Estimation {
  amount: number;
  minimum: number;
  maximum: number;
  confidence: string;
  factors: string[];
  summary: string;
}

const BASE_BY_COUNTRY: Record<string, number> = {
  FRANCE: 12000,
  MOROCCO: 9000,
  ALGERIA: 8500,
  TUNISIA: 7000,
  SENEGAL: 6500,
  IVORY_COAST: 6000,
  BELGIUM: 11500,
  CANADA: 13000,
  OTHER: 7500,
};

const round100 = (value: number) => Math.round(value / 100) * 100;

export function computeEstimation(answers: Record<string, string | string[]>): Estimation {
  const country = String(answers["marriage.country"] ?? "OTHER");
  const style = String(answers["marriage.style"] ?? "CIVIL");
  const year = String(answers["marriage.year"] ?? "UNDECIDED");
  const firstMarriage = String(answers["marriage.first_marriage"] ?? "PREFER_NOT_TO_SAY");
  const city = String(answers["marriage.city"] ?? "");

  let amount: number = BASE_BY_COUNTRY[country] ?? BASE_BY_COUNTRY["OTHER"]!;
  const factors: string[] = [];

  factors.push(`Mariage prévu : ${labelFor(country)}${city && city !== "Autre" ? ` (${city})` : ""}`);

  if (style === "TRADITIONAL") {
    amount *= 1.3;
    factors.push("Mariage traditionnel : cérémonie souvent plus fastueuse");
  } else if (style === "RELIGIOUS") {
    amount *= 1.15;
    factors.push("Mariage religieux : traditions symboliques fortes");
  } else {
    factors.push("Mariage civil : format plus sobre");
  }

  if (year === "2026") {
    amount *= 1.05;
    factors.push("Mariage proche (2026) : demande élevée cette saison");
  }

  if (firstMarriage === "NO") {
    amount *= 0.9;
    factors.push("Second mariage : montants généralement ajustés");
  }

  amount = round100(amount);
  const minimum = round100(amount * 0.85);
  const maximum = round100(amount * 1.2);

  return {
    amount,
    minimum,
    maximum,
    confidence: "medium",
    factors,
    summary:
      "Cette estimation combine les fourchettes observées pour ton pays de mariage, le style de cérémonie et ton calendrier. Elle reste indicative : chaque famille a ses traditions, et c'est ça qui est beau.",
  };
}
