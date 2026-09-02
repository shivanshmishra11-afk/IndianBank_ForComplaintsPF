import React, { useState } from 'react';
import { X, Terminal, CheckCircle2, AlertTriangle, Play, RefreshCw, Key, Send, Shield, Layers, Globe } from 'lucide-react';

interface ApiInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiInspectorModal: React.FC<ApiInspectorModalProps> = ({ isOpen, onClose }) => {
  const [testingGateway, setTestingGateway] = useState(false);
  const [testingAssets, setTestingAssets] = useState(false);
  const [gatewayResult, setGatewayResult] = useState<any>(null);
  const [assetsResult, setAssetsResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleTestGateway = async () => {
    setTestingGateway(true);
    try {
      const res = await fetch('/api/complaint/gateway-status');
      const data = await res.json();
      setGatewayResult(data);
    } catch (err: any) {
      setGatewayResult({ error: err.message });
    } finally {
      setTestingGateway(false);
    }
  };

  const handleTestAssets = async () => {
    setTestingAssets(true);
    try {
      const res = await fetch('/api/complaint/assets');
      const data = await res.json();
      setAssetsResult(data);
    } catch (err: any) {
      setAssetsResult({ error: err.message });
    } finally {
      setTestingAssets(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                Intellect MagicPlatform API Inspector
              </h3>
              <p className="text-xs text-slate-400">
                NonFinancial_ComplaintsSolution (OpenAPI 3.0.0 Spec & Gateway Diagnostics)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto font-sans text-xs">
          {/* Environment & CORS Config Card */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Gateway Header & Workspace Configuration</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono pt-1">
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">apikey</span>
                <span className="break-all text-sky-300">magicplatform.A8018652167E463eaD986C222F2A42D4</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">x-platform-workspaceid</span>
                <span className="break-all text-amber-300">d7d4d536-de17-4354-819a-fff06ba78b23</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800 sm:col-span-2">
                <span className="text-slate-400 block text-[10px]">Access-Control-Allow-Origin / Target</span>
                <span className="text-emerald-300">https://in.intellectseecstag.com</span>
              </div>
            </div>
          </div>

          {/* Step 1 Spec */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400 font-mono flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Step 1: Auto-Token Generation (GET)
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                GET /accesstoken/pfpreview
              </span>
            </div>
            <div className="text-slate-300 font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 break-all">
              https://api.in.intellectseecstag.com/accesstoken/pfpreview
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div><strong className="text-slate-300">apikey:</strong> magicplatform.A8018652167E463eaD986C222F2A42D4</div>
              <div><strong className="text-slate-300">username:</strong> shivanshpf_indstg</div>
              <div><strong className="text-slate-300">password:</strong> Intellect@8012</div>
              <div><strong className="text-slate-300">Response:</strong> &#123; result: "RESULT_SUCCESS", access_token: "**token**", expires_in: "3600" &#125;</div>
            </div>
          </div>

          {/* Step 2 Spec */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Step 2: Submit Complaint Ticket (POST)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                POST /invokeasset/.../usecase
              </span>
            </div>
            <div className="text-slate-300 font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 break-all">
              https://api.in.intellectseecstag.com/magicplatform/v1/invokeasset/308f7c96-ef89-4680-9789-6a4afc48b5c2/usecase
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div><strong className="text-slate-300">Authorization:</strong> Bearer {'${access_token}'}</div>
              <div><strong className="text-slate-300">apikey:</strong> magicplatform.A8018652167E463eaD986C222F2A42D4</div>
              <div><strong className="text-slate-300">x-platform-workspaceid:</strong> d7d4d536-de17-4354-819a-fff06ba78b23</div>
              <div><strong className="text-slate-300">Payload:</strong> &#123; From, Subject: "Complaint regarding [Type]", Email_Body &#125;</div>
              <div><strong className="text-slate-300">Response:</strong> &#123; trace_id: "308f7c96-..." &#125;</div>
            </div>
          </div>

          {/* Step 3: Assets & Trace Inquiries */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400 font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Step 3: Asset Catalog & Trace Polling (GET)
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">
                GET /magicplatform/v1/assets
              </span>
            </div>
            <div className="text-slate-300 font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 break-all">
              https://api.in.intellectseecstag.com/magicplatform/v1/assets
            </div>
            <div className="text-slate-400 text-[11px]">
              Poll trace status: <code className="text-slate-300">/magicplatform/v1/invokeasset/308f7c96-ef89-4680-9789-6a4afc48b5c2/&#123;trace_id&#125;</code>
            </div>
          </div>

          {/* Test Live Gateway Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-slate-300">Live Gateway Connectivity Diagnostics</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestGateway}
                  disabled={testingGateway}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60 text-[11px]"
                >
                  {testingGateway ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking Token API...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Ping Token Gateway</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleTestAssets}
                  disabled={testingAssets}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60 text-[11px]"
                >
                  {testingAssets ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking Assets API...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Ping Assets Endpoint</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {gatewayResult && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Token Gateway Response (HTTP {gatewayResult.status || 200})</span>
                  <span className="text-emerald-400">Connected</span>
                </div>
                <pre className="text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800 max-h-40">
                  {JSON.stringify(gatewayResult, null, 2)}
                </pre>
              </div>
            )}

            {assetsResult && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Assets Endpoint Response (HTTP {assetsResult.status || 200})</span>
                  <span className="text-purple-400">Queried</span>
                </div>
                <pre className="text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800 max-h-40">
                  {JSON.stringify(assetsResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
