import { useCallback, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LocateFixed, Search, Loader2 } from "lucide-react";

// Leaflet's default marker image paths break under bundlers (Vite/Webpack) — point them at a CDN.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type PickedLocation = {
  lat: number;
  lng: number;
  city?: string;
  area?: string;
  streetAddress?: string;
};

const DEFAULT_CENTER: [number, number] = [30.0131, 31.2089]; // Giza, Egypt
const DEFAULT_ZOOM = 12;

/** Reverse-geocodes lat/lng into address parts using OpenStreetMap's free Nominatim API. */
async function reverseGeocode(lat: number, lng: number): Promise<Partial<PickedLocation>> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return {};
    const data = await res.json();
    const addr = data.address ?? {};

    const city = addr.city || addr.town || addr.village || addr.county || addr.state || addr.region || "Unknown City";
    const area = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || addr.district || "Unknown Area";
    const road = addr.road || addr.pedestrian || addr.path || "";
    const houseNumber = addr.house_number || "";
    const streetAddress = [houseNumber, road].filter(Boolean).join(" ");

    return {
      city,
      area,
      streetAddress: streetAddress || "Unknown Street"
    };
  } catch {
    // Reverse geocoding is best-effort; the pin itself is still captured either way.
    return {};
  }
}

/** Forward-geocodes an address string into lat/lng using OpenStreetMap's free Nominatim API. */
async function forwardGeocode(query: string): Promise<[number, number] | null> {
  if (!query || query.trim().length < 3) return null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch {
    // Forward geocoding is best-effort.
  }
  return null;
}

function MapCenterTracker({
  onMove,
}: {
  onMove: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    moveend(e) {
      const center = e.target.getCenter();
      onMove(center.lat, center.lng);
    },
  });
  return null;
}

export default function GoogleMapPicker({
  onLocationPick,
  searchQuery,
}: {
  onLocationPick: (loc: PickedLocation) => void;
  searchQuery?: string;
}) {
  const [pendingMarker, setPendingMarker] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const lastClickTime = useRef<number>(0);
  const mapRef = useRef<L.Map | null>(null);

  const commitLocation = async () => {
    if (!pendingMarker) return;
    setIsConfirming(true);
    const [lat, lng] = pendingMarker;
    lastClickTime.current = Date.now();
    const address = await reverseGeocode(lat, lng);
    onLocationPick({ lat, lng, ...address });
    setIsConfirming(false);
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setIsSearching(true);
    const coords = await forwardGeocode(searchInput);
    if (coords) {
      setPendingMarker(coords);
      mapRef.current?.flyTo(coords, 15);
    }
    setIsSearching(false);
  };

  const handleUseCurrentLocation = async (explicit = false) => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      setIsLocating(false);
      if (explicit) alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPendingMarker([lat, lng]);
        mapRef.current?.flyTo([lat, lng], 15);

        // Auto-fill checkout fields immediately
        const address = await reverseGeocode(lat, lng);
        onLocationPick({ lat, lng, ...address });

        setIsLocating(false);
      },
      async (error) => {
        if (explicit) {
          setIsLocating(false);
          if (error.code === error.PERMISSION_DENIED) {
            alert("Location access was denied. Please enable location permissions for this site in your browser settings (usually the lock icon in the address bar).");
          } else {
            alert("Unable to retrieve your location. Please ensure your GPS is enabled.");
          }
        } else {
          // Silent fallback to IP on mount if GPS is blocked/fails
          try {
            const res = await fetch("https://ipapi.co/json/");
            if (res.ok) {
              const data = await res.json();
              if (data.latitude && data.longitude) {
                const lat = data.latitude;
                const lng = data.longitude;
                setPendingMarker([lat, lng]);
                mapRef.current?.flyTo([lat, lng], 15);

                // Auto-fill checkout fields immediately
                const address = await reverseGeocode(lat, lng);
                onLocationPick({ lat, lng, ...address });
              }
            }
          } catch (e) {
            console.error("IP Geolocation fallback failed", e);
          }
          setIsLocating(false);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    if (searchInput.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchInput)}&limit=5`,
          { headers: { Accept: "application/json" } }
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data || []);
        }
      } catch (e) {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  useEffect(() => {
    handleUseCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchQuery) return;
    const delay = setTimeout(async () => {
      if (Date.now() - lastClickTime.current < 2000) return;
      const coords = await forwardGeocode(searchQuery);
      if (coords) {
        setPendingMarker(coords);
        mapRef.current?.flyTo(coords, 15);
      }
    }, 1200);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
          Pin your location on the map
        </span>
        <button
          type="button"
          onClick={() => handleUseCurrentLocation(true)}
          disabled={isLocating}
          className="flex items-center gap-1.5 rounded-lg border border-stroke px-3 py-1.5 font-['Montserrat'] text-xs font-semibold text-foreground hover:bg-gray-light transition disabled:opacity-50"
        >
          <LocateFixed className="h-3.5 w-3.5" />
          {isLocating ? "Locating..." : "Use my current location"}
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search for a specific place..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
              setShowSuggestions(false);
            }
          }}
          className="w-full h-11 rounded-xl border border-stroke bg-background px-4 pr-12 font-['Montserrat'] text-sm text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
        />
        <button
          type="button"
          onClick={() => {
            handleSearch();
            setShowSuggestions(false);
          }}
          disabled={isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-text hover:text-foreground transition disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-stroke rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSearchInput(s.display_name);
                  setShowSuggestions(false);
                  const lat = parseFloat(s.lat);
                  const lng = parseFloat(s.lon);
                  setPendingMarker([lat, lng]);
                  mapRef.current?.flyTo([lat, lng], 15);
                }}
                className="px-4 py-3 border-b border-stroke last:border-0 hover:bg-gray-light cursor-pointer transition font-['Montserrat'] text-sm text-foreground"
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden border border-stroke h-[280px]">
        <MapContainer
          ref={mapRef}
          center={pendingMarker ?? DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenterTracker onMove={(lat, lng) => setPendingMarker([lat, lng])} />
        </MapContainer>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[1000] pointer-events-none pb-1">
          <div className="flex flex-col items-center drop-shadow-md">
            <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center shadow-lg border-2 border-[#BBFF63]">
              <LocateFixed className="h-5 w-5 text-[#BBFF63]" />
            </div>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-foreground" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="font-['Montserrat'] text-xs text-gray-text">
          {pendingMarker
            ? `Pin dropped at: ${pendingMarker[0].toFixed(5)}, ${pendingMarker[1].toFixed(5)}`
            : "Click anywhere on the map to drop a pin."}
        </p>

        <button
          type="button"
          onClick={commitLocation}
          disabled={!pendingMarker || isConfirming}
          className="flex-shrink-0 h-10 px-5 rounded-xl bg-foreground text-background font-['Montserrat'] text-sm font-semibold hover:bg-foreground/90 transition disabled:opacity-50 flex items-center justify-center"
        >
          {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Location"}
        </button>
      </div>
    </div>
  );
}