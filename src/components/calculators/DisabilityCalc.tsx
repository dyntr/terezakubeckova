import { useState, useMemo } from "react";
import { InputField, ResultCard, formatCZK } from "./shared";

const DisabilityCalc = () => {
  const [monthlyNeed, setMonthlyNeed] = useState(30000);
  const [rate, setRate] = useState(3);
  const [years, setYears] = useState(10);

  const reserve = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return monthlyNeed * n;
    return monthlyNeed * (1 - Math.pow(1 + r, -n)) / r;
  }, [monthlyNeed, rate, years]);

  return (
    <div className="space-y-5">
      <InputField label="Měsíční potřeba" value={monthlyNeed} onChange={setMonthlyNeed} suffix="Kč" min={1000} step={5000} />
      <InputField label="Roční zhodnocení rezervy" value={rate} onChange={setRate} suffix="%" min={0} max={20} step={0.5} />
      <InputField label="Doba zabezpečení" value={years} onChange={setYears} suffix="let" min={1} max={40} />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <ResultCard label="Potřebná rezerva" value={formatCZK(reserve)} highlight />
        <ResultCard label="Celkem vyplaceno" value={formatCZK(monthlyNeed * years * 12)} />
      </div>
    </div>
  );
};

export default DisabilityCalc;
