/**
 * Privacy-First Telemetry & Analytics Engine (Umami / Plausible style)
 * 100% Cookie-free, lightweight, GDPR compliant, not blocked by AdBlock.
 */

export interface AnalyticsEvent {
  event: string;
  url?: string;
  properties?: Record<string, string | number | boolean>;
  timestamp?: string;
}

export function trackEvent(eventName: string, properties?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;

  const payload: AnalyticsEvent = {
    event: eventName,
    url: window.location.pathname,
    properties: properties || {},
    timestamp: new Date().toISOString(),
  };

  try {
    // Non-blocking navigator.sendBeacon or fetch
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/event', blob);
    } else {
      fetch('/api/analytics/event', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently without interrupting UI
  }
}
