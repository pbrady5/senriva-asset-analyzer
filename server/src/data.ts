export type AssetDomain = "HubFS" | "Template" | "Module";

export type AssetRecord = {
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

export const assets: AssetRecord[] = [
  {
    id: "asset-hero-current",
    name: "resources-hero.jpg",
    domain: "HubFS",
    path: "/images/resources/resources-hero.jpg",
    sizeBytes: 2480000,
    modifiedAt: "2026-09-02T14:20:00Z",
    usageCount: 4,
    archived: true,
    missing: false,
    environment: "Shared",
    references: [
      "Investor Resources",
      "Resource Center",
      "Campaign Landing Page",
      "Market Insights"
    ]
  },
  {
    id: "asset-old-hero",
    name: "resources-hero-old.jpg",
    domain: "HubFS",
    path: "/images/resources/archive/resources-hero-old.jpg",
    sizeBytes: 4120000,
    modifiedAt: "2024-01-12T10:00:00Z",
    usageCount: 0,
    archived: true,
    duplicateGroup: "hero-assets",
    missing: false,
    environment: "Shared",
    references: []
  },
  {
    id: "asset-logo-legacy",
    name: "legacy-campaign-logo.png",
    domain: "HubFS",
    path: "/legacy/images/legacy-campaign-logo.png",
    sizeBytes: 1850000,
    modifiedAt: "2023-08-08T11:00:00Z",
    usageCount: 0,
    archived: true,
    missing: false,
    environment: "Shared",
    references: []
  },
  {
    id: "asset-factsheet",
    name: "example-fund-factsheet.pdf",
    domain: "HubFS",
    path: "/documents/funds/example-fund-factsheet.pdf",
    sizeBytes: 720000,
    modifiedAt: "2026-09-15T09:30:00Z",
    usageCount: 3,
    archived: true,
    missing: false,
    environment: "Shared",
    references: [
      "Fund Detail",
      "Resource Library",
      "Fund Documents"
    ]
  },
  {
    id: "asset-quarterly-missing",
    name: "quarterly-commentary.pdf",
    domain: "HubFS",
    path: "/documents/quarterly-commentary.pdf",
    sizeBytes: 540000,
    modifiedAt: "2026-07-10T15:00:00Z",
    usageCount: 2,
    archived: true,
    missing: true,
    environment: "Shared",
    references: [
      "Fund Detail",
      "Quarterly Commentary"
    ]
  },
  {
    id: "asset-old-pdf",
    name: "fund-factsheet-2022.pdf",
    domain: "HubFS",
    path: "/documents/archive/fund-factsheet-2022.pdf",
    sizeBytes: 910000,
    modifiedAt: "2022-12-15T12:00:00Z",
    usageCount: 0,
    archived: true,
    duplicateGroup: "factsheet-history",
    missing: false,
    environment: "Shared",
    references: []
  },
  {
    id: "template-standard",
    name: "Standard Page Template",
    domain: "Template",
    path: "/senriva-demo/templates/standard-page.html",
    modifiedAt: "2026-09-18T16:20:00Z",
    usageCount: 18,
    archived: true,
    missing: false,
    environment: "Shared",
    references: [
      "Investor Resources",
      "Campaign Landing Page",
      "About",
      "Contact"
    ]
  },
  {
    id: "template-legacy",
    name: "Legacy Landing Page",
    domain: "Template",
    path: "/legacy/templates/landing-page.html",
    modifiedAt: "2023-02-03T12:00:00Z",
    usageCount: 0,
    archived: true,
    missing: false,
    environment: "Shared",
    references: []
  },
  {
    id: "module-resource",
    name: "Resource Library",
    domain: "Module",
    path: "/senriva-demo/modules/resource-library",
    modifiedAt: "2026-09-17T13:00:00Z",
    usageCount: 6,
    archived: true,
    missing: false,
    environment: "Shared",
    references: [
      "Investor Resources",
      "Resource Center",
      "Market Insights"
    ]
  },
  {
    id: "module-promo",
    name: "Legacy Promotional Banner",
    domain: "Module",
    path: "/legacy/modules/promo-banner",
    modifiedAt: "2022-05-14T09:15:00Z",
    usageCount: 0,
    archived: true,
    duplicateGroup: "promo-modules",
    missing: false,
    environment: "Shared",
    references: []
  },
  {
    id: "module-staging",
    name: "Campaign Hero",
    domain: "Module",
    path: "/campaign/modules/campaign-hero",
    modifiedAt: "2026-09-20T18:10:00Z",
    usageCount: 1,
    archived: true,
    missing: false,
    environment: "Staging",
    references: [
      "Campaign Landing Page"
    ]
  }
];
