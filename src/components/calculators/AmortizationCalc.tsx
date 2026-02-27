import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { InputField, formatCZK, chartColors, chartTooltipStyle } from "./shared";

const AmortizationCalc = () => {
  const [principal, setPrincipal] = useState(3000000);
  const [rate, setRate] = useState(5.5);
  const [years, setYears] = useState(30);

  const { schedule, payment } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    let pmt: number;
    if (r === 0) {
      pmt = principal / n;
    } else {
      pmt = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    let balance = principal;
    const schedule = [];
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const princ = pmt - interest;
      balance -= princ;
      yearInterest += interest;
      yearPrincipal += princ;

      if (m % 12 === 0) {
        schedule.push({
          rok: m / 12,
          zůstatek: Math.max(0, Math.round(balance)),
          úrok: Math.round(yearInterest),
          jistina: Math.round(yearPrincipal),
        });
        yearInterest = 0;
        yearPrincipal = 0;
      }
    }
    return { schedule, payment: pmt };
  }, [principal, rate, years]);

  return (
    <div className="space-y-5">
      <InputField label="Výše úvěru" value={principal} onChange={setPrincipal} suffix="Kč" min={100000} step={100000} />
      <InputField label="Úroková sazba" value={rate} onChange={setRate} suffix="% p.a." min={0} max={20} step={0.1} />
      <InputField label="Doba splácení" value={years} onChange={setYears} suffix="let" min={1} max={40} />

      <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
        <div className="rounded-xl p-3 sm:p-4 text-center gold-gradient">
          <p className="text-[10px] sm:text-xs mb-1 text-accent-foreground/80">Měsíční splátka</p>
          <p className="text-sm sm:text-lg font-bold font-heading text-accent-foreground">{formatCZK(payment)}</p>
        </div>
        <div className="rounded-xl p-3 sm:p-4 text-center bg-secondary">
          <p className="text-[10px] sm:text-xs mb-1 text-muted-foreground">Celkem zaplatíte</p>
          <p className="text-sm sm:text-lg font-bold font-heading text-foreground">{formatCZK(payment * years * 12)}</p>
        </div>
      </div>

      <div className="h-48 sm:h-56 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={schedule}>
            <defs>
              <linearGradient id="amortNavy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.navy} stopOpacity={0.2} />
                <stop offset="100%" stopColor={chartColors.navy} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="amortGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.gold} stopOpacity={0.2} />
                <stop offset="100%" stopColor={chartColors.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="rok" fontSize={11} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <YAxis fontSize={11} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <Tooltip formatter={(v: number) => formatCZK(v)} labelFormatter={(l) => `Rok ${l}`} {...chartTooltipStyle} />
            <Area type="monotone" dataKey="zůstatek" stroke={chartColors.navy} fill="url(#amortNavy)" strokeWidth={2.5} dot={false} />
            <Area type="monotone" dataKey="úrok" stroke={chartColors.gold} fill="url(#amortGold)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Table - first 5 years */}
      <div className="overflow-x-auto mt-4 -mx-2">
        <table className="w-full text-xs sm:text-sm min-w-[320px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-2 font-medium">Rok</th>
              <th className="text-right py-2 px-2 font-medium">Jistina</th>
              <th className="text-right py-2 px-2 font-medium">Úroky</th>
              <th className="text-right py-2 px-2 font-medium">Zůstatek</th>
            </tr>
          </thead>
          <tbody>
            {schedule.slice(0, 5).map((row) => (
              <tr key={row.rok} className="border-b border-border/50">
                <td className="py-2 px-2 text-foreground">{row.rok}</td>
                <td className="py-2 px-2 text-right text-foreground">{formatCZK(row.jistina)}</td>
                <td className="py-2 px-2 text-right text-muted-foreground">{formatCZK(row.úrok)}</td>
                <td className="py-2 px-2 text-right font-medium text-foreground">{formatCZK(row.zůstatek)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {schedule.length > 5 && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Zobrazeno prvních 5 z {schedule.length} let
          </p>
        )}
      </div>
    </div>
  );
};

export default AmortizationCalc;
