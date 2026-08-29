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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 px-4 pb-3 pt-3 backdrop-blur-md">
      <div className="mx-auto max-w-md">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {stepLabel}
          </p>
          <p className="font-display text-[11px] font-bold text-primary">{fillPercent}%</p>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={fillPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression du questionnaire"
        >
          <div className="progress-fill" style={{ width: `${fillPercent}%` }} />
        </div>
        {sectionLabel && (
          <p className="mt-2 text-[11px] font-semibold text-muted-foreground">{sectionLabel}</p>
        )}
      </div>
    </header>
  );
}
