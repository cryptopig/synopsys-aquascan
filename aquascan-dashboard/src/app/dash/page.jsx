'use client';


// import Graph from './graph'; // We need client side rendering (https://github.com/recharts/recharts/issues/2918#issuecomment-1268947427)
import dynamic from "next/dynamic";




// import { Flex } from "@radix-ui/themes";
const Graph = dynamic(() => import('./graph'), { ssr: false });
import Stat from './stat';
import { useState } from "react";
import { DatePickerWithRange } from "./daterangepicker";
import { addDays, format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { UnitPicker } from "./unitpicker";




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

function getStatusUsingValueAndThreshhold(value, threshhold) {
  if (value > threshhold.max || value < threshhold.min) {
    // UNSAFE
    return 0;
  } else if (value > (threshhold.max - threshhold.ideal) * goodPercent + threshhold.ideal || value < threshhold.min - (threshhold.ideal - threshhold.min) * goodPercent) {
    // Moderate, within threshold, but not within 20% of threshhold
    return 1;
  } else {
    // Safe, within 20% of threshhold
    return 2;
  }
}

function getOverallStatusUsingValuesAndThreshholds(values, threshholds) {

}







/*
data format:

data = {
  {
    time: unix timestamp here,
    acidity: 123,
    turbidity: 123,
    totaldissolvedsolids: 123,
  },
  ...
}

- encode in JSON

*/






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


  const units = [
    {
      value: 0,
      label: 'Sunnyvale'
    },
    // {
    //   value: 1,
    //   label: 'Santa Clara'
    // },
    // {
    //   value: 2,
    //   label: 'San Jose'
    // },
    // {
    //   value: 3,
    //   label: 'San Mateo'
    // },
  ]
  const [values, setValues] = useState({});




  let data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },

    {name:"Page A",uv:4e3,pv:2400,amt:2400},{name:"Page B",uv:3e3,pv:1398,amt:2210},{name:"Page C",uv:2e3,pv:9800,amt:2290},{name:"Page D",uv:2780,pv:3908,amt:2e3},{name:"Page E",uv:1890,pv:4800,amt:2181},{name:"Page F",uv:2390,pv:3800,amt:2500},{name:"Page G",uv:3490,pv:4300,amt:2100},
    {name:"Page A",uv:4e3,pv:2400,amt:2400},{name:"Page B",uv:3e3,pv:1398,amt:2210},{name:"Page C",uv:2e3,pv:9800,amt:2290},{name:"Page D",uv:2780,pv:3908,amt:2e3},{name:"Page E",uv:1890,pv:4800,amt:2181},{name:"Page F",uv:2390,pv:3800,amt:2500},{name:"Page G",uv:3490,pv:4300,amt:2100},
    {name:"Page A",uv:4e3,pv:2400,amt:2400},{name:"Page B",uv:3e3,pv:1398,amt:2210},{name:"Page C",uv:2e3,pv:9800,amt:2290},{name:"Page D",uv:2780,pv:3908,amt:2e3},{name:"Page E",uv:1890,pv:4800,amt:2181},{name:"Page F",uv:2390,pv:3800,amt:2500},{name:"Page G",uv:3490,pv:4300,amt:2100},
    {name:"Page A",uv:4e3,pv:2400,amt:2400},{name:"Page B",uv:3e3,pv:1398,amt:2210},{name:"Page C",uv:2e3,pv:9800,amt:2290},{name:"Page D",uv:2780,pv:3908,amt:2e3},{name:"Page E",uv:1890,pv:4800,amt:2181},{name:"Page F",uv:2390,pv:3800,amt:2500},{name:"Page G",uv:3490,pv:4300,amt:2100},
  ];




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
        <div className="flex-1"><Stat title={'1.2'} description={'Overall assessment'} color={getColorFromStatus(0)} /></div>
        <div className="flex-1"><Stat title={'1.2'} description={'Acidity (pH)'} color={getColorFromStatus(1)} /></div>
        <div className="flex-1"><Stat title={'1.2'} description={'Turbidity (NTU)'} color={getColorFromStatus(2)} /></div>
        <div className="flex-1"><Stat title={'1.2'} description={'Total Dissolved Solids (PPM)'} color={getColorFromStatus(3)} /></div>
      </div>

      <div className="flex gap-4 p-4">
        <div className="flex-1"><Graph title={'Acidity (pH)'} description={'How acidic the water is.'} data={data} /></div>
        <div className="flex-1"><Graph title={'Turbidity (NTU)'} description={'How clear the water is.'} data={data} /></div>
        <div className="flex-1"><Graph title={'Total Dissolved Solids (PPM)'} description={'How much solids are dissolved.'} data={data} /></div>
        {/* <div className="flex-1"><Graph data={data} /></div>
        <div className="flex-1"><Graph data={data} /></div> */}
      </div>
    </>
  );
}








