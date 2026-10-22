'use client';

import React, { useState, useEffect } from 'react';
import { LiveRadarHeader } from './radar/LiveRadarHeader';
import { LiveVisitorFeed, ActiveVisitor } from './radar/LiveVisitorFeed';
import { TrafficBreakdownCards, TelemetryStatsData } from './radar/TrafficBreakdownCards';

interface TelemetryStreamData {
  activeCount: number;
  activeVisitors: ActiveVisitor[];
  todayStats: {
    totalViews: number;
    uniqueVisitors: number;
  };
}

export const AdminRadarTab: React.FC = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [activeVisitors, setActiveVisitors] = useState<ActiveVisitor[]>([]);
  const [todayViews, setTodayViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const [stats, setStats] = useState<TelemetryStatsData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // 1. Subscribe ke Server-Sent Events (SSE) Live Stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let isMounted = true;

    function connectSSE() {
      if (!isMounted) return;
      eventSource = new EventSource('/api/admin/telemetry/stream');

      eventSource.onopen = () => {
        if (isMounted) setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data) as TelemetryStreamData;
          setActiveCount(data.activeCount || 0);
          setActiveVisitors(data.activeVisitors || []);
          if (data.todayStats) {
            setTodayViews(data.todayStats.totalViews || 0);
            setUniqueVisitors(data.todayStats.uniqueVisitors || 0);
          }
        } catch (err) {
          console.error('Error parsing telemetry stream message:', err);
        }
      };

      eventSource.onerror = () => {
        if (isMounted) {
          setIsConnected(false);
          eventSource?.close();
          // Coba rekoneksi setelah 5 detik
          setTimeout(connectSSE, 5000);
        }
      };
    }

    connectSSE();

    return () => {
      isMounted = false;
      eventSource?.close();
    };
  }, []);

  // 2. Ambil data analitik teragregasi
  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/telemetry/stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setStats(data);
        }
      } catch (err) {
        console.error('Error loading telemetry stats:', err);
      } finally {
        if (isMounted) setIsLoadingStats(false);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. Header Metrik Realtime & Status SSE */}
      <LiveRadarHeader
        activeCount={activeCount}
        totalViews={todayViews}
        uniqueVisitors={uniqueVisitors}
        isConnected={isConnected}
      />

      {/* 2. Feed Sesi Pengunjung Aktif Detik Ini */}
      <LiveVisitorFeed visitors={activeVisitors} />

      {/* 3. Kartu Analitik Breakdown (Perangkat, Negara, Rujukan, Tren) */}
      <TrafficBreakdownCards stats={stats} isLoading={isLoadingStats} />
    </div>
  );
};
