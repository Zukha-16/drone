import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  PolylineF,
} from "@react-google-maps/api";
import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useEffect } from "react";

type LatLng = {
  lat: number;
  lng: number;
};

const Home: NextPage = () => {
  const start = { lat: 51.5034583333, lng: -0.0868694444444 };
  const end = { lat: 51.498016, lng: -0.118011 };
  const [dronePosition, setDronePosition] = useState(start);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [droneStartPos, setDroneStartPos] = useState<LatLng>();
  const [droneEndPos, setDroneEndPos] = useState<LatLng>();
  const [path, setPath] = useState<LatLng[]>();
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: 51.4999624, lng: -0.1026524 }), []);

  useEffect(() => {
    const startRef = doc(db, "dronepositions", "start");
    const startSnap = getDoc(startRef);
    startSnap.then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data !== undefined) {
          setDroneStartPos(data as LatLng);
        }
      } else {
        alert("No such document in DB!");
      }
    });
    const endRef = doc(db, "dronepositions", "end");
    const endSnap = getDoc(endRef);
    endSnap.then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data !== undefined) {
          setDroneEndPos(data as LatLng);
        }
      } else {
        alert("No such document in DB!");
      }
    });
    if (droneStartPos && droneEndPos) {
      setPath([droneStartPos, droneEndPos]);
    }
  }, [dronePosition]);

  async function simulateDroneMovement(
    start: LatLng,
    end: LatLng,
    updatePosition: (position: LatLng) => void,
    speed = 50
  ) {
    const latStep = (end.lat - start.lat) / 10000;
    const lngStep = (end.lng - start.lng) / 10000;
    let i = 0;

    const intervalId = setInterval(() => {
      const newPosition = {
        lat: start.lat + i * latStep,
        lng: start.lng + i * lngStep,
      };
      updatePosition(newPosition);
      i++;

      if (i > 10000) {
        clearInterval(intervalId);
        setButtonDisabled(false);
      }
    }, speed);
  }
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
      zoomControl: true,
      zoom: 13.5,
    }),
    []
  );

  const droneOption = {
    strokeColor: "#0051ff",
    strokeOpacity: 0.8,
    strokeWeight: 3,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    icons: [],
    path: path ? path : [],
    visible: true,
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return (
      <p className="text-lg lg:text-2xl xl:text-4xl text-center">Loading...</p>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-screen">
      <p className="text-4xl xl:text-6xl my-4 font-semibold">Drone tracker</p>
      <div className="flex flex-col lg:flex-row items-start w-full px-4 gap-4 lg:justify-around">
        <button
          disabled={buttonDisabled}
          className={`form_btn 
          ${buttonDisabled ? "cursor-not-allowed" : "bg-blue-500"}
          `}
          onClick={() => {
            if (droneStartPos === undefined || droneEndPos === undefined) {
              alert("Drone is not ready to fly");
              return;
            }
            if (
              dronePosition.lat === droneStartPos.lat &&
              dronePosition.lng === droneStartPos.lng
            ) {
              alert("Drone is already at Guy's hospital");
              return;
            }
            simulateDroneMovement(
              droneEndPos,
              droneStartPos,
              setDronePosition,
              50
            );

            setButtonDisabled(true);
          }}
        >
          Send drone to Guy's hospital
        </button>
        <button
          disabled={buttonDisabled}
          className={`form_btn 
          ${buttonDisabled ? "cursor-not-allowed" : "bg-blue-500"}
          `}
          onClick={() => {
            if (droneStartPos === undefined || droneEndPos === undefined) {
              alert("Drone is not ready to fly");
              return;
            }
            if (
              dronePosition.lat === droneEndPos.lat &&
              dronePosition.lng === droneEndPos.lng
            ) {
              alert("Drone is already at St Thomas' hospital");
              return;
            }
            simulateDroneMovement(
              droneStartPos,
              droneEndPos,
              setDronePosition,
              50
            );
            setButtonDisabled(true);
          }}
        >
          Send drone to St Thomas' hospital
        </button>
      </div>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: "100vw", height: "700px" }}
        onLoad={() => console.log("Map Component Loaded...")}
      >
        <MarkerF position={start} />
        <MarkerF position={end} />
        <PolylineF options={droneOption} />
        <MarkerF
          position={dronePosition}
          icon={{
            url: "/images/drone.png",
            scaledSize: new window.google.maps.Size(50, 50),
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default Home;
