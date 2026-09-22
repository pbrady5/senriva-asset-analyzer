import { useEffect, useMemo, useState } from "react";
import "./App.css";

type AssetDomain = "HubFS" | "Template" | "Module";
type View = "overview" | "assets" | "dependencies" | "content-audit" | "backup";

type AssetRecord = {
  id: string;
  name: string;
  domain: AssetDomain;
  path: string;
  sizeBytes?: number;
  modifiedAt: string;
  usageCount: number;
  archived: boolean;
  duplicateGroup?: string;
  missing: boolean;
  environment: "Production" | "Staging" | "Shared";
  references: string[];
};

function App() {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [connected, setConnected] = useState(false);
  const [activeView, setActiveView] = useState<View>("assets");

  useEffect(() => {
    fetch("/api/assets")
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then((data: { assets: AssetRecord[] }) => {
        setAssets(data.assets);
        setSelectedId(data.assets[0]?.id ?? "");
        setConnected(true);
      })
      .catch(() => setConnected(false));
  }, []);

  const selected = assets.find((asset) => asset.id === selectedId);

  const now = Date.now();
  const oneYear = 365 * 24 * 60 * 60 * 1000;

  const annotated = useMemo(() => {
    return assets.map((asset) => {
      const stale = now - new Date(asset.modifiedAt).getTime() > oneYear;
      const orphaned = asset.usageCount === 0 && !asset.missing;
      const cleanupCandidate = orphaned && asset.archived;

      return {
        ...asset,
        stale,
        orphaned,
        cleanupCandidate
      };
    });
  }, [assets]);

  const filtered = useMemo(() => {
    return annotated.filter((asset) => {
      const q = search.toLowerCase();

      const matchesSearch =
        asset.name.toLowerCase().includes(q) ||
        asset.path.toLowerCase().includes(q);

      const matchesDomain =
        domain === "All" || asset.domain === domain;

      const matchesState =
        stateFilter === "All" ||
        (stateFilter === "Referenced" && asset.usageCount > 0 && !asset.missing) ||
        (stateFilter === "Orphaned" && asset.orphaned) ||
        (stateFilter === "Missing" && asset.missing) ||
        (stateFilter === "Stale" && asset.stale) ||
        (stateFilter === "Cleanup" && asset.cleanupCandidate);

      return matchesSearch && matchesDomain && matchesState;
    });
  }, [annotated, search, domain, stateFilter]);

  const totalBytes = assets.reduce(
    (sum, asset) => sum + (asset.sizeBytes ?? 0),
    0
  );

  const orphaned = annotated.filter((asset) => asset.orphaned);
  const stale = annotated.filter((asset) => asset.stale);
  const missing = annotated.filter((asset) => asset.missing);
  const cleanupCandidates = annotated.filter(
    (asset) => asset.cleanupCandidate
  );

  const recoverableBytes = cleanupCandidates.reduce(
    (sum, asset) => sum + (asset.sizeBytes ?? 0),
    0
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <strong>Senriva</strong>
            <span>Portal Intelligence</span>
          </div>
        </div>

        <nav>
          <Nav
            label="Overview"
            icon="⌂"
            active={activeView === "overview"}
            onClick={() => setActiveView("overview")}
          />
          <Nav
            label="Dependencies"
            icon="⌘"
            active={activeView === "dependencies"}
            onClick={() => setActiveView("dependencies")}
          />
          <Nav
            label="Assets"
            icon="▦"
            active={activeView === "assets"}
            onClick={() => setActiveView("assets")}
          />
          <Nav
            label="Content Audit"
            icon="✓"
            active={activeView === "content-audit"}
            onClick={() => setActiveView("content-audit")}
          />
          <Nav
            label="Backup & Recovery"
            icon="↻"
            active={activeView === "backup"}
            onClick={() => setActiveView("backup")}
          />
        </nav>

        <div className="sidebar-footer">
          <span className="demo-dot" />
          Fictional demo portal
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p className="eyebrow">ASSET INTELLIGENCE</p>
            <h1>Asset Cleanup Analyzer</h1>
            <p className="subtitle">
              Find orphaned, stale, duplicated and missing CMS assets using
              dependency-aware inventory instead of file age alone.
            </p>
          </div>

          <div className={`connection-badge ${connected ? "connected" : ""}`}>
            <span />
            {connected ? "API connected" : "API unavailable"}
          </div>
        </header>

        {activeView === "assets" ? (
          <>
            <section className="metric-grid">
              <Metric
                label="Tracked assets"
                value={assets.length}
                detail={formatBytes(totalBytes)}
              />
              <Metric
                label="Orphaned"
                value={orphaned.length}
                detail="No active references"
                tone="warning"
              />
              <Metric
                label="Stale"
                value={stale.length}
                detail="Modified > 1 year ago"
                tone="warning"
              />
              <Metric
                label="Missing"
                value={missing.length}
                detail="Referenced but unavailable"
                tone="danger"
              />
              <Metric
                label="Recoverable"
                value={cleanupCandidates.length}
                detail={formatBytes(recoverableBytes)}
              />
            </section>

            <section className="workspace">
              <div className="inventory-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">ASSET INVENTORY</p>
                    <h2>Portal assets</h2>
                  </div>
                  <span className="count-badge">{filtered.length}</span>
                </div>

                <div className="filters">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search assets or paths..."
                  />

                  <select
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                  >
                    <option>All</option>
                    <option>HubFS</option>
                    <option>Template</option>
                    <option>Module</option>
                  </select>

                  <select
                    value={stateFilter}
                    onChange={(event) => setStateFilter(event.target.value)}
                  >
                    <option>All</option>
                    <option>Referenced</option>
                    <option>Orphaned</option>
                    <option>Missing</option>
                    <option>Stale</option>
                    <option>Cleanup</option>
                  </select>
                </div>

                <div className="asset-list">
                  {filtered.map((asset) => (
                    <button
                      key={asset.id}
                      className={`asset-row ${
                        selectedId === asset.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedId(asset.id)}
                      type="button"
                    >
                      <div className={`domain-icon ${asset.domain.toLowerCase()}`}>
                        {asset.domain === "HubFS"
                          ? "FS"
                          : asset.domain === "Template"
                            ? "T"
                            : "M"}
                      </div>

                      <div className="asset-info">
                        <strong>{asset.name}</strong>
                        <span>{asset.path}</span>
                      </div>

                      <div className="asset-meta">
                        <span className="environment">
                          {asset.usageCount} refs
                        </span>

                        <span
                          className={`status ${
                            asset.missing
                              ? "broken"
                              : asset.usageCount === 0
                                ? "orphaned"
                                : "healthy"
                          }`}
                        >
                          {asset.missing
                            ? "missing"
                            : asset.usageCount === 0
                              ? "orphaned"
                              : "active"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <aside className="detail-panel">
                {selected ? (
                  <>
                    <div className="detail-header">
                      <div
                        className={`domain-icon large ${selected.domain.toLowerCase()}`}
                      >
                        {selected.domain === "HubFS"
                          ? "FS"
                          : selected.domain === "Template"
                            ? "T"
                            : "M"}
                      </div>

                      <div>
                        <p className="eyebrow">{selected.domain}</p>
                        <h2>{selected.name}</h2>
                        <p>{selected.path}</p>
                      </div>
                    </div>

                    <div className="impact-card">
                      <div>
                        <span>Active references</span>
                        <strong>{selected.usageCount}</strong>
                      </div>
                      <p>
                        The analyzer evaluates usage before classifying an asset
                        as safe for cleanup.
                      </p>
                    </div>

                    <div className="mapping-card">
                      <div className="section-title">
                        <span>Asset details</span>
                        <span className="mapped-label">
                          {selected.archived ? "Archived" : "Not archived"}
                        </span>
                      </div>

                      <div className="asset-detail-grid">
                        <Detail
                          label="Environment"
                          value={selected.environment}
                        />
                        <Detail
                          label="Size"
                          value={
                            selected.sizeBytes
                              ? formatBytes(selected.sizeBytes)
                              : "Source artifact"
                          }
                        />
                        <Detail
                          label="Modified"
                          value={new Date(
                            selected.modifiedAt
                          ).toLocaleDateString()}
                        />
                        <Detail
                          label="Duplicate group"
                          value={selected.duplicateGroup ?? "None detected"}
                        />
                      </div>
                    </div>

                    <div className="relationship-section">
                      <div className="section-title">
                        <span>Referenced by</span>
                        <span>{selected.references.length}</span>
                      </div>

                      {selected.references.length ? (
                        selected.references.map((reference) => (
                          <div className="reference-row" key={reference}>
                            <strong>{reference}</strong>
                            <span>Uses this asset</span>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <strong>No active references</strong>
                          <p>
                            This asset is a cleanup candidate only because it is
                            also preserved in archive history.
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      className={`cleanup-decision ${
                        selected.missing
                          ? "danger"
                          : selected.usageCount === 0 && selected.archived
                            ? "safe"
                            : "blocked"
                      }`}
                    >
                      <span>Cleanup assessment</span>
                      <strong>
                        {selected.missing
                          ? "Investigate missing dependency"
                          : selected.usageCount === 0 && selected.archived
                            ? "Eligible for cleanup preview"
                            : "Keep — actively referenced"}
                      </strong>
                    </div>
                  </>
                ) : null}
              </aside>
            </section>

            <section className="bottom-grid">
              <div className="insight-card">
                <p className="eyebrow">ARCHIVE AWARE</p>
                <h3>Unused does not mean unprotected</h3>
                <p>
                  Cleanup candidates are only marked when the live dependency
                  graph reports no active usage and a preserved archive copy is
                  available.
                </p>
              </div>

              <div className="insight-card">
                <p className="eyebrow">NON-DESTRUCTIVE DEMO</p>
                <h3>Preview only</h3>
                <p>
                  This public demo does not delete, overwrite or mutate HubSpot
                  assets.
                </p>
              </div>
            </section>
          </>
        ) : (
          <PlaceholderView view={activeView} />
        )}
      </main>
    </div>
  );
}

function PlaceholderView({ view }: { view: View }) {
  const content = {
    overview: [
      "Senriva Overview",
      "Unified portal intelligence across assets, dependencies, content health and recovery."
    ],
    dependencies: [
      "Dependency Mapper",
      "The standalone Dependency Mapper demo provides full dependency graph inspection."
    ],
    "content-audit": [
      "Content Audit",
      "The standalone Content Audit demo provides SEO, accessibility and content-health analysis."
    ],
    backup: [
      "Backup & Recovery",
      "The recovery engine provides dependency-aware reconstruction and cross-account identity reconciliation."
    ],
    assets: ["Asset Analyzer", ""]
  } as const;

  return (
    <section className="feature-panel feature-panel-large">
      <p className="eyebrow">SENRIVA MODULE</p>
      <h2>{content[view][0]}</h2>
      <p className="feature-copy">{content[view][1]}</p>
    </section>
  );
}

function Nav({
  label,
  icon,
  active,
  onClick
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`nav-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

function Detail({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="asset-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  tone
}: {
  label: string;
  value: number;
  detail: string;
  tone?: "warning" | "danger";
}) {
  return (
    <div className={`metric-card ${tone ?? ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default App;
