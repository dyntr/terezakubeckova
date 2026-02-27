import { useState, useRef, useMemo, lazy, Suspense } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, PiggyBank, Percent, DollarSign, Wallet, Target, BarChart3, ShieldCheck, Table, ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { InputField, ResultCard, formatCZK, chartColors, chartTooltipStyle } from "./calculators/shared";

const RentaCalc = lazy(() => import("./calculators/RentaCalc"));
const RequiredRateCalc = lazy(() => import("./calculators/RequiredRateCalc"));
const RealReturnCalc = lazy(() => import("./calculators/RealReturnCalc"));
const DisabilityCalc = lazy(() => import("./calculators/DisabilityCalc"));
const AmortizationCalc = lazy(() => import("./calculators/AmortizationCalc"));

type CalcType = "mortgage" | "compound" | "savings" | "inflation" | "targetSavings" | "renta" | "requiredRate" | "realReturn" | "disability" | "amortization";

const calcTabs = [
  { id: "mortgage" as CalcType, label: "Hypotéka", icon: Calculator },
  { id: "compound" as CalcType, label: "Zhodnocení", icon: TrendingUp },
  { id: "savings" as CalcType, label: "Spoření", icon: PiggyBank },
  { id: "inflation" as CalcType, label: "Inflace", icon: Percent },
  { id: "targetSavings" as CalcType, label: "Cílové spoření", icon: DollarSign },
  { id: "renta" as CalcType, label: "Renta", icon: Wallet },
  { id: "requiredRate" as CalcType, label: "Potřebný úrok", icon: Target },
  { id: "realReturn" as CalcType, label: "Reálný výnos", icon: BarChart3 },
  { id: "disability" as CalcType, label: "Finanční rezerva", icon: ShieldCheck },
  { id: "amortization" as CalcType, label: "Splátkový kalendář", icon: Table },
];

/* ---- Inline calculators with charts ---- */

const MortgageCalc = () => {
  const [principal, setPrincipal] = useState(3000000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(30);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return { payment: principal / n, total: principal, interest: 0 };
    const payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = payment * n;
    return { payment, total, interest: total - principal };
  }, [principal, rate, years]);

  return (
    <div className="space-y-5">
      <InputField label="Výše úvěru" value={principal} onChange={setPrincipal} suffix="Kč" min={100000} step={100000} />
      <InputField label="Úroková sazba" value={rate} onChange={setRate} suffix="% p.a." min={0} max={20} step={0.1} />
      <InputField label="Doba splácení" value={years} onChange={setYears} suffix="let" min={1} max={40} />
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
        <ResultCard label="Měsíční splátka" value={formatCZK(result.payment)} highlight />
        <ResultCard label="Celkem zaplatíte" value={formatCZK(result.total)} />
        <ResultCard label="Úroky celkem" value={formatCZK(result.interest)} />
      </div>
      <div className="h-52 sm:h-56 mt-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: "Jistina", value: principal },
                { name: "Úroky", value: Math.round(result.interest) },
              ]}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={chartColors.navy} />
              <Cell fill={chartColors.gold} />
            </Pie>
            <Tooltip formatter={(v: number) => formatCZK(v)} {...chartTooltipStyle} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => <span className="text-xs text-muted-foreground ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CompoundCalc = () => {
  const [pv, setPv] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);

  const fv = useMemo(() => pv * Math.pow(1 + rate / 100, years), [pv, rate, years]);

  const chartData = useMemo(() => {
    const data = [];
    for (let y = 0; y <= years; y++) {
      data.push({ rok: y, hodnota: Math.round(pv * Math.pow(1 + rate / 100, y)) });
    }
    return data;
  }, [pv, rate, years]);

  return (
    <div className="space-y-5">
      <InputField label="Počáteční vklad" value={pv} onChange={setPv} suffix="Kč" min={0} step={10000} />
      <InputField label="Roční výnos" value={rate} onChange={setRate} suffix="%" min={0} max={30} step={0.5} />
      <InputField label="Počet let" value={years} onChange={setYears} suffix="let" min={1} max={50} />
      <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
        <ResultCard label="Budoucí hodnota" value={formatCZK(fv)} highlight />
        <ResultCard label="Zisk" value={formatCZK(fv - pv)} />
      </div>
      <div className="h-44 sm:h-48 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.gold} stopOpacity={0.2} />
                <stop offset="100%" stopColor={chartColors.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="rok" fontSize={11} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <YAxis fontSize={11} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <Tooltip formatter={(v: number) => formatCZK(v)} labelFormatter={(l) => `Rok ${l}`} {...chartTooltipStyle} />
            <Area type="monotone" dataKey="hodnota" stroke={chartColors.gold} fill="url(#goldGrad)" strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const SavingsCalc = () => {
  const [pmt, setPmt] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return { fv: pmt * n, invested: pmt * n };
    const fv = pmt * ((Math.pow(1 + r, n) - 1) / r);
    return { fv, invested: pmt * n };
  }, [pmt, rate, years]);

  const chartData = useMemo(() => {
    const r = rate / 100 / 12;
    const data = [];
    for (let y = 0; y <= years; y++) {
      const n = y * 12;
      const fv = r === 0 ? pmt * n : pmt * ((Math.pow(1 + r, n) - 1) / r);
      data.push({ rok: y, naspořeno: Math.round(fv), vloženo: pmt * n });
    }
    return data;
  }, [pmt, rate, years]);

  return (
    <div className="space-y-5">
      <InputField label="Měsíční vklad" value={pmt} onChange={setPmt} suffix="Kč" min={0} step={500} />
      <InputField label="Roční výnos" value={rate} onChange={setRate} suffix="%" min={0} max={30} step={0.5} />
      <InputField label="Počet let" value={years} onChange={setYears} suffix="let" min={1} max={50} />
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
        <ResultCard label="Naspořeno" value={formatCZK(result.fv)} highlight />
        <ResultCard label="Vloženo" value={formatCZK(result.invested)} />
        <ResultCard label="Zisk" value={formatCZK(result.fv - result.invested)} />
      </div>
      <div className="h-44 sm:h-48 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="savGoldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.gold} stopOpacity={0.2} />
                <stop offset="100%" stopColor={chartColors.gold} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="savNavyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.navy} stopOpacity={0.15} />
                <stop offset="100%" stopColor={chartColors.navy} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="rok" fontSize={11} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <YAxis fontSize={11} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <Tooltip formatter={(v: number) => formatCZK(v)} labelFormatter={(l) => `Rok ${l}`} {...chartTooltipStyle} />
            <Area type="monotone" dataKey="naspořeno" stroke={chartColors.gold} fill="url(#savGoldGrad)" strokeWidth={2.5} dot={false} name="Naspořeno" />
            <Area type="monotone" dataKey="vloženo" stroke={chartColors.navy} fill="url(#savNavyGrad)" strokeWidth={2} dot={false} name="Vloženo" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const InflationCalc = () => {
  const [amount, setAmount] = useState(1000000);
  const [inflation, setInflation] = useState(3);
  const [years, setYears] = useState(10);

  const realValue = useMemo(() => amount / Math.pow(1 + inflation / 100, years), [amount, inflation, years]);

  const chartData = useMemo(() => {
    const data = [];
    for (let y = 0; y <= years; y++) {
      data.push({ rok: y, reálná: Math.round(amount / Math.pow(1 + inflation / 100, y)), nominální: amount });
    }
    return data;
  }, [amount, inflation, years]);

  return (
    <div className="space-y-5">
      <InputField label="Nominální částka" value={amount} onChange={setAmount} suffix="Kč" min={0} step={50000} />
      <InputField label="Roční inflace" value={inflation} onChange={setInflation} suffix="%" min={0} max={20} step={0.5} />
      <InputField label="Počet let" value={years} onChange={setYears} suffix="let" min={1} max={50} />
      <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
        <ResultCard label="Reálná hodnota" value={formatCZK(realValue)} highlight />
        <ResultCard label="Ztráta kupní síly" value={formatCZK(amount - realValue)} />
      </div>
      <div className="h-44 sm:h-48 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="inflRedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.destructive} stopOpacity={0.15} />
                <stop offset="100%" stopColor={chartColors.destructive} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="rok" fontSize={11} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <YAxis fontSize={11} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <Tooltip formatter={(v: number) => formatCZK(v)} labelFormatter={(l) => `Rok ${l}`} {...chartTooltipStyle} />
            <Area type="monotone" dataKey="nominální" stroke={chartColors.muted} fill="none" strokeWidth={1.5} strokeDasharray="6 4" dot={false} name="Nominální" />
            <Area type="monotone" dataKey="reálná" stroke={chartColors.destructive} fill="url(#inflRedGrad)" strokeWidth={2.5} dot={false} name="Reálná hodnota" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TargetSavingsCalc = () => {
  const [target, setTarget] = useState(1000000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const pmt = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return target / n;
    return target * r / (Math.pow(1 + r, n) - 1);
  }, [target, rate, years]);

  return (
    <div className="space-y-5">
      <InputField label="Cílová částka" value={target} onChange={setTarget} suffix="Kč" min={0} step={50000} />
      <InputField label="Roční výnos" value={rate} onChange={setRate} suffix="%" min={0} max={30} step={0.5} />
      <InputField label="Počet let" value={years} onChange={setYears} suffix="let" min={1} max={50} />
      <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
        <ResultCard label="Potřebný měsíční vklad" value={formatCZK(pmt)} highlight />
        <ResultCard label="Celkem vložíte" value={formatCZK(pmt * years * 12)} />
      </div>
    </div>
  );
};

/* ---- Main section ---- */

const inlineCalcs: Record<string, React.FC> = {
  mortgage: MortgageCalc,
  compound: CompoundCalc,
  savings: SavingsCalc,
  inflation: InflationCalc,
  targetSavings: TargetSavingsCalc,
};

const lazyCalcs: Record<string, React.LazyExoticComponent<React.FC>> = {
  renta: RentaCalc,
  requiredRate: RequiredRateCalc,
  realReturn: RealReturnCalc,
  disability: DisabilityCalc,
  amortization: AmortizationCalc,
};

const CalculatorsSection = () => {
  const [active, setActive] = useState<CalcType | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const ActiveCalc = active ? (inlineCalcs[active] || lazyCalcs[active]) : null;
  const isLazy = active ? active in lazyCalcs : false;

  return (
    <section id="calculators" className="section-padding bg-background" ref={ref}>
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-sm font-medium text-accent tracking-wider uppercase">Kalkulačky</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Spočítejte si to sami
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            10 interaktivních finančních kalkulaček pro rychlý přehled. Vyberte si kalkulačku níže.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {/* Tabs - grid on mobile, wrap on desktop */}
          <div className="mb-6 sm:mb-8">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
              {calcTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(active === tab.id ? null : tab.id)}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    active === tab.id
                      ? "gold-gradient text-accent-foreground shadow-md"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon size={14} className="sm:w-4 sm:h-4" />
                  {tab.label}
                  {active === tab.id && <ChevronDown size={12} className="ml-0.5 rotate-180 transition-transform" />}
                </button>
              ))}
            </div>
          </div>

          {/* Calculator - only shown when active */}
          <AnimatePresence mode="wait">
            {active && ActiveCalc && (
              <motion.div
                key={active}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="glass-card p-5 sm:p-8">
                  {isLazy ? (
                    <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Načítám...</div>}>
                      <ActiveCalc />
                    </Suspense>
                  ) : (
                    <ActiveCalc />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default CalculatorsSection;
