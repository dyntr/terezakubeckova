import { useState, useMemo } from "react";
import { InputField, ResultCard, formatCZK } from "./shared";

const RequiredRateCalc = () => {
  const [pv, setPv] = useState(500000);
  const [fv, setFv] = useState(1000000);
  const [years, setYears] = useState(10);

  const rate = useMemo(() => {
    if (pv <= 0 || years <= 0) return 0;
    return (Math.pow(fv / pv, 1 / years) - 1) * 100;
  }, [pv, fv, years]);

  return (
    <div className="space-y-5">
      <InputField label="Počáteční částka" value={pv} onChange={setPv} suffix="Kč" min={1} step={50000} />
      <InputField label="Cílová částka" value={fv} onChange={setFv} suffix="Kč" min={1} step={50000} />
      <InputField label="Počet let" value={years} onChange={setYears} suffix="let" min={1} max={50} />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <ResultCard label="Potřebný roční výnos" value={`${rate.toFixed(2)} %`} highlight />
        <ResultCard label="Zisk" value={formatCZK(fv - pv)} />
      </div>
    </div>
  );
};

export default RequiredRateCalc;
