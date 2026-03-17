'use client';

import { useState } from 'react';

interface GenerateFormProps {
  onGenerate: (data: {
    repo: string;
    fromTag: string;
    toTag: string;
    githubToken?: string;
  }) => void;
  isLoading: boolean;
}

export default function GenerateForm({ onGenerate, isLoading }: GenerateFormProps) {
  const [repo, setRepo] = useState('');
  const [fromTag, setFromTag] = useState('');
  const [toTag, setToTag] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get or create session ID
    let sessionId = localStorage.getItem('changelog_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('changelog_session_id', sessionId);
    }

    onGenerate({
      repo: repo.trim(),
      fromTag: fromTag.trim(),
      toTag: toTag.trim(),
      githubToken: githubToken.trim() || undefined,
    });
  };

  const isValid = repo.trim() && fromTag.trim() && toTag.trim();

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Repository Details</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Repo URL */}
        <div>
          <label htmlFor="repo" className="block text-sm font-medium text-gray-700 mb-1.5">
            GitHub Repository URL
          </label>
          <input
            id="repo"
            type="url"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="https://github.com/vercel/next.js"
            className="input-field"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Paste the full GitHub URL</p>
        </div>

        {/* From Tag */}
        <div>
          <label htmlFor="fromTag" className="block text-sm font-medium text-gray-700 mb-1.5">
            From Tag (base)
          </label>
          <input
            id="fromTag"
            type="text"
            value={fromTag}
            onChange={(e) => setFromTag(e.target.value)}
            placeholder="v1.0.0"
            className="input-field font-mono"
            required
          />
          <p className="mt-1 text-xs text-gray-500">The older/starting tag</p>
        </div>

        {/* To Tag */}
        <div>
          <label htmlFor="toTag" className="block text-sm font-medium text-gray-700 mb-1.5">
            To Tag (head)
          </label>
          <input
            id="toTag"
            type="text"
            value={toTag}
            onChange={(e) => setToTag(e.target.value)}
            placeholder="v1.1.0"
            className="input-field font-mono"
            required
          />
          <p className="mt-1 text-xs text-gray-500">The newer/ending tag</p>
        </div>

        {/* Optional GitHub Token */}
        <div>
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            <span>{showToken ? '▼' : '▶'}</span>
            {showToken ? 'Hide' : 'Add'} GitHub Token (optional)
          </button>
          {showToken && (
            <div className="mt-3">
              <input
                id="githubToken"
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="input-field font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Required for private repos. Increases API rate limits for public repos.{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline"
                >
                  Generate token →
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="btn-primary w-full text-base"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            '✨ Generate Changelog'
          )}
        </button>
      </form>

      {/* Example */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs font-medium text-gray-500 mb-2">EXAMPLE</p>
        <button
          type="button"
          onClick={() => {
            setRepo('https://github.com/vercel/next.js');
            setFromTag('v14.0.0');
            setToTag('v14.1.0');
          }}
          className="text-xs text-brand-600 hover:text-brand-700 font-mono hover:underline"
        >
          github.com/vercel/next.js · v14.0.0..v14.1.0
        </button>
        <p className="text-xs text-gray-400 mt-1">Click to use this example</p>
      </div>
    </div>
  );
}
