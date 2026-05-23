import { useState } from "react"

const dietData = {
  under: {
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&fit=crop",
    title: "Nutrient-Dense Weight Gain Diet",
    tips: "Focus on adding healthy fats and clean calories. Recommended foods: avocados, walnuts, almonds, organic nut butters, salmon, eggs, oats, and protein-rich smoothies."
  },
  normal: {
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&fit=crop",
    title: "Balanced Maintenance Diet",
    tips: "Keep supporting your metabolism with a diverse plate. Recommended foods: colorful vegetables, whole grains, clean lean proteins, olive oil, and fiber-rich berries."
  },
  over: {
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80&fit=crop",
    title: "Active Fat-Burning Diet",
    tips: "Prioritize high-fiber foods and portion control. Recommended foods: leafy greens, lean chicken breast, eggs, fiber-rich legumes, citrus fruits, and green tea."
  },
  obese: {
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80&fit=crop",
    title: "Anti-Inflammatory Wellness Diet",
    tips: "Reduce insulin spikes with low-glycemic whole foods. Recommended foods: broccoli, asparagus, spinach, lemons, wild-caught salmon, chia seeds, and plenty of water."
  }
};

function App() {
  const [unit, setUnit] = useState('metric');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("male");

  const colors = {
    underweight: '#378ADD',
    normal: '#1D9E75',
    overweight: '#BA7517',
    obese: '#E24B4A',
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    if (newUnit === 'metric') {
      setWeight(70); setHeight(175);
    } else {
      setWeight(154); setHeight(69);
    }
  };

  const weightMin = unit === 'metric' ? 30 : 66;
  const weightMax = unit === 'metric' ? 200 : 440;
  const heightMin = unit === 'metric' ? 140 : 55;
  const heightMax = unit === 'metric' ? 220 : 87;
  const ageMin = 10;
  const ageMax = 100;

  const safeWeight = Number(weight) || (unit === 'metric' ? 70 : 154);
  const safeHeight = Number(height) || (unit === 'metric' ? 175 : 69);
  const safeAge = Number(age) || 25;

  const handleWeightType = (val) => {
    if (val === '') { setWeight(''); } else { const num = Number(val); if (!isNaN(num)) setWeight(num); }
  };
  const handleWeightBlur = () => {
    const num = Number(weight);
    if (isNaN(num) || weight === '') { setWeight(unit === 'metric' ? 70 : 154); }
    else { setWeight(Math.min(Math.max(num, weightMin), weightMax)); }
  };

  const handleHeightType = (val) => {
    if (val === '') { setHeight(''); } else { const num = Number(val); if (!isNaN(num)) setHeight(num); }
  };
  const handleHeightBlur = () => {
    const num = Number(height);
    if (isNaN(num) || height === '') { setHeight(unit === 'metric' ? 175 : 69); }
    else { setHeight(Math.min(Math.max(num, heightMin), heightMax)); }
  };

  const handleAgeType = (val) => {
    if (val === '') { setAge(''); } else { const num = Number(val); if (!isNaN(num)) setAge(num); }
  };
  const handleAgeBlur = () => {
    const num = Number(age);
    if (isNaN(num) || age === '') { setAge(25); }
    else { setAge(Math.min(Math.max(num, ageMin), ageMax)); }
  };

  let weightKg, heightM;
  if (unit === 'metric') {
    weightKg = safeWeight; heightM = safeHeight / 100;
  } else {
    weightKg = safeWeight * 0.453592; heightM = safeHeight * 0.0254;
  }

  const bmi = weightKg / (heightM * heightM);
  const bmiFormatted = bmi.toFixed(1);

  const getRisk = (bmi, age, gender) => {
    if (bmi < 18.5) return age > 65 ? 'High' : 'Moderate';
    if (bmi < 25) return 'Low';
    if (bmi < 30) {
      if (age > 65) return 'Moderate';
      if (gender === 'female') return 'Moderate';
      return 'Increased';
    }
    return 'High';
  };

  let category, rangeText, color, segment;
  if (bmi < 18.5) {
    category = 'Underweight'; rangeText = '< 18.5';
    color = colors.underweight; segment = 'under';
  } else if (bmi < 25) {
    category = 'Normal weight'; rangeText = '18.5 – 24.9';
    color = colors.normal; segment = 'normal';
  } else if (bmi < 30) {
    category = 'Overweight'; rangeText = '25 – 29.9';
    color = colors.overweight; segment = 'over';
  } else {
    category = 'Obese'; rangeText = '≥ 30';
    color = colors.obese; segment = 'obese';
  }

  const risk = getRisk(bmi, safeAge, gender);

  const idealMinKg = 18.5 * (heightM * heightM);
  const idealMaxKg = 24.9 * (heightM * heightM);
  const idealText = unit === 'metric'
    ? `${Math.round(idealMinKg)} – ${Math.round(idealMaxKg)} kg`
    : `${Math.round(idealMinKg / 0.453592)} – ${Math.round(idealMaxKg / 0.453592)} lb`;

  const pointerPercent = Math.min(Math.max((bmi - 10) / 30, 0), 1) * 100;

  const renderHealthNote = () => {
    const name = gender === 'male' ? 'men' : 'women';
    if (bmi >= 18.5 && bmi <= 24.9) {
      return <>You are within a <span>healthy BMI range</span> for {name} aged {safeAge}. Keep it up!</>;
    } else if (bmi < 18.5) {
      const diff = (18.5 - bmi).toFixed(1);
      return <>Your BMI is <span>{diff} points below</span> the healthy range. Consider speaking with a healthcare professional.</>;
    } else {
      const diff = (bmi - 25).toFixed(1);
      return <>Your BMI is <span>{diff} points above</span> the healthy range for {name} aged {safeAge}. A balanced diet and exercise can help.</>;
    }
  };

  return (
    <>
      <div className="background-container">
        <div className="background-layer" style={{ backgroundImage: `url(${dietData.under.image})`, opacity: segment === 'under' ? 1 : 0 }} />
        <div className="background-layer" style={{ backgroundImage: `url(${dietData.normal.image})`, opacity: segment === 'normal' ? 1 : 0 }} />
        <div className="background-layer" style={{ backgroundImage: `url(${dietData.over.image})`, opacity: segment === 'over' ? 1 : 0 }} />
        <div className="background-layer" style={{ backgroundImage: `url(${dietData.obese.image})`, opacity: segment === 'obese' ? 1 : 0 }} />
        <div className="background-overlay" />
      </div>

      <div className="container">
        <h1>BMI Calculator</h1>

        <div className="layout">

          {/* LEFT — inputs */}
          <div className="layout-inputs">
            <div className="unit-toggle">
              <button className={unit === 'metric' ? 'active' : ''} onClick={() => handleUnitChange('metric')}>Metric</button>
              <button className={unit === 'imperial' ? 'active' : ''} onClick={() => handleUnitChange('imperial')}>Imperial</button>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Weight</span>
                <div className="editable-value-container">
                  <input type="number" value={weight} min={weightMin} max={weightMax}
                    onChange={(e) => handleWeightType(e.target.value)}
                    onBlur={handleWeightBlur}
                    className="editable-input" />
                  <span className="slider-value">{unit === 'metric' ? 'kg' : 'lb'}</span>
                </div>
              </div>
              <input type="range" min={weightMin} max={weightMax} step="1" value={safeWeight}
                onChange={(e) => setWeight(Number(e.target.value))} />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Height</span>
                <div className="editable-value-container">
                  <input type="number" value={height} min={heightMin} max={heightMax}
                    onChange={(e) => handleHeightType(e.target.value)}
                    onBlur={handleHeightBlur}
                    className="editable-input" />
                  <span className="slider-value">{unit === 'metric' ? 'cm' : 'in'}</span>
                </div>
              </div>
              <input type="range" min={heightMin} max={heightMax} step="1" value={safeHeight}
                onChange={(e) => setHeight(Number(e.target.value))} />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Age</span>
                <div className="editable-value-container">
                  <input type="number" value={age} min={ageMin} max={ageMax}
                    onChange={(e) => handleAgeType(e.target.value)}
                    onBlur={handleAgeBlur}
                    className="editable-input" />
                  <span className="slider-value">yrs</span>
                </div>
              </div>
              <input type="range" min={ageMin} max={ageMax} step="1" value={safeAge}
                onChange={(e) => setAge(Number(e.target.value))} />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Gender</span>
              </div>
              <div className="unit-toggle">
                <button className={gender === 'male' ? 'active' : ''} onClick={() => setGender('male')}>Male</button>
                <button className={gender === 'female' ? 'active' : ''} onClick={() => setGender('female')}>Female</button>
              </div>
            </div>
          </div>

          {/* RIGHT — result */}
          <div className="layout-result">
            <div className="result">
              <div className="bmi-display">
                <div className="bmi-number">{bmiFormatted}</div>
                <div className="bmi-category" style={{ color }}>{category}</div>
              </div>

              <div className="gauge">
                <div className="gauge-track">
                  <div className={`gauge-seg seg-under ${segment === 'under' ? 'active' : ''}`}></div>
                  <div className={`gauge-seg seg-normal ${segment === 'normal' ? 'active' : ''}`}></div>
                  <div className={`gauge-seg seg-over ${segment === 'over' ? 'active' : ''}`}></div>
                  <div className={`gauge-seg seg-obese ${segment === 'obese' ? 'active' : ''}`}></div>
                </div>
                <div className="gauge-pointer-row">
                  <div className="gauge-pointer" style={{ left: `${pointerPercent.toFixed(1)}%` }}></div>
                </div>
                <div className="gauge-labels">
                  <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat">
                  <div className="stat-label">Health risk</div>
                  <div className="stat-val">{risk}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">BMI range</div>
                  <div className="stat-val">{rangeText}</div>
                </div>
                <div className="stat" style={{ gridColumn: 'span 2' }}>
                  <div className="stat-label">Healthy weight for your height</div>
                  <div className="stat-val">{idealText}</div>
                </div>
              </div>

              <div className="health-note">{renderHealthNote()}</div>

              <div className="diet-tips-card">
                <div className="diet-tips-title">
                  <span className="diet-tips-icon">🥗</span>
                  <span>{dietData[segment].title}</span>
                </div>
                <div className="diet-tips-content">
                  {dietData[segment].tips}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;