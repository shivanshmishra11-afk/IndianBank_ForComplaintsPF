export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, productType, complaintDetails } = req.body || {};

  if (!email || !productType || !complaintDetails) {
    return res.status(400).json({ error: 'Missing required fields: email, productType, complaintDetails' });
  }

  const apikey = 'magicplatform.A8018652167E463eaD986C222F2A42D4';
  const workspaceId = 'd7d4d536-de17-4354-819a-fff06ba78b23';
  const username = 'shivanshpf_indstg';
  const password = 'Intellect@8012';

  try {
    // 1. Obtain access token
    const tokenRes = await fetch('https://api.in.intellectseecstag.com/accesstoken/pfpreview', {
      method: 'GET',
      headers: {
        apikey,
        username,
        password,
      },
    });

    const tokenData = await tokenRes.json().catch(() => ({}));
    const accessToken = tokenData?.access_token;

    if (!accessToken) {
      throw new Error(tokenData?.message || 'Failed to authenticate with Intellect MagicPlatform');
    }

    // 2. Invoke grievance asset
    const submitResponse = await fetch('https://api.in.intellectseecstag.com/magicplatform/v1/invokeasset/308f7c96-ef89-4680-9789-6a4afc48b5c2/usecase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey,
        Authorization: `Bearer ${accessToken}`,
        'x-platform-workspaceid': workspaceId,
        Origin: 'https://in.intellectseecstag.com',
      },
      body: JSON.stringify({
        From: email,
        Subject: `Urgent: ${productType} Dispute - Reg`,
        Email_Body: complaintDetails,
      }),
    });

    const submitData = await submitResponse.json().catch(() => ({}));

    if (submitResponse.ok || submitResponse.status === 201 || submitResponse.status === 200) {
      const traceId = submitData?.trace_id || submitData?.traceId || submitData?.id || `TKT-${Date.now().toString().slice(-6)}`;
      return res.status(200).json({
        success: true,
        trace_id: traceId,
        timestamp: new Date().toISOString(),
        productType,
        liveApi: true,
        data: submitData,
      });
    } else {
      throw new Error(submitData?.message || 'Failed to process complaint with MagicPlatform gateway');
    }
  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Internal grievance gateway error',
      success: false,
    });
  }
}
