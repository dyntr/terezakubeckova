import { useState, useMemo } from "react";
import { InputField, ResultCard } from "./shared";

const RealReturnCalc = () => {
  const [nominalRate, setNominalRate] = useState(7);
  const [inflation, setInflation] = useState(3);

  const realReturn = useMemo(() => {
    return ((1 + nominalRate / 100) / (1 + inflation / 100) - 1) * 100;
  }, [nominalRate, inflation]);

  return (
    <div className="space-y-5">
      <InputField label="Nominální výnos" value={nominalRate} onChange={setNominalRate} suffix="% p.a." min={0} max={50} step={0.5} />
      <InputField label="Roční inflace" value={inflation} onChange={setInflation} suffix="%" min={0} max={30} step={0.5} />
      <div className="grid grid-cols-3 gap-3 pt-2">
        <ResultCard label="Reálný výnos" value={`${realReturn.toFixed(2)} %`} highlight />
        <ResultCard label="Nominální" value={`${nominalRate.toFixed(1)} %`} />
        <ResultCard label="Inflace" value={`${inflation.toFixed(1)} %`} />
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Fisherova rovnice: real = (1 + nominal) / (1 + inflace) − 1
      </p>
    </div>
  );
};

export default RealReturnCalc;
