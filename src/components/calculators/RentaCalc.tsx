import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { InputField, ResultCard, formatCZK, chartColors, chartTooltipStyle } from "./shared";

const RentaCalc = () => {
  const [capital, setCapital] = useState(3000000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return { pmt: capital / n, totalDrawn: capital };
    const pmt = capital * r / (1 - Math.pow(1 + r, -n));
    return { pmt, totalDrawn: pmt * n };
  }, [capital, rate, years]);

  const chartData = useMemo(() => {
    const r = rate / 100 / 12;
    const pmt = result.pmt;
    let balance = capital;
    const data = [];
    for (let y = 0; y <= years; y += Math.max(1, Math.floor(years / 10))) {
      data.push({ rok: y, zůstatek: Math.round(balance) });
      const months = Math.min(12 * Math.max(1, Math.floor(years / 10)), (years - y) * 12);
      for (let m = 0; m < months; m++) {
        balance = balance * (1 + r) - pmt;
      }
    }
    return data;
  }, [capital, rate, years, result.pmt]);

  return (
    <div className="space-y-5">
      <InputField label="Naspořený kapitál" value={capital} onChange={setCapital} suffix="Kč" min={100000} step={100000} />
      <InputField label="Roční výnos" value={rate} onChange={setRate} suffix="%" min={0} max={20} step={0.5} />
      <InputField label="Doba čerpání" value={years} onChange={setYears} suffix="let" min={1} max={50} />
      <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
        <ResultCard label="Měsíční renta" value={formatCZK(result.pmt)} highlight />
        <ResultCard label="Celkem vyčerpáno" value={formatCZK(result.totalDrawn)} />
      </div>
      <div className="h-44 sm:h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={20}>
            <defs>
              <linearGradient id="rentaBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.gold} stopOpacity={1} />
                <stop offset="100%" stopColor={chartColors.gold} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="rok" fontSize={11} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <YAxis fontSize={11} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tickLine={false} axisLine={false} stroke={chartColors.muted} />
            <Tooltip formatter={(v: number) => formatCZK(v)} labelFormatter={(l) => `Rok ${l}`} {...chartTooltipStyle} />
            <Bar dataKey="zůstatek" fill="url(#rentaBarGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RentaCalc;
