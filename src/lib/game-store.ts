import { useSyncExternalStore } from "react";

export type AnswerValue = string | string[];

export interface GameState {
  email: string;
  answers: Record<string, AnswerValue>;
  xp: number;
  hearts: number;
  paid: boolean;
  completed: boolean;
}

const STORAGE_KEY = "mydot.quest.v1";

const initialState: GameState = {
  email: "",
  answers: {},
  xp: 0,
  hearts: 3,
  paid: false,
  completed: false,
};

export const XP_PER_ANSWER = 15;
export const XP_PER_LEVEL = 45;
export const levelForXp = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

function load(): GameState {
  try {
    if (typeof window === "undefined") return initialState;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...(JSON.parse(raw) as Partial<GameState>) } : initialState;
  } catch {
    return initialState;
  }
}

let state: GameState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* stockage indisponible */
  }
}

function setState(patch: Partial<GameState>) {
  state = { ...state, ...patch };
  persist();
  listeners.forEach((listener) => listener());
}

export const game = {
  get: (): GameState => state,
  subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  setEmail(email: string) {
    setState({ email });
  },
  /** Enregistre une réponse. Retourne true si c'est une nouvelle réponse (XP gagné). */
  answer(key: string, value: AnswerValue): boolean {
    const alreadyAnswered = state.answers[key] !== undefined;
    setState({
      answers: { ...state.answers, [key]: value },
      xp: alreadyAnswered ? state.xp : state.xp + XP_PER_ANSWER,
    });
    return !alreadyAnswered;
  },
  setPaid() {
    setState({ paid: true });
  },
  complete() {
    setState({ completed: true });
  },
  reset() {
    state = { ...initialState };
    persist();
    listeners.forEach((listener) => listener());
  },
};

export function useGame(): GameState {
  return useSyncExternalStore(game.subscribe, game.get, () => initialState);
}
