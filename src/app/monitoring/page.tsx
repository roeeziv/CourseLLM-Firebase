
'use client';

import { useState, useEffect } from 'react';

export default function MonitoringPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/monitoring');
        if (!res.ok) {
          throw new Error('Failed to fetch monitoring data');
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">System Monitoring Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">CPU</h2>
          <p>Current Load: {data.cpu.currentLoad.toFixed(2)}%</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Memory</h2>
          <p>Total: {(data.memory.total / 1024 / 1024 / 1024).toFixed(2)} GB</p>
          <p>Used: {(data.memory.used / 1024 / 1024 / 1024).toFixed(2)} GB</p>
          <p>Free: {(data.memory.free / 1024 / 1024 / 1024).toFixed(2)} GB</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">FileSystem</h2>
          {data.filesystem.map((fs: any, index: number) => (
            <div key={index} className="mb-2">
              <p>Mount: {fs.mount}</p>
              <p>Size: {(fs.size / 1024 / 1024 / 1024).toFixed(2)} GB</p>
              <p>Used: {(fs.used / 1024 / 1024 / 1024).toFixed(2)} GB</p>
            </div>
          ))}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Network</h2>
          {Object.keys(data.network).map((iface: string, index: number) => (
            <div key={index} className="mb-2">
              <p>Interface: {iface}</p>
              <p>RX: {(data.network[iface].rx_bytes / 1024 / 1024).toFixed(2)} MB</p>
              <p>TX: {(data.network[iface].tx_bytes / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ))}
        </div>

        <div className="p-4 border rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold">Processes</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">PID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">CPU %</th>
                  <th className="px-4 py-2">Memory %</th>
                </tr>
              </thead>
              <tbody>
                {data.processes.list.slice(0, 10).map((p: any) => (
                  <tr key={p.pid}>
                    <td className="border px-4 py-2">{p.pid}</td>
                    <td className="border px-4 py-2">{p.name}</td>
                    <td className="border px-4 py-2">{p.cpu.toFixed(2)}</td>
                    <td className="border px-4 py-2">{p.mem.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
