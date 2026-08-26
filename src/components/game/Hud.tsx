import { Heart, Star } from "lucide-react";
import { useGame, levelForXp, XP_PER_LEVEL } from "../../lib/game-store";

interface HudProps {
  stepLabel?: string;
}

/** HUD fixe façon jeu : niveau, barre XP irisée, cœurs. */
export function Hud({ stepLabel }: HudProps) {
  const { xp, hearts } = useGame();
  const level = levelForXp(xp);
  const xpInLevel = xp % XP_PER_LEVEL;
  const fillPercent = Math.min(100, (xpInLevel / XP_PER_LEVEL) * 100);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3">
      <div className="clay mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        <span className="level-badge shrink-0">
          <Star className="size-4 fill-current" aria-hidden />
          Niv. {level}
        </span>

        <div className="min-w-0 flex-1">
          <div className="xp-track" role="progressbar" aria-valuenow={xp} aria-label="Points d'expérience">
            <div className="xp-fill" style={{ width: `${fillPercent}%` }} />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-muted-foreground">
            <span>{xp} XP</span>
            {stepLabel && <span className="truncate pl-2">{stepLabel}</span>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5" aria-label={`${hearts} vies`}>
          {[0, 1, 2].map((index) => (
            <Heart
              key={index}
              className={`size-5 ${
                index < hearts
                  ? "fill-primary text-primary animate-heart-pulse"
                  : "fill-muted text-muted"
              }`}
              style={index < hearts ? { animationDelay: `${index * 0.2}s` } : undefined}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </header>
  );
}
