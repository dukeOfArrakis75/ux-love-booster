interface HudProps {
  stepLabel?: string;
  sectionLabel?: string;
  /** Progression de 0 à 1. */
  progress?: number;
}

/** En-tête fixe discret : barre de progression, étape courante et pourcentage. */
export function Hud({ stepLabel, sectionLabel, progress = 0 }: HudProps) {
  const fillPercent = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-background/85 px-3 pb-2 pt-3 backdrop-blur">
      <div className="mx-auto max-w-md">
        <div className="mb-1.5 flex items-baseline justify-between px-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">
            {stepLabel}
          </p>
          <p className="font-display text-[11px] font-extrabold text-primary">{fillPercent}%</p>
        </div>
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
        {sectionLabel && (
          <p className="mt-1.5 px-1 text-[11px] font-bold text-muted-foreground">{sectionLabel}</p>
        )}
      </div>
    </header>
  );
}
