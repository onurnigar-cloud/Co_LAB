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
  Utensils,
  X,
} from "lucide-react";
import { useState } from "react";
import styles from "./CbsCityExplorer.module.css";

type Mode = "compare" | "layers" | "route";
type LayerKey = "hotels" | "restaurants" | "museums" | "health" | "fuel" | "heritage";
type RouteKey = "fast" | "scenic" | "transit";

type Poi = {
  id: number;
  name: string;
  detail: string;
  layer: LayerKey;
  x: number;
  y: number;
};

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
  { id: 1, name: "Nehir Oteli", detail: "4,7 · 24 saat açık", layer: "hotels", x: 76, y: 28 },
  { id: 2, name: "Park Konaklama", detail: "4,5 · Parka 2 dk", layer: "hotels", x: 59, y: 47 },
  { id: 3, name: "Çarşı Lokantası", detail: "Yerel mutfak · 350 m", layer: "restaurants", x: 29, y: 55 },
  { id: 4, name: "Kıyı Restoranı", detail: "Deniz ürünleri · 1,1 km", layer: "restaurants", x: 14, y: 70 },
  { id: 5, name: "Kent Müzesi", detail: "09.00–18.00 · 1,8 km", layer: "museums", x: 54, y: 42 },
  { id: 6, name: "Modern Sanat Merkezi", detail: "10.00–20.00 · 2,4 km", layer: "museums", x: 10, y: 16 },
  { id: 7, name: "Şehir Hastanesi", detail: "Acil servis · 3,2 km", layer: "health", x: 88, y: 17 },
  { id: 8, name: "Merkez Eczane", detail: "Nöbetçi · 900 m", layer: "health", x: 69, y: 55 },
  { id: 9, name: "Güney Yakıt", detail: "24 saat · 2,7 km", layer: "fuel", x: 71, y: 79 },
  { id: 10, name: "Kıyı İstasyonu", detail: "1,9 km", layer: "fuel", x: 22, y: 84 },
  { id: 11, name: "Tarihî Çarşı", detail: "Koruma alanı · 1,2 km", layer: "heritage", x: 23, y: 42 },
  { id: 12, name: "Saat Meydanı", detail: "Kültür rotası · 1,5 km", layer: "heritage", x: 34, y: 48 },
];

const routes: Record<
  RouteKey,
  { name: string; time: string; distance: string; note: string; color: string }
> = {
  fast: { name: "En hızlı", time: "8 dk", distance: "1,8 km", note: "Ana caddeler", color: "#20b8a6" },
  scenic: { name: "Manzaralı", time: "12 dk", distance: "2,3 km", note: "Park ve nehir", color: "#f06c4f" },
  transit: { name: "Toplu taşıma", time: "10 dk", distance: "3,1 km", note: "1 aktarma", color: "#e3a62f" },
};

const initialLayers: Record<LayerKey, boolean> = {
  hotels: true,
  restaurants: true,
  museums: true,
  health: false,
  fuel: false,
  heritage: false,
};

export function CbsCityExplorer() {
  const [mode, setMode] = useState<Mode>("compare");
  const [layers, setLayers] = useState(initialLayers);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(points[4]);
  const [selectedRoute, setSelectedRoute] = useState<RouteKey>("fast");
  const [mobilePanel, setMobilePanel] = useState<"mission" | "layers" | null>(null);

  const visiblePoints = points.filter((point) => layers[point.layer]);

  const openLayerCount = Object.values(layers).filter(Boolean).length;

  function toggleLayer(layer: LayerKey) {
    setLayers((current) => ({ ...current, [layer]: !current[layer] }));
    setMode("layers");
  }

  function chooseMode(nextMode: Mode) {
    setMode(nextMode);
    if (nextMode === "layers") setMobilePanel("layers");
    if (nextMode === "compare") setMobilePanel("mission");
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
              <div className={styles.routeList}>
                {(Object.keys(routes) as RouteKey[]).map((key) => {
                  const item = routes[key];
                  return (
                    <button
                      className={selectedRoute === key ? styles.selectedRoute : ""}
                      key={key}
                      onClick={() => setSelectedRoute(key)}
                      type="button"
                    >
                      <i style={{ background: item.color }} />
                      <span><strong>{item.name}</strong><small>{item.note}</small></span>
                      <span><strong>{item.time}</strong><small>{item.distance}</small></span>
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

        <div className={styles.mapStage}>
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

          <button className={styles.locateButton} type="button">
            <LocateFixed size={18} /> Konumumu bul
          </button>

          {mode === "route" && (
            <svg
              className={styles.routeOverlay}
              preserveAspectRatio="none"
              viewBox="0 0 1000 650"
              aria-label="Alternatif güzergâhlar"
            >
              <path
                className={selectedRoute === "fast" ? styles.routeActive : ""}
                d="M238 540 C 330 505, 360 430, 445 400 S 625 350, 753 222"
                stroke={routes.fast.color}
              />
              <path
                className={selectedRoute === "scenic" ? styles.routeActive : ""}
                d="M238 540 C 260 445, 350 470, 430 350 S 610 250, 753 222"
                stroke={routes.scenic.color}
              />
              <path
                className={selectedRoute === "transit" ? styles.routeActive : ""}
                d="M238 540 L 305 320 L 520 315 L 680 260 L 753 222"
                stroke={routes.transit.color}
                strokeDasharray="15 10"
              />
            </svg>
          )}

          <span className={styles.userMarker} style={{ left: "23.8%", top: "82%" }}>
            <Navigation size={17} fill="currentColor" />
          </span>
          <span className={styles.targetMarker} style={{ left: "75.3%", top: "31%" }}>
            <Building2 size={18} />
          </span>

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
                  setMode("layers");
                }}
                style={{ left: `${point.x}%`, top: `${point.y}%`, background: meta.color }}
                type="button"
              >
                <Icon size={15} strokeWidth={2.4} />
                <span>{point.name}</span>
              </button>
            );
          })}

          <div className={styles.zoomControl}>
            <button type="button" aria-label="Yakınlaştır">+</button>
            <button type="button" aria-label="Uzaklaştır">−</button>
          </div>

          <div className={styles.dataStrip}>
            <span><LocateFixed size={16} /><b>Konum</b> anlık</span>
            <span><Navigation size={16} /><b>Hedef</b> Kent Müzesi</span>
            <span><Route size={16} /><b>Mesafe</b> {routes[selectedRoute].distance}</span>
            <span><Layers3 size={16} /><b>Katman</b> {openLayerCount} açık</span>
          </div>
        </div>

        <aside
          className={`${styles.layerPanel} ${
            mobilePanel === "layers" ? styles.mobileOpen : ""
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
