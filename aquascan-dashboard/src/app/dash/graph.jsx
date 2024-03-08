'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';






export default function Page({data, title, description, values, referenceLines}) {

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            // width={500}
            // height={300}
            width={350}
            height={180}
            data={data}
            margin={{
              // top: 20,
              // right: 50,
              // left: 20,
              // bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <ReferenceLine y={9000} label="Allowed by state" stroke="red" /> */}
            {referenceLines.map(value => {
              return (
                // Says whether safe, unsafe, or moderate
                // <ReferenceLine y={value[0]} label={value[1]} stroke={value[2]} />
                <ReferenceLine key={value[0] + value[1] + value[2]} y={value[0]} stroke={value[2]} />
              );
            })}
            {/* Add 'isAnimationActive={false}' to disable animation */}
            {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
            {values.map(value => {
              return (
                <Line key={value} type="monotone" dataKey={value} stroke="#82ca9d" />
              );
            })}
          </LineChart>
        </CardContent>
      </Card>

    </>
  );
}