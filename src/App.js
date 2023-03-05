import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import './style.css';

const MEDS = [
  'Acebutolol',
  'Atenolol',
  'Benazepril',
  'Betaxolol',
  'Bisoprolol',
  'Bisoprolol/Hydrochlorothiazide',
  'Candesartan',
  'Captopril',
  'Enalapril',
  'Eprosartan',
  'Fosinopril',
  'Irbesartan',
  'Lisinopril',
  'Losartan',
  'Metoprolol succinate',
  'Metoprolol tartrate',
  'Moexipril',
  'Nadolol',
  'Perindopril',
  'Pindolol',
  'Propranolol',
  'Quinapril',
  'Ramipril',
  'Solotol',
  'Telmisartan',
  'Timolol',
  'Trandolapril',
  'Valsartan',
];

function Medication({ medication, toggleOn }) {
  return (
    <li
      key={medication.med}
      className={medication.on ? 'on' : ''}
      onClick={() => toggleOn()}
    >
      {medication.med}
    </li>
  );
}

function MedsList({ meds, toggleOn }) {
  return (
    <ol>
      {meds.map((med) => (
        <Medication
          key={'A' + med.med}
          medication={med}
          toggleOn={() => toggleOn(med)}
        />
      ))}
    </ol>
  );
}

export default function App() {
  const [meds, setMeds] = useState([]);
  const [filter, setFilter] = useState('');
  const [countdown, setCountdown] = useState(-1);
  const [intervalOb, setIntervalOb] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadMeds = async () => {
      setMeds(
        MEDS.map((m) => {
          return { med: m, on: false };
        })
      );
    };

    loadMeds();
  }, []);

  const toggleOn = (med) => {
    let newMeds = _.cloneDeep(meds);
    newMeds.splice(
      meds.findIndex((m) => m.med == med.med),
      1,
      { ...med, on: !med.on }
    );
    setMeds(newMeds);
  };

  const print = () => {
    console.log(meds.filter((m) => m.on).map((m) => m.med));
  };

  const doCountdown = () => {
    setCountdown((prev) => prev - 1);
  };

  useEffect(() => {
    if (countdown == 0) {
      print();
      setSubmitted(true);
      clearInterval(intervalOb);
      setCountdown(-1);
    }
  }, [countdown]);

  const cancel = () => {
    setCountdown(-1);
    clearInterval(intervalOb);
  };
  const submit = () => {
    setCountdown(3);
    setIntervalOb(setInterval(doCountdown, 1000));
  };

  return (
    <div className="App">
      <h1>Medication List</h1>
      <input
        placeholder="filter"
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
      />
      <button onClick={() => setFilter('')}>Clear Filter</button>
      <button
        disabled={submitted}
        onClick={() => {
          if (countdown == -1) {
            submit();
          } else {
            cancel();
          }
        }}
      >
        {submitted
          ? 'Done'
          : countdown > 0
          ? `Cancel (${countdown} seconds)`
          : 'Submit'}
      </button>
      <MedsList
        toggleOn={toggleOn}
        meds={
          filter
            ? meds.filter((m) => {
                const subFilters = filter
                  .split(',')
                  .filter((s) => s.trim().length > 0)
                  .map((s) => s.trim());
                for (let f of subFilters) {
                  if (m.med.toLowerCase().includes(f.toLowerCase())) {
                    return true;
                  }
                }
                return false;
              })
            : meds
        }
      />
    </div>
  );
}
