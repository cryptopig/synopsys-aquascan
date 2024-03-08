'use client';


// import Graph from './graph'; // We need client side rendering (https://github.com/recharts/recharts/issues/2918#issuecomment-1268947427)
import dynamic from "next/dynamic";




// import { Flex } from "@radix-ui/themes";
const Graph = dynamic(() => import('./graph'), { ssr: false });
import Stat from './stat';
import { useEffect, useState } from "react";
import { DatePickerWithRange } from "./daterangepicker";
import { addDays, format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { UnitPicker } from "./unitpicker";








function formatTime(ms) {
  let t = new Date(ms);
  var hours = t.getHours();
  var minutes = t.getMinutes();
  var seconds = t.getSeconds();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  let time = hours + ':' + minutes + ':' + seconds + ampm;
  return time;
}















// safe values
const threshholds = {
  // EPA
  acidity: {
    ideal: 7,
    min: 6.5,
    max: 8.5,
  },
  // WHO
  turbidity: {
    ideal: 0,
    min: -5,
    max: 5,
  },
  // EPA
  totaldissolvedsolids: {
    ideal: 100,
    min: -500,
    max: 500,
  },
};

let goodPercent = 0.2; // if its in 20% of threshhold, good


function getColorFromStatus(status) {
  if (status == 0) {
    return '#D13415';
  } else if (status == 1) {
    return '#D5AE39';
  } else if (status == 2) {
    return '#2A7E3B';
  }
}

function getWordFromStatus(status) {
  if (status == 0) {
    return 'Unsafe';
  } else if (status == 1) {
    return 'Moderate';
  } else if (status == 2) {
    return 'Safe';
  }
}

function getModerateThreshholdMax(threshhold) {
  return threshhold.ideal + goodPercent * (threshhold.max - threshhold.ideal);
}

function getModerateThreshholdMin(threshhold) {
  return threshhold.ideal + goodPercent * (threshhold.min - threshhold.ideal);
}

function getStatusUsingValueAndThreshhold(value, threshhold) {
  if (value > threshhold.max || value < threshhold.min) {
    // UNSAFE
    return 0;
  } else if (value > getModerateThreshholdMax(threshhold) || value < getModerateThreshholdMin(threshhold)) {
    // Moderate, within threshold, but not within 20% of threshhold
    return 1;
  } else {
    // Safe, within 20% of threshhold
    return 2;
  }
}

function getOverallStatusUsingAllStatus(statuses) {
  // if unsafe, then unsafe
  // if less than half are moderate, then safe
  // if more than half are safe

  let safeCount = 0;
  let moderateCount = 0;
  for (let i = 0; i < statuses.length; i++) {
    let status = statuses[i];
    if (status == 0) {
      return 0;
    } else if (status == 1) {
      moderateCount++;
    } else if (status == 2) {
      safeCount++;
    }
  }

  if (safeCount > moderateCount) {
    return 2;
  } else {
    return 1;
  }
}











export default function Page() {

  const [date, setDate] = useState({
    // from: new Date(2022, 0, 20),
    // to: addDays(new Date(2022, 0, 20), 20),
    from: (() => {
      let c = new Date();
      c.setDate(c.getDate() - 1)
      return c;
    })(),
    to: new Date(),
  });


  // const units = [
  //   {
  //     value: 0,
  //     label: 'Sunnyvale'
  //   },
  //   // {
  //   //   value: 1,
  //   //   label: 'Santa Clara'
  //   // },
  //   // {
  //   //   value: 2,
  //   //   label: 'San Jose'
  //   // },
  //   // {
  //   //   value: 3,
  //   //   label: 'San Mateo'
  //   // },
  // ]
  const [values, setValues] = useState({});
  const [units, setUnits] = useState([]);


  const [data, setData] = useState(false);
  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    let f;
    let lastData = {};
    f = (after) => {
      fetch(after ? '/api?after=' + encodeURIComponent(JSON.stringify(after)) : '/api')
      .then(raw => raw.json())
      .then((addData) => {
        // console.log(newData);
        let a = {};
        // console.log(lastData);
        let newData = structuredClone(lastData);
        for (const [k, v] of Object.entries(addData)) {
          a[k] = v.data.length;
          // newUnits.push({value: k, label: v.name});
          if (newData[k]) {
            for (let i = 0; i < v.data.length; i++) {
              newData[k].data.push(v.data[i]);
            }
          } else {
            newData[k] = v;
          }
        }
        setData(newData);

        let gd2 = [];
        for (let index = 1; index <= 3; index++) {
          let gd = [];
          gd2.push(gd);
          for (const [k, v] of Object.entries(newData)) {
            for (let i = 0; i < v.data.length; i++) {
              let d = v.data[i];
              let found = false;
              for (let i2 = 0; i2 < gd.length; i2++) {
                let g = gd[i2];
                if (g.time == d[0]) {
                  g[v.name] = d[index];
                  found = true;
                }
              }
              if (!found) {
                let g = {
                  name: formatTime(d[0]),
                  // name: 'a',
                  time: d[0],
                };
                g[v.name] = d[index];
                gd.push(g);
              }
            }
          }
        }
        // console.log(gd2);
        setGraphData(gd2);

        let newUnits = [];
        for (const [k, v] of Object.entries(newData)) {
          newUnits.push({value: k, label: v.name});
        }
        setUnits(newUnits);


        lastData = newData;


        setTimeout(() => {f(a)}, 1000);
      });
    }
    if (!data) {
      f();
    }
  }, [setData, setGraphData]);



  if (!data) {
    return null;
  }


  let found = false;
  let values2 = [];
  for (const [k, v] of Object.entries(values)) {
    // console.log(k, v);
    if (v == true) {
      found = true;
      // console.log(units[k])
      values2.push(units[k].label);
    }
  }
  if (found == false) {
    for (let i = 0; i < units.length; i++) {
      values2.push(units[i].label);
    }
  }
  // console.log(units, data);


  let temp;

  let acidity;
  temp = graphData[0][graphData[0].length - 1];
  if (temp !== undefined) {
    acidity = 0;
    for (let i = 0; i < values2.length; i++) {
      acidity += temp[values2[i]];
    }
    acidity /= values2.length;
  } else {
    acidity = null;
  }

  let turbidity;
  temp = graphData[1][graphData[1].length - 1];
  if (temp !== undefined) {
    turbidity = 0;
    for (let i = 0; i < values2.length; i++) {
      turbidity += temp[values2[i]];
    }
    turbidity /= values2.length;
  } else {
    turbidity = null;
  }

  let totaldissolvedsolids;
  temp = graphData[2][graphData[2].length - 1];
  if (temp !== undefined) {
    totaldissolvedsolids = 0;
    for (let i = 0; i < values2.length; i++) {
      totaldissolvedsolids += temp[values2[i]];
    }
    totaldissolvedsolids /= values2.length;
  } else {
    totaldissolvedsolids = null;
  }
  let statuses = [getStatusUsingValueAndThreshhold(acidity, threshholds.acidity), getStatusUsingValueAndThreshhold(turbidity, threshholds.turbidity), getStatusUsingValueAndThreshhold(totaldissolvedsolids, threshholds.totaldissolvedsolids)];
  



  return (
    <>

      <div className="flex gap-4" style={{paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1rem'}}>
        <div className="flex-1">
          {/* amogus */}
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight align-middle">
            Dashboard
          </h3>
        </div>
        <div className="flex-1" />
        <div className="flex-1">
          <UnitPicker units={units} values={values} setValues={setValues}></UnitPicker>
        </div>
        <div className="flex-1">
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>

      <div className="flex gap-4" style={{paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1rem'}}>
        <div className="flex-1"><Stat title={getWordFromStatus(getOverallStatusUsingAllStatus(statuses))} description={'Overall assessment'} color={getColorFromStatus(getOverallStatusUsingAllStatus(statuses))} /></div>
        <div className="flex-1"><Stat title={acidity} description={'Acidity (pH)'} color={getColorFromStatus(statuses[0])} /></div>
        <div className="flex-1"><Stat title={turbidity} description={'Turbidity (NTU)'} color={getColorFromStatus(statuses[1])} /></div>
        <div className="flex-1"><Stat title={totaldissolvedsolids} description={'Total Dissolved Solids (PPM)'} color={getColorFromStatus(statuses[2])} /></div>
      </div>

      <div className="flex gap-4 p-4">
        <div className="flex-1"><Graph title={'Acidity (pH)'} description={'How acidic the water is.'} data={graphData[0]} values={values2} referenceLines={[[threshholds.acidity.min, 'Unsafe', getColorFromStatus(0)], [threshholds.acidity.max, 'Unsafe', getColorFromStatus(0)], [getModerateThreshholdMin(threshholds.acidity), 'Moderate', getColorFromStatus(1)], [getModerateThreshholdMax(threshholds.acidity), 'Moderate', getColorFromStatus(1)], [threshholds.acidity.ideal, 'Ideal', getColorFromStatus(2)]]} /></div>
        <div className="flex-1"><Graph title={'Turbidity (NTU)'} description={'How clear the water is.'} data={graphData[1]} values={values2} referenceLines={[[threshholds.turbidity.max, 'Unsafe', getColorFromStatus(0)], [getModerateThreshholdMax(threshholds.turbidity), 'Moderate', getColorFromStatus(1)], [threshholds.turbidity.ideal, 'Ideal', getColorFromStatus(2)]]} /></div>
        <div className="flex-1"><Graph title={'Total Dissolved Solids (PPM)'} description={'How much solids are dissolved.'} data={graphData[2]} values={values2} referenceLines={[[threshholds.totaldissolvedsolids.max, 'Unsafe', getColorFromStatus(0)], [getModerateThreshholdMax(threshholds.totaldissolvedsolids), 'Moderate', getColorFromStatus(1)], [threshholds.totaldissolvedsolids.ideal, 'Ideal', getColorFromStatus(2)]]} /></div>
        {/* <div className="flex-1"><Graph data={data} /></div>
        <div className="flex-1"><Graph data={data} /></div> */}
      </div>
    </>
  );
}








