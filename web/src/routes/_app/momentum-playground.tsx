import type { ImportanceLevel, MomentumInputDay } from "@sdk/core/momentum";
import { createFileRoute } from "@tanstack/react-router";
import { computeMomentumSnapshotFromInputDays, isSnapshotCalibrating, type MomentumSnapshot } from "@web/namespaces/momentum/model";
import { addDays, format } from "date-fns";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { TooltipProps } from "recharts";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DEFAULT_WINDOW_DAYS = 10;
const DEFAULT_DAILY_TARGET = 300;

const IMPORTANCE_LEVELS: ImportanceLevel[] = ["trivial", "normal", "important", "critical"];
const IMPORTANCE_LABEL: Record<ImportanceLevel, string> = {
  trivial: "Trivial",
  normal: "Normal",
  important: "Important",
  critical: "Critical"
};

interface TaskMatrix extends Record<ImportanceLevel, number> { }

interface MomentumEntry {
  day: string;
  xp: number;
  habitTarget: number;
  habitCount: number;
  tasksPlanned: TaskMatrix;
  tasksCompleted: TaskMatrix;
  microTaskCount: number;
  focusInput: string;
}

interface SanitizedEntry {
  day: string;
  xp: number;
  habitTarget: number;
  habitCount: number;
  tasksPlanned: TaskMatrix;
  tasksCompleted: TaskMatrix;
  microTaskCount: number;
  focusBlocks: number[];
}

interface DomainToggles {
  xp: boolean;
  habits: boolean;
  tasks: boolean;
  focus: boolean;
}

export const Route = createFileRoute("/_app/momentum-playground" as const)({
  component: MomentumPlaygroundRoute
});

function createTaskMatrix(seed: Partial<TaskMatrix> = {}): TaskMatrix {
  const matrix: TaskMatrix = {
    trivial: 0,
    normal: 0,
    important: 0,
    critical: 0
  };
  for (const level of IMPORTANCE_LEVELS) {
    matrix[level] = Math.max(0, Math.round(seed[level] ?? 0));
  }
  return matrix;
}

function clamped(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

function toInteger(value: number): number {
  return Math.round(clamped(value));
}

function parseFocusInput(value: string): number[] {
  return value
    .split(/[\s,]+/)
    .map(Number)
    .filter(num => Number.isFinite(num) && num > 0)
    .map(num => Math.round(num));
}

function sanitizeTaskMatrix(matrix: TaskMatrix): TaskMatrix {
  const out: TaskMatrix = createTaskMatrix();
  for (const level of IMPORTANCE_LEVELS) {
    out[level] = toInteger(matrix[level] ?? 0);
  }
  return out;
}

function sanitizeEntry(entry: MomentumEntry): SanitizedEntry | undefined {
  const day = entry.day.trim();
  if (!day) return undefined;
  return {
    day,
    xp: clamped(entry.xp),
    habitTarget: clamped(entry.habitTarget),
    habitCount: clamped(entry.habitCount),
    tasksPlanned: sanitizeTaskMatrix(entry.tasksPlanned),
    tasksCompleted: sanitizeTaskMatrix(entry.tasksCompleted),
    microTaskCount: toInteger(entry.microTaskCount),
    focusBlocks: parseFocusInput(entry.focusInput)
  };
}

function expandTaskMatrix(matrix: TaskMatrix) {
  const items: { importance: ImportanceLevel }[] = [];
  for (const level of IMPORTANCE_LEVELS) {
    const count = matrix[level];
    for (let i = 0; i < count; i++) {
      items.push({ importance: level });
    }
  }
  return items;
}

function buildInputDays(entries: SanitizedEntry[], domains: DomainToggles): MomentumInputDay[] {
  return entries.map(entry => {
    const day: MomentumInputDay = { day: entry.day };
    if (domains.habits && entry.habitTarget > 0) {
      day.habits = {
        target: Math.max(1, Math.round(entry.habitTarget)),
        count: Math.round(entry.habitCount),
        reached: entry.habitCount >= entry.habitTarget && entry.habitTarget > 0
      };
    }
    if (domains.tasks) {
      day.tasks = {
        planned: expandTaskMatrix(entry.tasksPlanned),
        completed: expandTaskMatrix(entry.tasksCompleted),
        microTaskCount: entry.microTaskCount
      };
    }
    if (domains.focus) {
      const blocks = entry.focusBlocks.map(minutes => ({ minutes }));
      day.focus = blocks.length ? { deepBlocks: blocks } : undefined;
    }
    if (domains.xp) {
      day.xp = { xpGained: Math.round(entry.xp) };
    }
    return day;
  });
}

function formatFocusBlocks(blocks: number[]): string {
  if (!blocks.length) return "";
  return blocks.join(", ");
}

function randomTaskMatrix(max = 3): TaskMatrix {
  return createTaskMatrix({
    trivial: Math.round(Math.random() * max * 0.5),
    normal: Math.round(Math.random() * max),
    important: Math.round(Math.random() * (max - 1)),
    critical: Math.round(Math.random() * (max > 2 ? 1 : 0))
  });
}

function randomizeEntry(entry: MomentumEntry): MomentumEntry {
  const planned = randomTaskMatrix();
  const completedSeed: Partial<TaskMatrix> = {};
  for (const level of IMPORTANCE_LEVELS) {
    const plannedCount = planned[level];
    const upper = plannedCount + Math.round(Math.random());
    completedSeed[level] = Math.max(0, Math.min(upper, Math.round(plannedCount * (0.5 + Math.random() * 0.6))));
  }
  const completed = createTaskMatrix(completedSeed);
  const focusBlocks = Math.random() > 0.5
    ? Array.from({ length: 1 + Math.round(Math.random()) }, () => 30 + Math.round(Math.random() * 35))
    : [];
  return {
    ...entry,
    xp: Math.round(Math.max(40, entry.habitTarget * (0.4 + Math.random() * 1.2))),
    habitCount: Math.round(entry.habitTarget * (0.4 + Math.random() * 1.1)),
    tasksPlanned: planned,
    tasksCompleted: completed,
    microTaskCount: Math.round(Math.random() * 4),
    focusInput: formatFocusBlocks(focusBlocks)
  };
}

function buildDefaultEntry(offset: number, dailyTarget: number): MomentumEntry {
  const day = format(addDays(new Date(), -offset), "yyyy-MM-dd");
  const planned = createTaskMatrix({
    trivial: Math.round(Math.random() * 1),
    normal: 2,
    important: offset % 2 === 0 ? 1 : 0,
    critical: offset % 3 === 0 ? 1 : 0
  });
  const completed = createTaskMatrix({
    trivial: Math.max(0, planned.trivial - 1 + Math.round(Math.random())),
    normal: Math.max(0, planned.normal - 1),
    important: Math.max(0, planned.important - 1)
  });
  const focusBlocks = offset % 3 === 0 ? [50, 30] : [45];
  return {
    day,
    xp: Math.round(dailyTarget * (0.7 + Math.random() * 0.4)),
    habitTarget: dailyTarget,
    habitCount: Math.round(dailyTarget * (0.6 + Math.random() * 0.5)),
    tasksPlanned: planned,
    tasksCompleted: completed,
    microTaskCount: Math.round(Math.random() * 3),
    focusInput: formatFocusBlocks(focusBlocks)
  };
}

function buildDefaultEntries(): MomentumEntry[] {
  return Array.from({ length: DEFAULT_WINDOW_DAYS }).map((_, idx) => buildDefaultEntry(idx, DEFAULT_DAILY_TARGET));
}

function useMomentumPlaygroundState() {
  const [windowDays, setWindowDays] = useState<number>(DEFAULT_WINDOW_DAYS);
  const [dailyTarget, setDailyTarget] = useState<number>(DEFAULT_DAILY_TARGET);
  const [entries, setEntries] = useState<MomentumEntry[]>(buildDefaultEntries);
  const [domains, setDomains] = useState<DomainToggles>({ xp: true, habits: true, tasks: true, focus: true });

  const sanitizedEntries = useMemo(() => {
    return entries
      .map(sanitizeEntry)
      .filter((value): value is SanitizedEntry => Boolean(value))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [entries]);

  const inputDays = useMemo(() => buildInputDays(sanitizedEntries, domains), [sanitizedEntries, domains]);

  const canCompute = inputDays.length > 0 && windowDays > 0;

  const { snapshot, error } = useMemo(() => {
    if (!canCompute) {
      return {
        snapshot: undefined as MomentumSnapshot | undefined,
        error: "Provide at least one valid day and a window greater than zero to compute momentum."
      };
    }
    try {
      const result = computeMomentumSnapshotFromInputDays(inputDays, { options: { windowDays } });
      return { snapshot: result, error: undefined as string | undefined };
    } catch (err) {
      return {
        snapshot: undefined,
        error: err instanceof Error ? err.message : "Failed to compute momentum"
      };
    }
  }, [canCompute, inputDays, windowDays]);

  function toggleDomain(key: keyof DomainToggles, value: boolean) {
    setDomains(prev => ({ ...prev, [key]: value }));
  }

  return {
    windowDays,
    setWindowDays,
    dailyTarget,
    setDailyTarget,
    entries,
    setEntries,
    domains,
    toggleDomain,
    snapshot,
    error,
    canCompute,
    sanitizedEntries
  };
}

function Stat({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-background p-3">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
      {helper ? <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{helper}</span> : null}
    </div>
  );
}

function DomainToggle({
  label,
  helper,
  checked,
  onChange
}: {
  label: string;
  helper: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer flex-col gap-0.5 rounded-lg border px-3 py-2 text-xs transition-colors hover:bg-muted/40">
      <span className="flex items-center justify-between font-semibold uppercase tracking-wide">
        {label}
        <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="h-3 w-3" />
      </span>
      <span className="text-[10px] text-muted-foreground">{helper}</span>
    </label>
  );
}

function TaskMatrixEditor({
  title,
  matrix,
  onChange,
  disabled
}: {
  title: string;
  matrix: TaskMatrix;
  onChange: (importance: ImportanceLevel, value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {IMPORTANCE_LEVELS.map(level => (
          <label key={level} className="flex flex-col gap-1 text-xs">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{IMPORTANCE_LABEL[level]}</span>
            <input
              className="rounded border bg-background px-2 py-1 font-mono"
              type="number"
              min={0}
              value={matrix[level] ?? 0}
              onChange={event => onChange(level, Number(event.target.value))}
              disabled={disabled}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function MomentumTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const [point] = payload;
  if (!point) return null;
  const scoreSource = point.value;
  const scoreValue = typeof scoreSource === "number" ? scoreSource : Number(scoreSource ?? 0);
  const rawSource = point.payload && typeof point.payload === "object" ? (point.payload as { raw?: number }).raw : undefined;
  const rawValue = typeof rawSource === "number" ? rawSource : 0;

  return (
    <div className="rounded-md border border-muted/40 bg-background/95 p-3 text-xs shadow-lg backdrop-blur">
      <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 flex flex-col gap-0.5 font-medium">
        <span>Score {scoreValue.toFixed(1)}</span>
        <span className="text-muted-foreground">Raw {(rawValue * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}

function MomentumHistoryChart({ history }: { history: MomentumSnapshot["history"] }) {
  if (history.length === 0) return null;

  const data = history.map(point => ({
    day: point.day,
    score: point.score,
    raw: point.raw
  }));
  const gradientId = "momentumScoreGradient";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip content={<MomentumTooltip />} cursor={{ stroke: "rgba(148, 163, 184, 0.35)", strokeWidth: 1 }} />
        <ReferenceLine y={40} stroke="rgba(248, 113, 113, 0.5)" strokeDasharray="4 4" />
        <ReferenceLine y={70} stroke="rgba(34, 197, 94, 0.45)" strokeDasharray="4 4" />
        <ReferenceLine y={86} stroke="rgba(14, 165, 233, 0.45)" strokeDasharray="4 4" />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#22c55e"
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={{ r: 2.5, strokeWidth: 1, stroke: "#15803d", fill: "#bbf7d0" }}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MomentumDayCard({
  entry,
  onChange,
  onRemove,
  disabledRemove,
  domains
}: {
  entry: MomentumEntry;
  onChange: (updater: (current: MomentumEntry) => MomentumEntry) => void;
  onRemove: () => void;
  disabledRemove: boolean;
  domains: DomainToggles;
}) {
  return (
    <div className="space-y-3 rounded-lg border bg-background p-3">
      <div className="flex items-end gap-3">
        <label className="flex flex-1 flex-col gap-1 text-xs">
          <span className="uppercase tracking-wide text-muted-foreground">Day (ISO)</span>
          <input
            className="rounded border bg-background px-3 py-2 font-mono"
            value={entry.day}
            onChange={event => onChange(current => ({ ...current, day: event.target.value }))}
          />
        </label>
        <button
          type="button"
          className="rounded border px-3 py-2 text-xs uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onRemove}
          disabled={disabledRemove}
        >
          Remove
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs">
          <span className="uppercase tracking-wide text-muted-foreground">XP Gained</span>
          <input
            className="rounded border bg-background px-3 py-2 font-mono"
            type="number"
            min={0}
            value={entry.xp}
            onChange={event => onChange(current => ({ ...current, xp: Number(event.target.value) }))}
            disabled={!domains.xp}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="uppercase tracking-wide text-muted-foreground">Micro Tasks</span>
          <input
            className="rounded border bg-background px-3 py-2 font-mono"
            type="number"
            min={0}
            value={entry.microTaskCount}
            onChange={event => onChange(current => ({ ...current, microTaskCount: Number(event.target.value) }))}
            disabled={!domains.tasks}
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs">
          <span className="uppercase tracking-wide text-muted-foreground">Habit Target</span>
          <input
            className="rounded border bg-background px-3 py-2 font-mono"
            type="number"
            min={0}
            value={entry.habitTarget}
            onChange={event => onChange(current => ({ ...current, habitTarget: Number(event.target.value) }))}
            disabled={!domains.habits}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="uppercase tracking-wide text-muted-foreground">Habit Count</span>
          <input
            className="rounded border bg-background px-3 py-2 font-mono"
            type="number"
            min={0}
            value={entry.habitCount}
            onChange={event => onChange(current => ({ ...current, habitCount: Number(event.target.value) }))}
            disabled={!domains.habits}
          />
        </label>
      </div>

      <TaskMatrixEditor
        title="Planned Tasks"
        matrix={entry.tasksPlanned}
        onChange={(level, value) => onChange(current => ({
          ...current,
          tasksPlanned: { ...current.tasksPlanned, [level]: value }
        }))}
        disabled={!domains.tasks}
      />

      <TaskMatrixEditor
        title="Completed Tasks"
        matrix={entry.tasksCompleted}
        onChange={(level, value) => onChange(current => ({
          ...current,
          tasksCompleted: { ...current.tasksCompleted, [level]: value }
        }))}
        disabled={!domains.tasks}
      />

      <label className="flex flex-col gap-1 text-xs">
        <span className="uppercase tracking-wide text-muted-foreground">Focus Blocks (minutes, comma separated)</span>
        <input
          className="rounded border bg-background px-3 py-2 font-mono"
          value={entry.focusInput}
          onChange={event => onChange(current => ({ ...current, focusInput: event.target.value }))}
          placeholder="45, 30"
          disabled={!domains.focus}
        />
      </label>
    </div>
  );
}

function MomentumConfiguration({
  windowDays,
  setWindowDays,
  dailyTarget,
  setDailyTarget,
  entries,
  setEntries,
  domains,
  toggleDomain
}: {
  windowDays: number;
  setWindowDays: Dispatch<SetStateAction<number>>;
  dailyTarget: number;
  setDailyTarget: Dispatch<SetStateAction<number>>;
  entries: MomentumEntry[];
  setEntries: Dispatch<SetStateAction<MomentumEntry[]>>;
  domains: DomainToggles;
  toggleDomain: (key: keyof DomainToggles, value: boolean) => void;
}) {
  function updateEntry(index: number, updater: (current: MomentumEntry) => MomentumEntry) {
    setEntries(prev => prev.map((entry, idx) => (idx === index ? updater(entry) : entry)));
  }

  function addEntry() {
    const last = entries[entries.length - 1];
    const nextDay = last ? format(addDays(new Date(last.day), -1), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
    setEntries(prev => {
      const base = buildDefaultEntry(0, dailyTarget);
      const next = [...prev, { ...base, day: nextDay }];
      return next;
    });
  }

  function removeEntry(index: number) {
    setEntries(prev => prev.filter((_, idx) => idx !== index));
  }

  function randomizeAll() {
    setEntries(prev => prev.map(randomizeEntry));
  }

  function applyDailyTargetToHabits() {
    setEntries(prev => prev.map(entry => ({ ...entry, habitTarget: dailyTarget })));
  }

  function resetAll() {
    setWindowDays(DEFAULT_WINDOW_DAYS);
    setDailyTarget(DEFAULT_DAILY_TARGET);
    setEntries(buildDefaultEntries());
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs">
          <span className="uppercase tracking-wide text-muted-foreground">Daily Target (XP & Habit)</span>
          <input
            className="rounded border bg-background px-3 py-2 font-mono"
            type="number"
            min={1}
            value={dailyTarget}
            onChange={event => setDailyTarget(Math.max(1, Number(event.target.value)))}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="uppercase tracking-wide text-muted-foreground">Window Days</span>
          <input
            className="rounded border bg-background px-3 py-2 font-mono"
            type="number"
            min={1}
            value={windowDays}
            onChange={event => setWindowDays(Math.max(1, Number(event.target.value)))}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <button type="button" className="rounded border px-3 py-2" onClick={addEntry}>
          Add Day
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={randomizeAll}>
          Randomize All
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={applyDailyTargetToHabits}>
          Apply Target to Habits
        </button>
        <button type="button" className="rounded border px-3 py-2" onClick={resetAll}>
          Reset Defaults
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <DomainToggle
          label="XP"
          helper="XP history contributes to habit attainment and consistency"
          checked={domains.xp}
          onChange={value => toggleDomain("xp", value)}
        />
        <DomainToggle
          label="Habits"
          helper="Targets vs counts drive the habits factor"
          checked={domains.habits}
          onChange={value => toggleDomain("habits", value)}
        />
        <DomainToggle
          label="Tasks"
          helper="Planned vs completed tasks feed task quality"
          checked={domains.tasks}
          onChange={value => toggleDomain("tasks", value)}
        />
        <DomainToggle
          label="Focus"
          helper="Deep-focus blocks power the focus factor"
          checked={domains.focus}
          onChange={value => toggleDomain("focus", value)}
        />
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <MomentumDayCard
            key={entry.day + index}
            entry={entry}
            onChange={updater => updateEntry(index, updater)}
            onRemove={() => removeEntry(index)}
            disabledRemove={entries.length === 1}
            domains={domains}
          />
        ))}
      </div>
    </div>
  );
}

function CoverageInsights({ snapshot }: { snapshot: MomentumSnapshot }) {
  const missing = snapshot.missingDomains ? Object.keys(snapshot.missingDomains) : [];
  return (
    <div className="space-y-2 rounded-lg border bg-background p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
        <span>Coverage Detail</span>
        <span className="font-mono">
          {snapshot.coverage ? `${snapshot.coverage.observed}/${snapshot.coverage.expected}` : "0/0"} observed
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded border border-muted/40 p-2 text-[11px] font-mono">
          Ratio: {snapshot.coverage ? (snapshot.coverage.ratio * 100).toFixed(1) : "0.0"}%
          <br />
          Effective: {snapshot.coverage ? (snapshot.coverage.effectiveRatio * 100).toFixed(1) : "0.0"}%
        </div>
        <div className="rounded border border-muted/40 p-2 text-[11px] font-mono">
          Confidence: {snapshot.confidence !== undefined ? (snapshot.confidence * 100).toFixed(1) : "—"}%
          <br />
          Imputed: {snapshot.imputedFactors?.length ?? 0}
        </div>
      </div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        Missing Domains: {missing.length ? missing.join(", ") : "None"}
      </div>
      {snapshot.imputedFactors?.length ? (
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Neutral Imputed: {snapshot.imputedFactors.join(", ")}
        </div>
      ) : null}
    </div>
  );
}

function MomentumSnapshotView({ snapshot }: { snapshot: MomentumSnapshot }) {
  const calibrating = isSnapshotCalibrating(snapshot);
  const history = [...snapshot.history].sort((a, b) => a.day.localeCompare(b.day));

  return (
    <div className="space-y-4">
      {calibrating ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-500">
          Calibration in progress — add more days or activate more domains for higher confidence.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Momentum Score" value={snapshot.score.toFixed(1)} helper={snapshot.bands.label} />
        <Stat
          label="Trend"
          value={`${(snapshot.trend * 100).toFixed(1)}%`}
          helper={`${snapshot.trendDirection.toUpperCase()} (${snapshot.trendLabel})`}
        />
        <Stat label="Raw" value={snapshot.raw.toFixed(3)} helper="Composite" />
        <Stat
          label="Coverage"
          value={snapshot.coverage ? `${Math.round(snapshot.coverage.ratio * 100)}%` : "—"}
          helper={snapshot.coverage ? `${snapshot.coverage.observed}/${snapshot.coverage.expected} observed` : "Missing"}
        />
      </div>

      <CoverageInsights snapshot={snapshot} />

      <div className="space-y-2 rounded-lg border bg-background p-4">
        <div className="text-sm font-medium">Narrative</div>
        <p className="text-sm leading-relaxed text-muted-foreground">{snapshot.explanation.summary}</p>
        <div className="text-xs font-mono text-muted-foreground">
          Band: {snapshot.bands.slug} · Recovery: {snapshot.states.recovery ? "yes" : "no"} · Risk: {snapshot.states.risk ? "yes" : "no"}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border bg-background p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Factor Strengths</h3>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Weight · Value</span>
          </div>
          <div className="space-y-2">
            {snapshot.explanation.factors.map(factor => (
              <div key={factor.key} className="flex flex-col gap-1 rounded border border-muted/40 p-2">
                <div className="flex items-center justify-between text-xs font-semibold uppercase">
                  <span>{factor.label}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {factor.weight.toFixed(2)} · {factor.value.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{factor.message}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-lg border bg-background p-4">
          <h3 className="text-sm font-semibold">Recommendations</h3>
          {snapshot.explanation.recommendations.length === 0 ? (
            <p className="text-xs text-muted-foreground">No recommendations right now — your data looks balanced.</p>
          ) : (
            <ul className="space-y-2">
              {snapshot.explanation.recommendations.map(rec => (
                <li key={rec.code} className="rounded border border-muted/40 p-2">
                  <div className="text-xs font-semibold uppercase tracking-wide">{rec.title}</div>
                  <div className="text-xs leading-relaxed text-muted-foreground">{rec.detail}</div>
                  {rec.actions?.length ? (
                    <div className="mt-1 text-[10px] font-mono uppercase text-emerald-500">{rec.actions.join(" · ")}</div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border bg-background p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">History</h3>
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Hover to inspect changes</span>
        </div>
        {history.length ? (
          <div className="h-56">
            <MomentumHistoryChart history={history} />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Add more days to render the history chart.</p>
        )}
        {history.length ? (
          <p className="text-[11px] text-muted-foreground">
            Hover the chart to inspect daily momentum scores; dashed lines mark band thresholds at 40, 70, and 86.
          </p>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2">Day</th>
                <th className="pb-2">Raw</th>
                <th className="pb-2">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map(point => (
                <tr key={point.day}>
                  <td className="py-1 font-mono text-[12px]">{point.day}</td>
                  <td className="py-1 font-mono text-[12px]">{point.raw.toFixed(3)}</td>
                  <td className="py-1 font-mono text-[12px]">{point.score.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border bg-background p-4">
        <h3 className="text-sm font-semibold">Raw Snapshot</h3>
        <pre className="max-h-80 overflow-auto rounded bg-muted/40 p-3 text-xs font-mono whitespace-pre-wrap break-all">
          {JSON.stringify(snapshot, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function MomentumPlaygroundRoute() {
  const {
    windowDays,
    setWindowDays,
    dailyTarget,
    setDailyTarget,
    entries,
    setEntries,
    domains,
    toggleDomain,
    snapshot,
    error,
    canCompute,
    sanitizedEntries
  } = useMomentumPlaygroundState();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Momentum Lab</h1>
        <p className="text-sm text-muted-foreground">
          Adjust every factor — XP, habits, tasks, and focus — to see how coverage and weights influence the momentum engine in real
          time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl border bg-background p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Configuration</h2>
          <MomentumConfiguration
            windowDays={windowDays}
            setWindowDays={setWindowDays}
            dailyTarget={dailyTarget}
            setDailyTarget={setDailyTarget}
            entries={entries}
            setEntries={setEntries}
            domains={domains}
            toggleDomain={toggleDomain}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            {sanitizedEntries.length} active days · Window {windowDays} · Domains enabled: {
              Object.entries(domains)
                .filter(([, value]) => value)
                .map(([key]) => key)
                .join(", ") || "none"
            }
          </div>
        </div>

        <div className="space-y-4">
          {!canCompute ? (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-500">
              Provide at least one valid day and a positive window to compute momentum.
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-500">{error}</div>
          ) : null}

          {snapshot ? <MomentumSnapshotView snapshot={snapshot} /> : null}
        </div>
      </div>
    </div>
  );
}
