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

    const city = addr.city || addr.town || addr.village || addr.county;
    const area = addr.suburb || addr.neighbourhood || addr.quarter;
    const road = addr.road;
    const houseNumber = addr.house_number;
    const streetAddress = [houseNumber, road].filter(Boolean).join(" ");

    return { city, area, streetAddress: streetAddress || undefined };
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

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15);
    }
  }, [center, map]);
  return null;
}

export default function GoogleMapPicker({
  onLocationPick,
  searchQuery,
}: {
  onLocationPick: (loc: PickedLocation) => void;
  searchQuery?: string;
}) {
  const [marker, setMarker] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const lastClickTime = useRef<number>(0);

  const handlePick = useCallback(
    async (lat: number, lng: number) => {
      lastClickTime.current = Date.now();
      setMarker([lat, lng]);
      const address = await reverseGeocode(lat, lng);
      onLocationPick({ lat, lng, ...address });
    },
    [onLocationPick]
  );

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setIsSearching(true);
    const coords = await forwardGeocode(searchInput);
    if (coords) {
      await handlePick(coords[0], coords[1]);
    }
    setIsSearching(false);
  };

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);

    try {
      // First attempt to get the device's IP-based physical location (bypasses browser prompts)
      const res = await fetch("https://ipapi.co/json/");
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          await handlePick(data.latitude, data.longitude);
          setIsLocating(false);
          return;
        }
      }
    } catch (e) {
      console.error("IP Geolocation failed, falling back to browser API:", e);
    }

    // Fallback to browser's GPS/Location API if IP API fails
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePick(pos.coords.latitude, pos.coords.longitude).finally(() =>
          setIsLocating(false)
        );
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Automatically request location on component mount
  useEffect(() => {
    handleUseCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map pin when the user types an address (forward geocoding)
  useEffect(() => {
    if (!searchQuery) return;
    
    const delay = setTimeout(async () => {
      // Don't forward-geocode if this address change was caused by a map click auto-fill
      if (Date.now() - lastClickTime.current < 2000) return;
      
      const coords = await forwardGeocode(searchQuery);
      if (coords) {
        setMarker(coords);
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
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 rounded-lg border border-stroke px-3 py-1.5 font-['Montserrat'] text-xs font-semibold text-foreground hover:bg-gray-light transition disabled:opacity-50"
        >
          <LocateFixed className="h-3.5 w-3.5" />
          {isLocating ? "Locating..." : "Use my current location"}
        </button>
      </div>

      {/* Manual Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a specific place..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className="w-full h-11 rounded-xl border border-stroke bg-background px-4 pr-12 font-['Montserrat'] text-sm text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-text hover:text-foreground transition disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-stroke">
        <MapContainer
          center={marker ?? DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "280px", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={marker} />
          <ClickHandler onPick={handlePick} />
          {marker && <Marker position={marker} />}
        </MapContainer>
      </div>

      <p className="font-['Montserrat'] text-xs text-gray-text">
        {marker
          ? `Selected: ${marker[0].toFixed(5)}, ${marker[1].toFixed(5)}`
          : "Click anywhere on the map to drop a pin, or use your current location."}
      </p>
    </div>
  );
}