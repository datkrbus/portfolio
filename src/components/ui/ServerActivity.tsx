'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BezelCard } from './BezelCard';

const MOCK_REQUESTS = [
  { method: 'GET', path: '/api/v1/users/profile', status: 200, ms: 12 },
  { method: 'POST', path: '/api/v1/orders/checkout', status: 201, ms: 45 },
  { method: 'GET', path: '/api/v1/menu/items?limit=10', status: 200, ms: 8 },
  { method: 'WS', path: '/ws/matchmaking', status: 'CONN', ms: 2 },
  { method: 'PUT', path: '/api/v1/seats/lock', status: 200, ms: 18 },
  { method: 'POST', path: '/webhook/sepay', status: 200, ms: 32 },
  { method: 'GET', path: '/api/v1/stats/revenue', status: 200, ms: 120 },
  { method: 'DEL', path: '/api/v1/cache/clear', status: 204, ms: 5 },
];

interface LogEntry {
  id: number;
  method: string;
  path: string;
  status: string | number;
  ms: number;
  timestamp: string;
}

export const ServerActivity: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    // Initial logs
    const initialLogs: LogEntry[] = [];
    for (let i = 0; i < 4; i++) {
      const req = MOCK_REQUESTS[Math.floor(Math.random() * MOCK_REQUESTS.length)];
      const d = new Date();
      d.setSeconds(d.getSeconds() - (4 - i) * 2);
      initialLogs.push({
        id: nextId.current++,
        ...req,
        timestamp: d.toISOString().substring(11, 19),
      });
    }
    setLogs(initialLogs);

    const interval = setInterval(() => {
      setLogs((prev) => {
        const req = MOCK_REQUESTS[Math.floor(Math.random() * MOCK_REQUESTS.length)];
        const newLog: LogEntry = {
          id: nextId.current++,
          ...req,
          timestamp: new Date().toISOString().substring(11, 19),
        };
        // Keep last 6 logs
        const updated = [...prev, newLog];
        if (updated.length > 6) return updated.slice(updated.length - 6);
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BezelCard innerClassName="server-activity-card">
      <div className="server-header">
        <div className="server-status-indicator">
          <span className="server-pulse"></span>
          <span className="server-status-text">System Online • 100% Uptime</span>
        </div>
        <div className="server-dots">
          <span className="window-dot window-dot-red" />
          <span className="window-dot window-dot-yellow" />
          <span className="window-dot window-dot-green" />
        </div>
      </div>
      
      <div className="server-body">
        <div className="server-metrics">
          <div className="metric-box">
            <span className="metric-label">CPU</span>
            <span className="metric-val">12%</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">MEM</span>
            <span className="metric-val">486MB</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">NET</span>
            <span className="metric-val">1.2MB/s</span>
          </div>
        </div>

        <div className="server-logs-container">
          {logs.map((log) => {
            let methodClass = 'method-get';
            if (log.method === 'POST') methodClass = 'method-post';
            else if (log.method === 'PUT') methodClass = 'method-put';
            else if (log.method === 'DEL') methodClass = 'method-del';
            else if (log.method === 'WS') methodClass = 'method-ws';

            return (
              <div key={log.id} className="server-log-line slide-up">
                <span className="log-time">[{log.timestamp}]</span>
                <span className={`log-method ${methodClass}`}>{log.method.padEnd(4, ' ')}</span>
                <span className="log-path">{log.path}</span>
                <span className={typeof log.status === 'number' && log.status >= 200 && log.status < 300 ? 'log-status-ok' : 'log-status-other'}>{log.status}</span>
                <span className="log-ms">{log.ms}ms</span>
              </div>
            );
          })}
          <div className="server-cursor">_</div>
        </div>
      </div>
    </BezelCard>
  );
};
