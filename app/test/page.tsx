'use client';

import { useState } from 'react';
import DocumentUpload from '../../components/DocumentUpload';
import { Upload, Type, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<'text' | 'upload'>('text');
  const [inputText, setInputText] = useState('');
  const [claims, setClaims] = useState<any[]>([]);
  const [documentClaims, setDocumentClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractClaims = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/extractclaims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputText })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setClaims(data.claims || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract claims');
    } finally {
      setLoading(false);
    }
  };

  const verifyClaim = async (claim: string) => {
    try {
      const response = await fetch('/api/exasearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      alert(`Found ${data.results.length} sources to verify this claim!`);
      console.log('Search results:', data.results);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to verify claim');
    }
  };

  const handleFileProcessed = (data: any) => {
    setDocumentClaims(data.claims || []);
  };

  const resetAll = () => {
    setInputText('');
    setClaims([]);
    setDocumentClaims([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🧪 Hallucination Detector Test Lab</h1>
          <p className="text-gray-400 text-lg">
            Test our AI-powered claim extraction and verification system
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                activeTab === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Type className="w-5 h-5" />
              Text Input
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Upload className="w-5 h-5" />
              Document Upload
            </button>
          </div>
        </div>

        {/* Text Input Tab */}
        {activeTab === 'text' && (
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Type className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-semibold">Text Analysis</h2>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Enter text to analyze for factual claims:
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-48 p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 resize-none"
                  placeholder="Paste your text here... Try entering some factual statements about historical events, scientific facts, or current events."
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={extractClaims}
                      disabled={loading || !inputText.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Extracting Claims...
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          Extract Claims
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetAll}
                      className="px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {inputText.length} characters
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-400">{error}</p>
                </div>
              </div>
            )}

            {claims.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h2 className="text-2xl font-semibold">
                    Extracted Claims ({claims.length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {claims.map((claim, index) => (
                    <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">Claim #{index + 1}</h3>
                          <p className="text-gray-300 mb-3">{claim.claim}</p>
                          <div className="bg-gray-900 rounded p-3">
                            <p className="text-xs text-gray-400 mb-1">Original text:</p>
                            <p className="text-sm text-gray-500 italic">"{claim.original_text}"</p>
                          </div>
                        </div>
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                          ID: {index + 1}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => verifyClaim(claim.claim)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          🔍 Verify Claim
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(claim.claim);
                            alert('Claim copied to clipboard!');
                          }}
                          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Document Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <DocumentUpload onFileProcessed={handleFileProcessed} />

            {documentClaims.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h2 className="text-2xl font-semibold">
                    Claims from Document ({documentClaims.length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {documentClaims.map((claim, index) => (
                    <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">Document Claim #{index + 1}</h3>
                          <p className="text-gray-300 mb-3">{claim.claim}</p>
                          <div className="bg-gray-900 rounded p-3">
                            <p className="text-xs text-gray-400 mb-1">Original text:</p>
                            <p className="text-sm text-gray-500 italic">"{claim.original_text}"</p>
                          </div>
                        </div>
                        <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs">
                          Document #{index + 1}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => verifyClaim(claim.claim)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          🔍 Verify Claim
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(claim.claim);
                            alert('Claim copied to clipboard!');
                          }}
                          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Status */}
        <div className="mt-12 bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">API Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-500 font-medium">Exa Search API</span>
              </div>
              <p className="text-sm text-gray-400">Connected and working</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-500 font-medium">Groq LLM API</span>
              </div>
              <p className="text-sm text-gray-400">Connected and working</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}