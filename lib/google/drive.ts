import { google } from "googleapis";

export function extractDriveFileId(input: string) {
  const patterns = [
    /\/file\/d\/([^/]+)/,
    /id=([^&]+)/,
    /\/open\?id=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) return match[1];
  }

  // Eğer doğrudan file id girilmişse.
  if (/^[a-zA-Z0-9_-]{20,}$/.test(input)) {
    return input;
  }

  return null;
}

function createOAuthDriveClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: "v3", auth });
}

function createApiKeyDriveClient() {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) return null;

  return google.drive({
    version: "v3",
    auth: apiKey,
  });
}

export function createDriveClient() {
  return createOAuthDriveClient() ?? createApiKeyDriveClient();
}

export async function getDriveFileMetadata(fileId: string) {
  const drive = createDriveClient();

  if (!drive) {
    throw new Error("Google Drive client yapılandırılmadı. OAuth veya API key environment variables gerekli.");
  }

  const response = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, size, modifiedTime, webViewLink",
    supportsAllDrives: true,
  });

  return response.data;
}

export async function downloadDriveFileAsBuffer(fileId: string) {
  const drive = createDriveClient();

  if (!drive) {
    throw new Error("Google Drive client yapılandırılmadı. OAuth veya API key environment variables gerekli.");
  }

  const response = await drive.files.get(
    {
      fileId,
      alt: "media",
      supportsAllDrives: true,
    },
    {
      responseType: "arraybuffer",
    }
  );

  return Buffer.from(response.data as ArrayBuffer);
}
