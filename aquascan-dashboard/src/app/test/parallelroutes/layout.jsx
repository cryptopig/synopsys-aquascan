'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"


export default function Layout({graph}) {
  return (
    // <>
    //   <ResizablePanelGroup direction="horizontal">
    //     <ResizablePanel>{graph}</ResizablePanel>
    //     <ResizableHandle withHandle />
    //     <ResizablePanel>{graph}</ResizablePanel>
    //     <ResizableHandle withHandle />
    //     <ResizablePanel>{graph}</ResizablePanel>
    //   </ResizablePanelGroup>
    // </>
    <>
      {graph}
    </>
  );
}

