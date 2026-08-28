interface HudProps {
  stepLabel?: string;
  /** Progression de 0 à 1. */
  progress?: number;
}

/** En-tête fixe discret : barre de progression et étape courante. */
export function Hud({ stepLabel, progress = 0 }: HudProps) {
  const fillPercent = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3">
      <div className="clay mx-auto max-w-md px-4 py-3">
        <div
          className="xp-track"
          role="progressbar"
          aria-valuenow={fillPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression du questionnaire"
        >
          <div className="xp-fill" style={{ width: `${fillPercent}%` }} />
        </div>
        {stepLabel && (
          <p className="mt-1.5 text-center text-[11px] font-bold text-muted-foreground">
            {stepLabel}
          </p>
        )}
      </div>
    </header>
  );
}
