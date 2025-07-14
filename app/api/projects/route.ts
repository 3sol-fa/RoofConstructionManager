import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../lib/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    let projects = await storage.getProjects();
    if (userId) {
      // Get all personnel records for this user
      const personnel = await storage.getPersonnelByUser(Number(userId));
      const projectIds = new Set(personnel.map(p => p.projectId));
      projects = projects.filter(p => projectIds.has(p.id));
    }
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
