import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";

const MapPage: React.FC = () => {
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const mapRef = useRef<google.maps.Map | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    const handleGeocode = () => {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          setPosition({ lat: lat(), lng: lng() });
          setInfoWindowPosition({ lat: lat(), lng: lng() });
          setShowInfoWindow(true);
        } else {
          console.error(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      });
    };

    if (mapRef.current) {
      const map = mapRef.current;

      const clickListener = map.addListener(
        "click",
        (event: google.maps.KmlMouseEvent) => {
          const lat = event.latLng?.lat();
          const lng = event.latLng?.lng();
          if (lat && lng) {
            setPosition({ lat, lng });
            setInfoWindowPosition({ lat, lng });
            setShowInfoWindow(true);
          }
        }
      );

      clickListenerRef.current = clickListener;

      const geocodeButton = document.getElementById("geocode-button");

      if (geocodeButton) {
        geocodeButton.addEventListener("click", handleGeocode);
      }

      return () => {
        if (clickListenerRef.current) {
          clickListenerRef.current.remove();
        }
        if (geocodeButton) {
          geocodeButton.removeEventListener("click", handleGeocode);
        }
      };
    }
  }, [address]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (lat && lng) {
      setPosition({ lat, lng });
      setInfoWindowPosition({ lat, lng });
    }
  };

  const handleInfoWindowClose = () => {
    setShowInfoWindow(false);
  };

  return (
    <div>
      <div style={{ margin: 2 }}>
        <input type="text" value={address} onChange={handleAddressChange} />
        <input type="text" value={position.lat} />
        <input type="text" value={position.lng} />
        <button id="geocode-button">Geocode</button>
      </div>
      <div style={{ height: "400px", width: "100%" }}>
        <LoadScript
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
          }
        >
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "86vh",
            }}
            center={position}
            zoom={15}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            <Marker
              position={position}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
            {showInfoWindow && (
              <InfoWindow
                position={infoWindowPosition}
                onCloseClick={handleInfoWindowClose}
              >
                <div>
                  Latitude: {position.lat}
                  <br />
                  Longitude: {position.lng}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default MapPage;
