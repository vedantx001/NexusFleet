import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function humanizeFeatureName(value) {
  if (!value) return 'Unknown Feature';

  const cleaned = String(value)
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  if (!cleaned) return 'Unknown Feature';

  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function FeatureComingSoon({ featureName }) {
  const navigate = useNavigate();
  const location = useLocation();

  const routeFeature = useMemo(() => {
    const segment = String(location?.pathname || '')
      .split('/')
      .filter(Boolean)[0];
    return segment || 'unknown';
  }, [location?.pathname]);

  const label = humanizeFeatureName(featureName || routeFeature);

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-(--border) bg-(--bg-surface) p-6 shadow-sm">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
              Feature Not Developed Yet
            </div>
            <h1 className="text-xl font-bold text-(--text-primary)">{label}</h1>
            <p className="text-(--text-secondary)">🚧 This feature is not developed yet.</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition border border-(--border) bg-(--bg-main) text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface)"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
