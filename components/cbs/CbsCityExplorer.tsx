"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Building2,
  ChevronRight,
  Cross,
  Fuel,
  Layers3,
  LocateFixed,
  Map,
  MapPin,
  Menu,
  Navigation,
  Route,
  Sparkles,
  Trees,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./CbsCityExplorer.module.css";

type Mode = "compare" | "layers" | "route";
type LayerKey =
  | "hotels"
  | "restaurants"
  | "museums"
  | "parks"
  | "health"
  | "fuel"
  | "heritage";
type RouteKey = "fast" | "scenic" | "transit";
type RoadKind = "local" | "arterial" | "scenic" | "transit";

type MapPoint = {
  x: number;
  y: number;
};

type Poi = MapPoint & {
  id: number;
  name: string;
  detail: string;
  layer: LayerKey;
  accessNode: string;
  access?: MapPoint;
};

type RoadEdge = {
  from: string;
  to: string;
  kind: RoadKind;
};

type RouteResult = {
  points: MapPoint[];
  distance: number;
  distanceLabel: string;
  timeLabel: string;
};

const MAP_WIDTH = 1672;
const MAP_HEIGHT = 941;
const START_NODE = "start";
const KM_PER_PIXEL = 0.00235;

const layerMeta: Record<
  LayerKey,
  { label: string; description: string; color: string; icon: typeof BedDouble }
> = {
  hotels: { label: "Oteller", description: "Konaklama", color: "#20b8a6", icon: BedDouble },
  restaurants: {
    label: "Restoranlar",
    description: "Yeme ve içme",
    color: "#f06c4f",
    icon: Utensils,
  },
  museums: { label: "Müzeler", description: "Kültür", color: "#e3a62f", icon: Building2 },
  parks: { label: "Parklar", description: "Yeşil alanlar", color: "#42a866", icon: Trees },
  health: { label: "Sağlık", description: "Hastane ve eczane", color: "#568cd6", icon: Cross },
  fuel: { label: "Yakıt", description: "İstasyonlar", color: "#6d9d55", icon: Fuel },
  heritage: {
    label: "Tarihî yerler",
    description: "Kültürel miras",
    color: "#9a6bb0",
    icon: MapPin,
  },
};

const points: Poi[] = [
  { id: 1, name: "Nehir Oteli", detail: "4,7 · 24 saat açık", layer: "hotels", x: 1271, y: 263, accessNode: "c2", access: { x: 1265, y: 350 } },
  { id: 2, name: "Park Konaklama", detail: "4,5 · Parka 2 dk", layer: "hotels", x: 987, y: 442, accessNode: "h450b", access: { x: 987, y: 450 } },
  { id: 3, name: "Çarşı Lokantası", detail: "Yerel mutfak", layer: "restaurants", x: 485, y: 518, accessNode: "oldMarket" },
  { id: 4, name: "Kıyı Restoranı", detail: "Deniz ürünleri", layer: "restaurants", x: 234, y: 659, accessNode: "westRingS" },
  { id: 5, name: "Kent Müzesi", detail: "09.00–18.00", layer: "museums", x: 903, y: 395, accessNode: "museumGate" },
  { id: 6, name: "Modern Sanat Merkezi", detail: "10.00–20.00", layer: "museums", x: 167, y: 151, accessNode: "westRingN2" },
  { id: 7, name: "Şehir Hastanesi", detail: "Acil servis", layer: "health", x: 1471, y: 160, accessNode: "r0", access: { x: 1471, y: 95 } },
  { id: 8, name: "Merkez Eczane", detail: "Nöbetçi", layer: "health", x: 1154, y: 518, accessNode: "c4", access: { x: 1154, y: 560 } },
  { id: 9, name: "Güney Yakıt", detail: "24 saat", layer: "fuel", x: 1187, y: 743, accessNode: "c5", access: { x: 1187, y: 690 } },
  { id: 10, name: "Kıyı İstasyonu", detail: "24 saat", layer: "fuel", x: 368, y: 790, accessNode: "westSouth", access: { x: 368, y: 790 } },
  { id: 11, name: "Tarihî Çarşı", detail: "Koruma alanı", layer: "heritage", x: 385, y: 395, accessNode: "oldHeritage", access: { x: 385, y: 400 } },
  { id: 12, name: "Saat Meydanı", detail: "Kültür rotası", layer: "heritage", x: 568, y: 452, accessNode: "oldClock", access: { x: 568, y: 480 } },
  { id: 13, name: "Nehir Parkı", detail: "Yürüyüş ve dinlenme alanı", layer: "parks", x: 825, y: 246, accessNode: "parkPlaza" },
  { id: 14, name: "Kıyı Parkı", detail: "Sahil ve seyir alanı", layer: "parks", x: 145, y: 132, accessNode: "westRingN2" },
];

const routeMeta: Record<
  RouteKey,
  { name: string; note: string; color: string }
> = {
  fast: { name: "En hızlı", note: "Ana caddeler", color: "#20b8a6" },
  scenic: { name: "Manzaralı", note: "Park ve nehir", color: "#f06c4f" },
  transit: { name: "Toplu taşıma", note: "Durak bağlantılı", color: "#e3a62f" },
};

const roadNodes: Record<string, MapPoint> = {
  start: { x: 520, y: 692 },
  s3: { x: 620, y: 684 },
  s4: { x: 820, y: 680 },
  s5: { x: 980, y: 675 },
  c5: { x: 1160, y: 685 },
  r5: { x: 1560, y: 650 },
  farS: { x: 1640, y: 650 },

  westSouth: { x: 340, y: 790 },
  oldBottom1: { x: 420, y: 690 },
  oldGateSouth: { x: 330, y: 680 },
  westRingS: { x: 235, y: 655 },
  westRingM1: { x: 205, y: 560 },
  westRingM2: { x: 180, y: 470 },
  westRingM3: { x: 165, y: 370 },
  westRingN1: { x: 160, y: 250 },
  westRingN2: { x: 180, y: 180 },
  northBridgeW: { x: 350, y: 170 },
  northBridgeM: { x: 440, y: 140 },
  northBridgeE: { x: 520, y: 115 },

  northA: { x: 700, y: 100 },
  northB: { x: 900, y: 95 },
  northC: { x: 1080, y: 95 },
  c0: { x: 1200, y: 95 },
  r0: { x: 1560, y: 90 },
  farN: { x: 1640, y: 95 },

  c1: { x: 1205, y: 185 },
  r1: { x: 1560, y: 180 },

  p2: { x: 815, y: 370 },
  h330b: { x: 1000, y: 350 },
  c2: { x: 1205, y: 350 },
  r2: { x: 1560, y: 350 },
  h330f: { x: 1500, y: 350 },

  p3: { x: 820, y: 450 },
  museumGate: { x: 900, y: 450 },
  h450b: { x: 1000, y: 450 },
  c3: { x: 1200, y: 450 },
  r3: { x: 1560, y: 450 },
  h450f: { x: 1500, y: 450 },

  p4: { x: 830, y: 560 },
  h560b: { x: 1000, y: 560 },
  c4: { x: 1200, y: 560 },
  r4: { x: 1560, y: 560 },
  h560f: { x: 1500, y: 560 },

  parkPlaza: { x: 825, y: 246 },
  parkEastWalk: { x: 900, y: 245 },
  parkEastGate: { x: 1005, y: 300 },
  oldSouth: { x: 580, y: 630 },
  oldRiver: { x: 590, y: 480 },
  oldClock: { x: 550, y: 480 },
  oldMarket: { x: 485, y: 520 },
  oldWest: { x: 300, y: 580 },
  oldHeritage: { x: 350, y: 400 },
};

const roadEdges: RoadEdge[] = [
  { from: "start", to: "s3", kind: "transit" },
  { from: "s3", to: "s4", kind: "transit" },
  { from: "s4", to: "s5", kind: "transit" },
  { from: "s5", to: "c5", kind: "transit" },
  { from: "c5", to: "r5", kind: "transit" },
  { from: "r5", to: "farS", kind: "transit" },

  { from: "start", to: "oldBottom1", kind: "scenic" },
  { from: "oldBottom1", to: "oldGateSouth", kind: "scenic" },
  { from: "oldGateSouth", to: "westRingS", kind: "scenic" },
  { from: "oldGateSouth", to: "westSouth", kind: "local" },
  { from: "westRingS", to: "westRingM1", kind: "scenic" },
  { from: "westRingM1", to: "westRingM2", kind: "scenic" },
  { from: "westRingM2", to: "westRingM3", kind: "scenic" },
  { from: "westRingM3", to: "westRingN1", kind: "scenic" },
  { from: "westRingN1", to: "westRingN2", kind: "scenic" },
  { from: "westRingN2", to: "northBridgeW", kind: "scenic" },
  { from: "northBridgeW", to: "northBridgeM", kind: "scenic" },
  { from: "northBridgeM", to: "northBridgeE", kind: "scenic" },

  { from: "northBridgeE", to: "northA", kind: "arterial" },
  { from: "northA", to: "northB", kind: "arterial" },
  { from: "northB", to: "northC", kind: "arterial" },
  { from: "northC", to: "c0", kind: "arterial" },
  { from: "c0", to: "r0", kind: "transit" },
  { from: "r0", to: "farN", kind: "transit" },

  { from: "c0", to: "c1", kind: "arterial" },
  { from: "c1", to: "c2", kind: "arterial" },
  { from: "c2", to: "c3", kind: "arterial" },
  { from: "c3", to: "c4", kind: "arterial" },
  { from: "c4", to: "c5", kind: "arterial" },
  { from: "r0", to: "r1", kind: "transit" },
  { from: "r1", to: "r2", kind: "transit" },
  { from: "r2", to: "r3", kind: "transit" },
  { from: "r3", to: "r4", kind: "transit" },
  { from: "r4", to: "r5", kind: "transit" },

  { from: "p2", to: "h330b", kind: "local" },
  { from: "h330b", to: "c2", kind: "arterial" },
  { from: "c2", to: "r2", kind: "arterial" },
  { from: "r2", to: "h330f", kind: "arterial" },
  { from: "p3", to: "museumGate", kind: "local" },
  { from: "museumGate", to: "h450b", kind: "local" },
  { from: "h450b", to: "c3", kind: "arterial" },
  { from: "c3", to: "r3", kind: "arterial" },
  { from: "r3", to: "h450f", kind: "arterial" },
  { from: "p4", to: "h560b", kind: "local" },
  { from: "h560b", to: "c4", kind: "arterial" },
  { from: "c4", to: "r4", kind: "arterial" },
  { from: "r4", to: "h560f", kind: "arterial" },

  { from: "s4", to: "p4", kind: "scenic" },
  { from: "p4", to: "p3", kind: "scenic" },
  { from: "p3", to: "p2", kind: "scenic" },
  { from: "p2", to: "parkPlaza", kind: "scenic" },
  { from: "parkPlaza", to: "parkEastWalk", kind: "scenic" },
  { from: "parkEastWalk", to: "parkEastGate", kind: "scenic" },
  { from: "parkEastGate", to: "h330b", kind: "scenic" },

  { from: "oldSouth", to: "s3", kind: "local" },
  { from: "oldSouth", to: "oldRiver", kind: "local" },
  { from: "oldRiver", to: "oldClock", kind: "local" },
  { from: "oldClock", to: "oldMarket", kind: "local" },
  { from: "oldMarket", to: "oldWest", kind: "local" },
  { from: "oldWest", to: "westRingM1", kind: "local" },
  { from: "oldMarket", to: "oldHeritage", kind: "local" },
  { from: "oldHeritage", to: "westRingM2", kind: "local" },
  { from: "oldHeritage", to: "westRingM3", kind: "local" },
];

const routeWeights: Record<RouteKey, Record<RoadKind, number>> = {
  fast: { local: 1, arterial: 0.68, scenic: 1.18, transit: 0.62 },
  scenic: { local: 0.86, arterial: 1.55, scenic: 0.4, transit: 1.8 },
  transit: { local: 1.9, arterial: 0.88, scenic: 2.25, transit: 0.34 },
};

function pointDistance(a: MapPoint, b: MapPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function findRoadPath(startNode: string, targetNode: string, route: RouteKey) {
  const distances = new globalThis.Map<string, number>(
    Object.keys(roadNodes).map((node) => [node, node === startNode ? 0 : Number.POSITIVE_INFINITY]),
  );
  const previous = new globalThis.Map<string, string>();
  const unvisited = new Set(Object.keys(roadNodes));
  const adjacency = new globalThis.Map<string, Array<{ node: string; kind: RoadKind }>>();

  roadEdges.forEach((edge) => {
    adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), { node: edge.to, kind: edge.kind }]);
    adjacency.set(edge.to, [...(adjacency.get(edge.to) ?? []), { node: edge.from, kind: edge.kind }]);
  });

  while (unvisited.size) {
    let current: string | null = null;
    let currentDistance = Number.POSITIVE_INFINITY;

    unvisited.forEach((node) => {
      const distance = distances.get(node) ?? Number.POSITIVE_INFINITY;
      if (distance < currentDistance) {
        current = node;
        currentDistance = distance;
      }
    });

    if (!current || current === targetNode) break;
    unvisited.delete(current);

    (adjacency.get(current) ?? []).forEach(({ node, kind }) => {
      if (!unvisited.has(node)) return;
      const candidate =
        currentDistance +
        pointDistance(roadNodes[current as string], roadNodes[node]) * routeWeights[route][kind];
      if (candidate < (distances.get(node) ?? Number.POSITIVE_INFINITY)) {
        distances.set(node, candidate);
        previous.set(node, current as string);
      }
    });
  }

  const path = [targetNode];
  let cursor = targetNode;
  while (cursor !== startNode && previous.has(cursor)) {
    cursor = previous.get(cursor) as string;
    path.unshift(cursor);
  }

  return path[0] === startNode ? path.map((node) => roadNodes[node]) : [roadNodes[startNode]];
}

function buildRoute(target: Poi, route: RouteKey): RouteResult {
  const scenicWaypoint =
    target.accessNode === "parkPlaza"
      ? "parkPlaza"
      : target.x > 700
        ? "northBridgeE"
        : "westRingN2";
  const transitWaypoint = target.x > 1100 ? "r3" : null;
  const stops =
    route === "scenic" && target.accessNode !== scenicWaypoint
      ? [START_NODE, scenicWaypoint, target.accessNode]
      : route === "transit" &&
          transitWaypoint &&
          target.accessNode !== transitWaypoint
        ? [START_NODE, transitWaypoint, target.accessNode]
        : [START_NODE, target.accessNode];
  const pointsOnRoad = stops.slice(1).flatMap((stop, index) => {
    const segment = findRoadPath(stops[index], stop, route);
    return index === 0 ? segment : segment.slice(1);
  });
  const access = target.access ?? roadNodes[target.accessNode];
  const lastPoint = pointsOnRoad.at(-1);
  const routePoints =
    lastPoint && pointDistance(lastPoint, access) > 1
      ? [...pointsOnRoad, access]
      : pointsOnRoad;
  const pixelDistance = routePoints
    .slice(1)
    .reduce((total, point, index) => total + pointDistance(routePoints[index], point), 0);
  const distance = Math.max(0.1, pixelDistance * KM_PER_PIXEL);
  const minutes =
    route === "fast"
      ? Math.max(2, Math.round((distance / 18) * 60 + 2))
      : route === "scenic"
        ? Math.max(3, Math.round((distance / 12) * 60))
        : Math.max(4, Math.round((distance / 22) * 60 + 4));

  return {
    points: routePoints,
    distance,
    distanceLabel: `${distance.toLocaleString("tr-TR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} km`,
    timeLabel: `${minutes} dk`,
  };
}

const initialLayers: Record<LayerKey, boolean> = {
  hotels: true,
  restaurants: true,
  museums: true,
  parks: true,
  health: false,
  fuel: false,
  heritage: false,
};

export function CbsCityExplorer() {
  const [mode, setMode] = useState<Mode>("compare");
  const [layers, setLayers] = useState(initialLayers);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(points[0]);
  const [selectedRoute, setSelectedRoute] = useState<RouteKey>("fast");
  const [mobilePanel, setMobilePanel] = useState<"mission" | "layers" | null>(null);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const mapStageRef = useRef<HTMLDivElement>(null);

  const visiblePoints = points.filter((point) => layers[point.layer]);
  const openLayerCount = Object.values(layers).filter(Boolean).length;
  const targetPoi = selectedPoi ?? points[0];
  const routeKeys = Object.keys(routeMeta) as RouteKey[];
  const routeResults = useMemo(
    () =>
      Object.fromEntries(
        routeKeys.map((key) => [key, buildRoute(targetPoi, key)]),
      ) as Record<RouteKey, RouteResult>,
    [targetPoi],
  );
  const targetAccess = targetPoi.access ?? roadNodes[targetPoi.accessNode];

  useEffect(() => {
    const mapStage = mapStageRef.current;
    if (!mapStage) return;

    const updateSize = () =>
      setMapSize({ width: mapStage.clientWidth, height: mapStage.clientHeight });
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(mapStage);
    return () => observer.disconnect();
  }, []);

  function projectPoint(point: MapPoint): CSSProperties {
    if (!mapSize.width || !mapSize.height) {
      return {
        left: `${(point.x / MAP_WIDTH) * 100}%`,
        top: `${(point.y / MAP_HEIGHT) * 100}%`,
      };
    }

    const scale = Math.max(mapSize.width / MAP_WIDTH, mapSize.height / MAP_HEIGHT);
    const offsetX = (mapSize.width - MAP_WIDTH * scale) / 2;
    const offsetY = (mapSize.height - MAP_HEIGHT * scale) / 2;

    return {
      left: point.x * scale + offsetX,
      top: point.y * scale + offsetY,
    };
  }

  function toggleLayer(layer: LayerKey) {
    setLayers((current) => ({ ...current, [layer]: !current[layer] }));
    setMode("layers");
  }

  function chooseMode(nextMode: Mode) {
    setMode(nextMode);
    if (nextMode === "layers") setMobilePanel("layers");
    if (nextMode === "compare") setMobilePanel("mission");
    if (nextMode === "route") setMobilePanel("mission");
  }

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span className={styles.logo}>
            <Map aria-hidden="true" size={22} strokeWidth={2.4} />
          </span>
          <span>
            <strong>CBS ile Şehri Keşfet</strong>
            <small>Co_LAB etkileşimli öğrenme alanı</small>
          </span>
        </Link>

        <nav className={styles.modeNav} aria-label="Öğrenme aşamaları">
          <button
            className={mode === "compare" ? styles.activeMode : ""}
            onClick={() => chooseMode("compare")}
            type="button"
          >
            <Map size={17} /> Karşılaştır
          </button>
          <button
            className={mode === "layers" ? styles.activeMode : ""}
            onClick={() => chooseMode("layers")}
            type="button"
          >
            <Layers3 size={17} /> Katmanlar
          </button>
          <button
            className={mode === "route" ? styles.activeMode : ""}
            onClick={() => chooseMode("route")}
            type="button"
          >
            <Route size={17} /> Rota
          </button>
        </nav>

        <div className={styles.headerActions}>
          <span className={styles.progress}>
            <i style={{ width: mode === "compare" ? "33%" : mode === "layers" ? "66%" : "100%" }} />
          </span>
          <button
            className={styles.mobileButton}
            onClick={() => setMobilePanel(mobilePanel ? null : "layers")}
            type="button"
            aria-label="Araçları aç"
          >
            <Menu size={20} />
          </button>
          <Link className={styles.exitButton} href="/">
            Çıkış
          </Link>
        </div>
      </header>

      <section className={styles.workspace}>
        <aside
          className={`${styles.missionPanel} ${
            mobilePanel === "mission" ? styles.mobileOpen : ""
          }`}
        >
          <button
            className={styles.panelClose}
            onClick={() => setMobilePanel(null)}
            type="button"
            aria-label="Paneli kapat"
          >
            <X size={18} />
          </button>

          <div className={styles.missionBadge}>
            <Sparkles size={15} /> Konuya başlarken
          </div>

          {mode === "compare" && (
            <>
              <h1>Bir şehir, iki farklı rehber</h1>
              <p>
                Basılı harita yalnızca yolları gösterir. Dijital CBS ise konum,
                mesafe, güzergâh ve çevredeki mekânları aynı anda ilişkilendirir.
              </p>
              <figure className={styles.sourceCard}>
                <Image
                  alt="Gezi rehberi haritası ile dijital harita karşılaştırması"
                  fill
                  priority
                  sizes="(max-width: 900px) 86vw, 330px"
                  src="/cbs/gezi-rehberi-dijital-harita.webp"
                />
              </figure>
              <div className={styles.compareLabels}>
                <span>Basılı rehber</span>
                <ChevronRight size={16} />
                <span>Dijital CBS</span>
              </div>
              <div className={styles.questionBox}>
                <strong>Keşif sorusu</strong>
                <span>Dijital harita, kâğıt haritadan farklı olarak hangi bilgileri sunuyor?</span>
              </div>
              <button className={styles.primaryButton} onClick={() => chooseMode("layers")} type="button">
                Şehri katmanlarına ayır <ChevronRight size={18} />
              </button>
            </>
          )}

          {mode === "layers" && (
            <>
              <h1>Şehri katman katman oku</h1>
              <p>
                Her katman aynı türdeki mekânları bir araya getirir. Sağdaki
                anahtarlardan bir veri grubunu aç veya kapat.
              </p>
              <div className={styles.miniStats}>
                <div><strong>{openLayerCount}</strong><span>Açık katman</span></div>
                <div><strong>{visiblePoints.length}</strong><span>Görünen mekân</span></div>
              </div>
              {selectedPoi ? (
                <div className={styles.poiDetail}>
                  <span
                    className={styles.poiDetailIcon}
                    style={{ background: layerMeta[selectedPoi.layer].color }}
                  >
                    <MapPin size={18} />
                  </span>
                  <div>
                    <small>Seçili mekân</small>
                    <strong>{selectedPoi.name}</strong>
                    <span>{selectedPoi.detail}</span>
                  </div>
                </div>
              ) : (
                <div className={styles.questionBox}>Haritadaki bir işarete dokun.</div>
              )}
              <div className={styles.learningNote}>
                <Layers3 size={20} />
                <div>
                  <strong>CBS mantığı</strong>
                  <span>Farklı veri katmanları aynı konum üzerinde üst üste gösterilir.</span>
                </div>
              </div>
              <button className={styles.primaryButton} onClick={() => chooseMode("route")} type="button">
                Alternatif rotaları incele <ChevronRight size={18} />
              </button>
            </>
          )}

          {mode === "route" && (
            <>
              <h1>Tek hedef, üç farklı rota</h1>
              <p>
                En kısa yol her zaman en uygun yol değildir. Süre, mesafe ve
                yol üzerindeki mekânları birlikte değerlendir.
              </p>
              <div className={styles.poiDetail}>
                <span
                  className={styles.poiDetailIcon}
                  style={{ background: layerMeta[targetPoi.layer].color }}
                >
                  <Navigation size={18} />
                </span>
                <div>
                  <small>Rota hedefi</small>
                  <strong>{targetPoi.name}</strong>
                  <span>Değiştirmek için haritadaki başka bir noktayı seç.</span>
                </div>
              </div>
              <div className={styles.routeList}>
                {routeKeys.map((key) => {
                  const item = routeMeta[key];
                  const result = routeResults[key];
                  return (
                    <button
                      className={selectedRoute === key ? styles.selectedRoute : ""}
                      key={key}
                      onClick={() => setSelectedRoute(key)}
                      type="button"
                    >
                      <i style={{ background: item.color }} />
                      <span><strong>{item.name}</strong><small>{item.note}</small></span>
                      <span><strong>{result.timeLabel}</strong><small>{result.distanceLabel}</small></span>
                    </button>
                  );
                })}
              </div>
              <div className={styles.questionBox}>
                <strong>Karar ver</strong>
                <span>15 dakikan var ve parkı görmek istiyorsun. Hangi rotayı seçersin?</span>
              </div>
              <button className={styles.primaryButton} onClick={() => chooseMode("compare")} type="button">
                Etkinliği yeniden başlat
              </button>
            </>
          )}
        </aside>

        <div className={styles.mapStage} ref={mapStageRef}>
          <Image
            alt="Kuşbakışı ayrıntılı şehir görünümü"
            className={styles.cityImage}
            fill
            priority
            sizes="100vw"
            src="/cbs/sehir-kusbakisi.webp"
          />
          <div className={styles.mapShade} />

          <div className={styles.mapTitle}>
            <span>Şehir</span>
            <small>Canlı harita · Kuşbakışı görünüm</small>
          </div>

          <div className={styles.locateButton}>
            <LocateFixed size={18} /> Başlangıç noktası
          </div>

          {mode === "route" && (
            <svg
              className={styles.routeOverlay}
              preserveAspectRatio="xMidYMid slice"
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              aria-label="Alternatif güzergâhlar"
            >
              <polyline
                className={styles.routeHalo}
                points={routeResults[selectedRoute].points
                  .map((point) => `${point.x},${point.y}`)
                  .join(" ")}
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                className={styles.routeActive}
                points={routeResults[selectedRoute].points
                  .map((point) => `${point.x},${point.y}`)
                  .join(" ")}
                stroke={routeMeta[selectedRoute].color}
                strokeDasharray={selectedRoute === "transit" ? "14 10" : undefined}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}

          <span className={styles.userMarker} style={projectPoint(roadNodes[START_NODE])}>
            <Navigation size={17} fill="currentColor" />
          </span>
          {mode === "route" && (
            <span className={styles.targetMarker} style={projectPoint(targetAccess)}>
              <Navigation size={18} />
            </span>
          )}

          {visiblePoints.map((point) => {
            const meta = layerMeta[point.layer];
            const Icon = meta.icon;
            return (
              <button
                aria-label={point.name}
                className={`${styles.poiMarker} ${
                  selectedPoi?.id === point.id ? styles.selectedPoi : ""
                }`}
                key={point.id}
                onClick={() => {
                  setSelectedPoi(point);
                  if (mode !== "route") setMode("layers");
                }}
                style={{ ...projectPoint(point), background: meta.color }}
                type="button"
              >
                <Icon size={15} strokeWidth={2.4} />
                <span className={point.x > MAP_WIDTH * 0.68 ? styles.poiLabelLeft : ""}>
                  {point.name}
                </span>
              </button>
            );
          })}

          <div
            className={`${styles.dataStrip} ${
              mode === "route" ? styles.routeDataStrip : ""
            }`}
          >
            <span><LocateFixed size={16} /><b>Başlangıç</b> Gezi noktası</span>
            <span><Navigation size={16} /><b>Hedef</b> {targetPoi.name}</span>
            <span><Route size={16} /><b>Ölçülen rota</b> {routeResults[selectedRoute].distanceLabel}</span>
            <span><Layers3 size={16} /><b>Katman</b> {openLayerCount} açık</span>
          </div>
        </div>

        <aside
          className={`${styles.layerPanel} ${
            mode === "route" ? styles.routeLayerPanel : ""
          } ${mobilePanel === "layers" ? styles.mobileOpen : ""}`}
        >
          <button
            className={styles.panelClose}
            onClick={() => setMobilePanel(null)}
            type="button"
            aria-label="Paneli kapat"
          >
            <X size={18} />
          </button>
          <div className={styles.panelHeading}>
            <span><Layers3 size={18} /></span>
            <div><strong>Veri katmanları</strong><small>Görünürlüğü yönet</small></div>
          </div>
          <div className={styles.layerList}>
            {(Object.keys(layerMeta) as LayerKey[]).map((key) => {
              const meta = layerMeta[key];
              const Icon = meta.icon;
              return (
                <button
                  className={layers[key] ? styles.layerOn : ""}
                  key={key}
                  onClick={() => toggleLayer(key)}
                  type="button"
                >
                  <span className={styles.layerIcon} style={{ background: meta.color }}>
                    <Icon size={17} />
                  </span>
                  <span><strong>{meta.label}</strong><small>{meta.description}</small></span>
                  <i><b /></i>
                </button>
              );
            })}
          </div>
          <div className={styles.panelTip}>
            <strong>Katman nedir?</strong>
            <p>Ortak özelliğe sahip coğrafi verilerin ayrı bir grup hâlinde gösterimidir.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
