export type SketchfabModelCandidate = {
  uid: string;
  sourceUrl: string;
  embedUrl: string;
  oembedHtml?: string | null;
  originalTitle: string;
  displayName: string;
  educationalName?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  authorName?: string | null;
  authorUrl?: string | null;
  license?: string | null;
  licenseUrl?: string | null;
  tags?: string[];
  sourceProfileUrl?: string | null;
};

export type SketchfabProfileScanResult = {
  username: string;
  profileUrl: string;
  candidates: SketchfabModelCandidate[];
  warnings: string[];
};
