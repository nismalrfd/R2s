// /api/_zohoAuth.js
// Shared helper: exchanges the long-lived refresh token for a fresh
// short-lived access token. Used by every endpoint that talks to Zoho.
//
// IMPORTANT: the token is cached to a file on disk (not just in memory)
// and reused until shortly before it expires. This matters because
// `vercel dev` can run each API call in a separate process, so a plain
// in-memory cache doesn't reliably survive between requests. Without
// this, every single API call — including N+1 lookups like fetching
// images one by one — would request a brand new token from Zoho, which
// quickly trips Zoho's own rate limit on the OAuth endpoint ("too many
// requests continuously").

import { readFileSync, writeFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const CACHE_FILE = join(tmpdir(), "r2s_zoho_token_cache.json");

export async function safeReadJson(res) {
  const rawText = await res.text();
  try {
    return { json: JSON.parse(rawText), rawText };
  } catch (e) {
    return { json: null, rawText };
  }
}

function readCache() {
  try {
    if (!existsSync(CACHE_FILE)) return null;
    const raw = readFileSync(CACHE_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeCache(token, expiresAt) {
  try {
    writeFileSync(CACHE_FILE, JSON.stringify({ token, expiresAt }), "utf8");
  } catch (e) {
    // Disk write failed (e.g. read-only filesystem in some deploy
    // targets) — not fatal, we'll just re-fetch a token next time.
    console.warn("Could not write Zoho token cache:", e.message);
  }
}

export async function getAccessToken() {
  const now = Date.now();

  // Reuse the cached token if it's still valid for at least another
  // 2 minutes (buffer so we never hand out a token that expires
  // mid-request).
  const cached = readCache();
  if (cached && cached.token && now < cached.expiresAt - 2 * 60 * 1000) {
    return cached.token;
  }

  const url =
    `${process.env.ZOHO_ACCOUNTS_DOMAIN}/oauth/v2/token` +
    `?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}` +
    `&client_id=${process.env.ZOHO_CLIENT_ID}` +
    `&client_secret=${process.env.ZOHO_CLIENT_SECRET}` +
    `&grant_type=refresh_token`;

  const res = await fetch(url, { method: "POST" });
  const { json, rawText } = await safeReadJson(res);

  if (!json || !json.access_token) {
    // If Zoho rate-limited us but we still have an old cached token
    // (even an expired-looking one), better to keep using it a little
    // longer than to fail outright.
    if (cached && cached.token) {
      console.warn("Token refresh failed, reusing stale cached token:", rawText);
      return cached.token;
    }
    throw new Error(
      `Failed to get Zoho access token. Status: ${res.status}. Body: ${rawText}`
    );
  }

  const expiresAt = now + (json.expires_in || 3600) * 1000;
  writeCache(json.access_token, expiresAt);

  return json.access_token;
}