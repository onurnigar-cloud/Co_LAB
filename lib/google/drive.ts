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
  const apiKey =
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_DRIVE_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!apiKey) return null;

  return google.drive({
    version: "v3",
    auth: apiKey,
  });
}

export function createDriveClient() {
  return createOAuthDriveClient() ?? createApiKeyDriveClient();
}

function publicDownloadUrl(fileId: string) {
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
}

function publicViewUrl(fileId: string) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`;
}

async function fetchPublicDriveFile(fileId: string): Promise<Buffer> {
  const response = await fetch(publicDownloadUrl(fileId), {
    redirect: "follow",
    headers: {
      "User-Agent": "Co_LAB/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Google Drive public indirme başarısız. HTTP ${response.status}. Dosyanın paylaşımı "bağlantıya sahip olan herkes görüntüleyebilir" olmalı.`
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const head = buffer.subarray(0, 64).toString("utf8").toLowerCase();

  if (contentType.includes("text/html") || head.includes("<!doctype") || head.includes("<html")) {
    throw new Error(
      "Google Drive PDF yerine HTML sayfası döndürdü. Dosya herkese açık olmayabilir veya Google büyük dosya onayı istiyor olabilir."
    );
  }

  return buffer;
}

export async function getDriveFileMetadata(fileId: string) {
  const drive = createDriveClient();

  if (drive) {
    const response = await drive.files.get({
      fileId,
      fields: "id, name, mimeType, size, modifiedTime, webViewLink",
      supportsAllDrives: true,
    });

    return response.data;
  }

  return {
    id: fileId,
    name: `Google Drive PDF ${fileId}`,
    mimeType: "application/pdf",
    size: null,
    modifiedTime: null,
    webViewLink: publicViewUrl(fileId),
  };
}

export async function downloadDriveFileAsBuffer(fileId: string) {
  const drive = createDriveClient();

  if (drive) {
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

  return fetchPublicDriveFile(fileId);
}
