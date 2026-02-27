export const formatCZK = (n: number) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(n);

export const InputField = ({
  label, value, onChange, suffix, min, max, step,
}: {
  label: string; value: number; onChange: (v: number) => void; suffix?: string; min?: number; max?: number; step?: number;
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step ?? 1}
        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
        inputMode="decimal"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">{suffix}</span>
      )}
    </div>
  </div>
);

export const ResultCard = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className={`rounded-xl p-3 sm:p-4 text-center ${highlight ? "gold-gradient" : "bg-secondary"}`}>
    <p className={`text-[10px] sm:text-xs mb-1 ${highlight ? "text-accent-foreground/80" : "text-muted-foreground"}`}>{label}</p>
    <p className={`text-sm sm:text-lg font-bold font-heading ${highlight ? "text-accent-foreground" : "text-foreground"}`}>{value}</p>
  </div>
);

/* Shared chart theme */
export const chartColors = {
  navy: "hsl(215 45% 22%)",
  navyFill: "hsl(215 45% 22% / 0.12)",
  gold: "hsl(38 65% 52%)",
  goldFill: "hsl(38 65% 52% / 0.12)",
  grid: "hsl(220 15% 92%)",
  muted: "hsl(220 15% 70%)",
  mutedFill: "hsl(220 15% 70% / 0.08)",
  destructive: "hsl(0 84% 60%)",
  destructiveFill: "hsl(0 84% 60% / 0.08)",
};

export const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "hsl(0 0% 100%)",
    border: "1px solid hsl(220 15% 90%)",
    borderRadius: "12px",
    boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)",
    padding: "10px 14px",
    fontSize: "13px",
  },
  labelStyle: {
    fontWeight: 600,
    marginBottom: "4px",
    color: "hsl(220 30% 15%)",
  },
};
