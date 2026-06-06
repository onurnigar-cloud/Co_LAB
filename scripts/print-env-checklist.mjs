const required = [
  ["NEXT_PUBLIC_SUPABASE_URL", "Supabase project URL"],
  ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "Supabase browser-safe publishable key"],
  ["SUPABASE_SECRET_KEY", "Supabase service role / secret key for backend admin operations"],
  ["OPENAI_API_KEY", "OpenAI backend API key for AI generation"],
  ["OPENAI_MODEL", "AI model name, for example gpt-5.5"],
];

const optional = [
  ["SKETCHFAB_API_TOKEN", "Optional. Improves Sketchfab profile/API import reliability."],
  ["SKETCHFAB_USERNAME", "Optional. Default profile username, e.g. onurnigar"],
  ["SKETCHFAB_PROFILE_URL", "Optional. Default profile URL."]
];

console.log("Co_LAB environment checklist\n");

console.log("Required:");
for (const [key, note] of required) {
  console.log(`- ${key}: ${note}`);
}

console.log("\nOptional:");
for (const [key, note] of optional) {
  console.log(`- ${key}: ${note}`);
}

console.log("\nStorage buckets to create in Supabase:");
console.log("- source-files");
console.log("- generated-tests");
console.log("- presentation-exports");

console.log("\nRun order:");
console.log("1. Create Supabase project");
console.log("2. Run all migrations in numerical order");
console.log("3. Create storage buckets");
console.log("4. Add env variables locally and in Vercel");
console.log("5. Run npm install");
console.log("6. Run npm run colab:check-files");
console.log("7. Run npm run build");
