"use client";

import { LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_LIBRARIES = ["places"];

export function GoogleMapsWrapper({ children }) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={GOOGLE_MAPS_LIBRARIES}
      loadingElement={
        <input
          disabled
          className="w-full h-10 px-3 bg-gray-100 rounded"
          placeholder="Loading Google Maps..."
        />
      }
    >
      {children}
    </LoadScript>
  );
}
