import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", bank: "Intellect Bank" });
});

// Direct test of Intellect gateway credentials & assets
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getIntellectAccessToken(forceRefresh = false): Promise<string> {
  const apikey = "magicplatform.A8018652167E463eaD986C222F2A42D4";
  const username = "shivanshpf_indstg";
  const password = "Intellect@8012";
  const workspaceId = "d7d4d536-de17-4354-819a-fff06ba78b23";

  const now = Date.now();
  if (!forceRefresh && tokenCache && tokenCache.expiresAt > now + 60000) {
    return tokenCache.token;
  }

  console.log(`[Intellect Bank] Fetching fresh real-time access token for user: ${username}`);
  const tokenRes = await fetch("https://api.in.intellectseecstag.com/accesstoken/pfpreview", {
    method: "GET",
    headers: {
      "apikey": apikey,
      "username": username,
      "password": password
    }
  });

  const data: any = await tokenRes.json().catch(() => ({}));
  if (data?.access_token) {
    const expiresInSec = Number(data.expires_in) || 900;
    tokenCache = {
      token: data.access_token,
      expiresAt: now + expiresInSec * 1000
    };
    console.log(`[Intellect Bank] Successfully obtained fresh access token (expires in ${expiresInSec}s)`);
    return data.access_token;
  }

  throw new Error(data?.message || "Failed to retrieve access token from Intellect gateway");
}

app.get("/api/complaint/gateway-status", async (_req, res) => {
  try {
    const apikey = "magicplatform.A8018652167E463eaD986C222F2A42D4";
    const workspaceId = "d7d4d536-de17-4354-819a-fff06ba78b23";

    const tokenRes = await fetch("https://api.in.intellectseecstag.com/accesstoken/pfpreview", {
      method: "GET",
      headers: {
        "apikey": apikey,
        "username": "shivanshpf_indstg",
        "password": "Intellect@8012"
      }
    });

    const tokenData = await tokenRes.json().catch(() => ({ error: "Invalid JSON response" }));
    return res.json({
      status: tokenRes.status,
      ok: tokenRes.ok,
      data: tokenData,
      workspaceId,
      endpoint: "https://api.in.intellectseecstag.com/accesstoken/pfpreview",
      assetsEndpoint: "https://api.in.intellectseecstag.com/magicplatform/v1/assets"
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to connect to gateway" });
  }
});

// Endpoint to inspect MagicPlatform assets
app.get("/api/complaint/assets", async (_req, res) => {
  try {
    const apikey = "magicplatform.A8018652167E463eaD986C222F2A42D4";
    const workspaceId = "d7d4d536-de17-4354-819a-fff06ba78b23";

    const assetsRes = await fetch("https://api.in.intellectseecstag.com/magicplatform/v1/assets", {
      method: "GET",
      headers: {
        "apikey": apikey,
        "x-platform-workspaceid": workspaceId,
        "Origin": "https://in.intellectseecstag.com",
        "Content-Type": "application/json"
      }
    });

    const data = await assetsRes.json().catch(() => ({ error: "Invalid JSON response" }));
    return res.json({
      status: assetsRes.status,
      ok: assetsRes.ok,
      data
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to query assets endpoint" });
  }
});

// Track complaint transaction status by trace_id (as documented in OpenAPI spec)
app.get("/api/complaint/track/:trace_id", async (req, res) => {
  const { trace_id } = req.params;
  const apikey = "magicplatform.A8018652167E463eaD986C222F2A42D4";
  const workspaceId = "d7d4d536-de17-4354-819a-fff06ba78b23";

  try {
    const trackRes = await fetch(`https://api.in.intellectseecstag.com/magicplatform/v1/invokeasset/308f7c96-ef89-4680-9789-6a4afc48b5c2/${trace_id}`, {
      method: "GET",
      headers: {
        "apikey": apikey,
        "x-platform-workspaceid": workspaceId,
        "Origin": "https://in.intellectseecstag.com",
        "Content-Type": "application/json"
      }
    });

    const data = await trackRes.json().catch(() => ({ status: "PENDING_OR_QUEUED" }));
    return res.json({
      trace_id,
      status: trackRes.status,
      data
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Complaint Submission Workflow: Real-time token -> invokeasset
app.post("/api/complaint/submit", async (req, res) => {
  const { email, productType, complaintDetails } = req.body;

  if (!email || !productType || !complaintDetails) {
    return res.status(400).json({ error: "Missing required fields: email, productType, complaintDetails" });
  }

  const apikey = "magicplatform.A8018652167E463eaD986C222F2A42D4";
  const workspaceId = "d7d4d536-de17-4354-819a-fff06ba78b23";

  console.log(`[Intellect Bank] Initiating real-time complaint submission for ${email} (Product: ${productType})`);

  try {
    // Step 1: Obtain fresh real-time bearer token
    let accessToken = await getIntellectAccessToken(false);

    // Step 2: Submit Complaint POST with access token
    console.log("[Intellect Bank] Step 2: Submitting complaint to MagicPlatform invokeasset endpoint...");
    let submitResponse = await fetch("https://api.in.intellectseecstag.com/magicplatform/v1/invokeasset/308f7c96-ef89-4680-9789-6a4afc48b5c2/usecase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": apikey,
        "Authorization": `Bearer ${accessToken}`,
        "x-platform-workspaceid": workspaceId,
        "Origin": "https://in.intellectseecstag.com"
      },
      body: JSON.stringify({
        "From": email,
        "Subject": `Urgent: ${productType} Dispute - Reg`,
        "Email_Body": complaintDetails
      })
    });

    // If 401 or 403, retry once with forced fresh token
    if (submitResponse.status === 401 || submitResponse.status === 403) {
      console.log("[Intellect Bank] Token expired during invoke. Requesting forced fresh token...");
      accessToken = await getIntellectAccessToken(true);
      submitResponse = await fetch("https://api.in.intellectseecstag.com/magicplatform/v1/invokeasset/308f7c96-ef89-4680-9789-6a4afc48b5c2/usecase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": apikey,
          "Authorization": `Bearer ${accessToken}`,
          "x-platform-workspaceid": workspaceId,
          "Origin": "https://in.intellectseecstag.com"
        },
        body: JSON.stringify({
          "From": email,
          "Subject": `Urgent: ${productType} Dispute - Reg`,
          "Email_Body": complaintDetails
        })
      });
    }

    const submitData: any = await submitResponse.json().catch(() => ({}));
    console.log("[Intellect Bank] Step 2 Response:", submitResponse.status, submitData);

    if (submitResponse.ok || submitResponse.status === 201 || submitResponse.status === 200) {
      const traceId = submitData?.trace_id || submitData?.traceId || submitData?.id;

      return res.status(200).json({
        success: true,
        trace_id: traceId,
        liveApi: true,
        raw: submitData
      });
    } else {
      console.warn("[Intellect Bank] invokeasset returned error status:", submitResponse.status, submitData);
      return res.status(submitResponse.status).json({
        success: false,
        error: submitData?.message || submitData?.error || `API returned status ${submitResponse.status}`,
        details: submitData
      });
    }
  } catch (error: any) {
    console.error("[Intellect Bank] Complaint submission exception:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to submit complaint to Intellect MagicPlatform"
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Intellect Bank] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
