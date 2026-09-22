import express from "express";
import cors from "cors";
import { assets } from "./data.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Senriva Asset Analyzer API"
  });
});

app.get("/api/assets", (_req, res) => {
  res.json({ assets });
});

app.get("/api/summary", (_req, res) => {
  const totalBytes = assets.reduce(
    (sum, asset) => sum + (asset.sizeBytes ?? 0),
    0
  );

  const orphaned = assets.filter(
    (asset) => asset.usageCount === 0 && !asset.missing
  );

  const missing = assets.filter((asset) => asset.missing);

  const stale = assets.filter((asset) => {
    const age = Date.now() - new Date(asset.modifiedAt).getTime();
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    return age > oneYear;
  });

  const duplicateGroups = new Set(
    assets
      .filter((asset) => asset.duplicateGroup)
      .map((asset) => asset.duplicateGroup)
  );

  const recoverableBytes = orphaned.reduce(
    (sum, asset) => sum + (asset.sizeBytes ?? 0),
    0
  );

  res.json({
    totalAssets: assets.length,
    totalBytes,
    orphaned: orphaned.length,
    missing: missing.length,
    stale: stale.length,
    duplicateGroups: duplicateGroups.size,
    recoverableBytes
  });
});

app.listen(port, () => {
  console.log(`Senriva Asset Analyzer API running on http://localhost:${port}`);
});
