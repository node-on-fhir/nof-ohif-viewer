import React from 'react';
import type { Subscription } from './types';

interface SubscriptionListProps {
  subscriptions: Record<string, Subscription>;
  onUnsubscribe: (sub: Subscription) => void;
}

function EventChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
      {label}
    </span>
  );
}

export default function SubscriptionList({
  subscriptions,
  onUnsubscribe,
}: SubscriptionListProps) {
  const subs = Object.values(subscriptions).filter(Boolean);

  if (subs.length === 0) {
    return (
      <p className="text-muted-foreground text-xs italic">
        No active subscriptions
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
              Topic
            </th>
            <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
              Events
            </th>
            <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
              Status
            </th>
            <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {subs.map((sub) => (
            <tr key={sub.topic} className="border-b border-white/5">
              <td className="px-2 py-1.5 text-white">{sub.topic}</td>
              <td className="px-2 py-1.5">
                <div className="flex flex-wrap gap-1">
                  {sub.events.map((e) => (
                    <EventChip key={e} label={e} />
                  ))}
                </div>
              </td>
              <td className="px-2 py-1.5">
                {sub.status === 'active' && (
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400" title="Active" />
                )}
              </td>
              <td className="px-2 py-1.5">
                <button
                  className="text-muted-foreground hover:text-white text-xs"
                  onClick={() => onUnsubscribe(sub)}
                  title="Unsubscribe"
                >
                  Unsubscribe
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
