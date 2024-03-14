"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/app/ui/button";

export default function Home() {
  return (
      <>
      <div className="max-h-screen opacity-60" style={{backgroundImage: "url(dirty-water.png)", width: "100%", height: "100%", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
          <div className=""></div>
        </div>
        <div className="text-center text-neutral-content opacity-100" style={{ position: "absolute", top: "50%", left: "50%", transform: "translateX(-50%) translateY(-50%)", zIndex: 999 }}>
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">AquaScan</h1>
            <p className="mb-5">Water quality is a significant issue, especially in large urban centers where water safety is usually not guaranteed. To contribute to solving this issue, we made an affordable and real-time water quality monitoring system that provides easy-to-understand updates about whether water is drinkable.</p>
          </div>
        </div>
      </>
  );
}
