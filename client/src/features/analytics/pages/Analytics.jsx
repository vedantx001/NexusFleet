import React, { useEffect, useMemo, useState } from 'react';
import KPIcard from "../../../components/layout/KPIcard";
import { useFleet } from '../../../context/FleetContext';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { getAnalytics } from '../services/analyticsApi';

export default function Analytics() {
  const { trips, fuelLogs, isLoading, error } = useFleet();

  const [apiAnalytics, setApiAnalytics] = useState(null);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setApiError('');

    (async () => {
      try {
        const payload = await getAnalytics();
        if (!cancelled) setApiAnalytics(payload);
      } catch (err) {
        if (!cancelled) {
          const msg = err?.friendlyMessage || err?.message || 'Unable to load analytics.';
          setApiError(String(msg));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const lastCompletedTrip = useMemo(() => {
    const completed = Array.isArray(trips) ? trips.filter((t) => t?.status === 'Completed') : [];
    if (!completed.length) return null;

    const byTime = [...completed].sort((a, b) => {
      const aTime = a?.completedAt ? new Date(a.completedAt).getTime() : 0;
      const bTime = b?.completedAt ? new Date(b.completedAt).getTime() : 0;
      return bTime - aTime;
    });

    return byTime[0] || null;
  }, [trips]);

  const derived = useMemo(() => {
    if (!lastCompletedTrip) {
      return {
        fuelEfficiency: null,
        costPerKm: null,
      };
    }

    const startOdo = typeof lastCompletedTrip.startOdometer === 'number' ? lastCompletedTrip.startOdometer : null;
    const endOdo = typeof lastCompletedTrip.endOdometer === 'number' ? lastCompletedTrip.endOdometer : null;
    const distanceKm = startOdo != null && endOdo != null ? Math.max(0, endOdo - startOdo) : null;

    const vehicleId = String(lastCompletedTrip.vehicleId || '');
    const startDate = lastCompletedTrip.dispatchedAt ? String(lastCompletedTrip.dispatchedAt).slice(0, 10) : '';
    const endDate = lastCompletedTrip.completedAt ? String(lastCompletedTrip.completedAt).slice(0, 10) : '';

    const relevantFuel = (Array.isArray(fuelLogs) ? fuelLogs : []).filter((entry) => {
      if (!entry || String(entry.vehicleId) !== vehicleId) return false;
      if (!startDate || !endDate) return true;

      const d = String(entry.date || '');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return true;
      return d >= startDate && d <= endDate;
    });

    const totalCost = relevantFuel.reduce((sum, entry) => {
      const amount = typeof entry.amount === 'number' ? entry.amount : Number(entry.amount);
      return Number.isFinite(amount) ? sum + amount : sum;
    }, 0);

    const totalLiters = relevantFuel.reduce((sum, entry) => {
      const liters = typeof entry.liters === 'number' ? entry.liters : Number(entry.liters);
      return Number.isFinite(liters) ? sum + liters : sum;
    }, 0);

    const costPerKm = distanceKm && distanceKm > 0 ? totalCost / distanceKm : null;
    const fuelEfficiency = distanceKm && distanceKm > 0 && totalLiters > 0 ? distanceKm / totalLiters : null;

    return {
      fuelEfficiency,
      costPerKm,
    };
  }, [fuelLogs, lastCompletedTrip]);

  const kpis = [
    {
      title: 'Average Fuel Efficiency',
      value:
        typeof apiAnalytics?.fuelEfficiency === 'number'
          ? apiAnalytics.fuelEfficiency.toFixed(2)
          : derived.fuelEfficiency == null
            ? '—'
            : derived.fuelEfficiency.toFixed(2),
      label: 'km / L',
      description: lastCompletedTrip ? `Based on last completed trip (${lastCompletedTrip.id}).` : 'No completed trips yet.',
    },
    {
      title: 'Operational Cost / KM',
      value: derived.costPerKm == null ? '—' : derived.costPerKm.toFixed(2),
      label: '₹ / km',
      description: 'Fuel cost divided by trip distance.',
    },
  ];

  const handleExport = (format) => {
    console.log('Exporting report...', { format });
  };

  return (
    <div className="px-6 py-10 md:py-14 bg-main min-h-full">
      <div className="mx-auto max-w-7xl space-y-12">
        {isLoading && trips.length === 0 ? <Loader label="Loading analytics…" /> : null}
        {error ? <ErrorMessage message={error} /> : null}
        {apiError && !error ? <ErrorMessage message={apiError} /> : null}
        
        {/* Premium Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight premium-header">
            Operational Analytics
          </h1>
          <p className="mt-5 text-base text-muted max-w-2xl leading-relaxed">
            Decision intelligence placeholders for efficiency, ROI, and cost visibility. Monitor key performance indicators to optimize your fleet operations.
          </p>
        </header>

        {/* KPIs Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-primary">Key Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kpis.map((kpi) => (
              <KPIcard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                label={kpi.label}
                description={kpi.description}
              />
            ))}
          </div>
        </section>

        {/* Visualizations Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-primary">Visualizations</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Card */}
            <div className="card p-6 md:p-8 flex flex-col transition-all duration-300 hover:shadow-md-token">
              <div className="flex items-center justify-between gap-3 mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted">
                  Fuel Efficiency Trends
                </h3>
                <span className="badge status-neutral px-3 py-1 text-xs">Placeholder</span>
              </div>

              <div className="flex-1 flex items-center justify-center min-h-[240px] border-2 border-dashed border-default rounded-xl bg-[color-mix(in_srgb,var(--bg-main)_50%,transparent)]">
                <div className="text-center px-4 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-surface shadow-sm flex items-center justify-center text-muted mb-3">
                    <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <p className="text-sm font-medium text-primary">Interactive chart module</p>
                  <p className="text-xs text-muted">Awaiting data integration</p>
                </div>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="card p-6 md:p-8 flex flex-col transition-all duration-300 hover:shadow-md-token">
              <div className="flex items-center justify-between gap-3 mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted">
                  Operational Cost Breakdown
                </h3>
                <span className="badge status-neutral px-3 py-1 text-xs">Placeholder</span>
              </div>

              <div className="flex-1 space-y-8 flex flex-col justify-center">
                {/* Fuel Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-primary">Fuel Expenses</div>
                    <div className="text-xs font-bold text-accent">65%</div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-main overflow-hidden border border-default">
                    <div className="h-full rounded-full bg-[var(--brand-accent)] w-[65%] transition-all duration-1000 ease-out" />
                  </div>
                </div>

                {/* Maintenance Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-primary">Maintenance</div>
                    <div className="text-xs font-bold text-muted">35%</div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-main overflow-hidden border border-default">
                    <div className="h-full rounded-full bg-[var(--text-secondary)] w-[35%] transition-all duration-1000 ease-out opacity-40" />
                  </div>
                </div>

                {/* Legend */}
                <div className="pt-4 mt-2 border-t border-default flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--brand-accent)]"></div>
                    <span className="text-xs font-medium text-muted uppercase tracking-wide">Fuel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--text-secondary)] opacity-40"></div>
                    <span className="text-xs font-medium text-muted uppercase tracking-wide">Maintenance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reports Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-primary">Export & Reports</h2>
          </div>
          
          <div className="card p-6 md:p-8 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between border-t-4 border-t-[var(--brand-primary)]">
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-primary mb-1">Generate Monthly Report</h3>
              <p className="text-sm text-muted leading-relaxed">
                Download a comprehensive summary of fuel efficiency, ROI, and total operational costs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:shrink-0">
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg border border-default text-primary font-medium hover:bg-main transition-colors shadow-sm w-full sm:w-auto text-sm"
                onClick={() => handleExport("csv")}
              >
                Export CSV
              </button>
              <button
                type="button"
                className="btn-primary shadow-md-token px-6 py-2.5 font-medium w-full sm:w-auto text-sm"
                onClick={() => handleExport("pdf")}
              >
                Export PDF
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}