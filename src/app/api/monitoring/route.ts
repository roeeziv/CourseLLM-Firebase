
import { NextResponse } from 'next/server';
import si from 'systeminformation';

export async function GET() {
  try {
    const cpuData = await si.currentLoad();
    const memData = await si.mem();
    const fsData = await si.fsSize();
    const networkData = await si.networkStats();
    const processData = await si.processes();

    const healthData = {
      cpu: cpuData,
      memory: memData,
      filesystem: fsData,
      network: networkData,
      processes: processData,
    };

    return NextResponse.json(healthData);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to retrieve system information' }),
      { status: 500 }
    );
  }
}
