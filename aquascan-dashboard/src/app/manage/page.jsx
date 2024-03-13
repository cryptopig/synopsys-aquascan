'use client';

// import dynamic from 'next/dynamic';
// import { useMemo } from 'react';

// import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet"

export default function Page() {
  // const Map = useMemo(() => dynamic(
  //   () => import('@/app/manage/map'),
  //   { 
  //     loading: () => <p>A map is loading</p>,
  //     ssr: false
  //   }
  // ), []);

  // return (
  //   <div>
  //     <Map position={[51.505, -0.09]} zoom={13} />
  //   </div>
  // );

  const position = [51.505, -0.09];

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}