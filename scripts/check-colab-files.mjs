import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "package.json",
  ".env.example",
  "SUPABASE_SETUP.md",

  "supabase/migrations/001_initial_schema.sql",
  "supabase/migrations/002_admin_security.sql",
  "supabase/migrations/003_source_processing.sql",
  "supabase/migrations/004_storage_and_public_views.sql",
  "supabase/migrations/005_ai_question_extraction_drafts.sql",
  "supabase/migrations/006_question_draft_review_helpers.sql",
  "supabase/migrations/007_public_test_builder_views.sql",
  "supabase/migrations/008_presentation_drafts.sql",
  "supabase/migrations/009_web_visual_assets.sql",
  "supabase/migrations/010_slide_preview_visual_placement.sql",
  "supabase/migrations/011_presentation_publications.sql",
  "supabase/migrations/012_publication_quality_analytics.sql",
  "supabase/migrations/013_content_dashboard_stats.sql",
  "supabase/migrations/014_sketchfab_models_3d_board.sql",

  "components/admin/threeD/SketchfabModelManagerPanel.tsx",
  "components/visitor/threeD/Topic3DBoard.tsx",
  "app/api/admin/sketchfab/profile-models/route.ts",
  "app/api/admin/sketchfab/import-model/route.ts",
  "app/api/public/3d/models/route.ts",

  "SKETCHFAB_3D_BOARD_GUIDE.md",
  "docs/testing/TEST_PLAN_V3_7.md",
  "docs/deployment/VERCEL_DEPLOYMENT_PREP.md",
  "docs/checklists/ADMIN_ACCEPTANCE_CHECKLIST.md"
];

let missing = 0;

console.log("Co_LAB file integrity check\n");

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? "✓" : "✗"} ${file}`);
  if (!exists) missing += 1;
}

console.log("\nResult:");
if (missing === 0) {
  console.log("✓ All required files are present.");
  process.exit(0);
}

console.log(`✗ ${missing} required file(s) missing.`);
process.exit(1);
