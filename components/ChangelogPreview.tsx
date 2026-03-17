'use client';

import { useState } from 'react';
interface GenerateResult {
  changelog: string;
  commits: number;
  fromTag: string;
  toTag: string;
  model?: string;
}

interface ChangelogPreviewProps {
  result: GenerateResult | null;
  isLoading: boolean;
  error: string | null;
}

export default function ChangelogPreview({ result, isLoading, error }: ChangelogPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'preview' | 'raw'>('preview');

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.changelog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.changelog], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CHANGELOG-${result.fromTag}-to-${result.toTag}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="card p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">AI is working its magic…</p>
            <p className="text-sm text-gray-500 mt-1">Fetching commits and generating changelog</p>
          </div>
          <div className="flex gap-2 mt-2">
            {['Fetching commits', 'Analyzing PRs', 'Writing changelog'].map((step, i) => (
              <div
                key={step}
                className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isLimitError = error.includes('limit reached') || error.includes('limit');
    return (
      <div className="card p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">{isLimitError ? '🚦' : '❌'}</div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">
            {isLimitError ? 'Usage Limit Reached' : 'Generation Failed'}
          </h3>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          {isLimitError && (
            <a href="/pricing" className="btn-primary">
              Upgrade to Pro — $9/month
            </a>
          )}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">Your changelog will appear here</h3>
          <p className="text-gray-500 text-sm">
            Fill in the form on the left and click Generate Changelog to get started.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: '🔗', label: 'GitHub URL' },
              { icon: '🏷️', label: 'Tag Range' },
              { icon: '✨', label: 'AI Writes' },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span className="font-semibold text-gray-900">Changelog Generated</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {result.commits} commits · {result.fromTag} → {result.toTag}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('preview')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                view === 'preview'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setView('raw')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                view === 'raw'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Raw
            </button>
          </div>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            ⬇️ .md
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {view === 'raw' ? (
          <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-lg">
            {result.changelog}
          </pre>
        ) : (
          <MarkdownRenderer content={result.changelog} />
        )}
      </div>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  // Simple markdown renderer without external dependency issues
  const lines = content.split('\n');
  
  return (
    <div className="markdown-preview space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-200">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-semibold text-gray-900 mt-5 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 pl-2">
              <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
              <span className="text-gray-700 text-sm leading-relaxed">{renderInline(line.slice(2))}</span>
            </div>
          );
        }
        if (line.trim() === '') {
          return <div key={i} className="h-2"></div>;
        }
        return <p key={i} className="text-gray-700 text-sm leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Handle bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-gray-100 text-brand-700 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
