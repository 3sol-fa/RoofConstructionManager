import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    
    // Mock activities data since we don't have a real activities table
    const mockActivities = [
      {
        id: 1,
        projectId: parseInt(projectId),
        activityType: 'file_upload',
        description: 'A new drawing file has been uploaded',
        userId: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        projectId: parseInt(projectId),
        activityType: 'task_complete',
        description: 'Roof construction task has been completed',
        userId: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        projectId: parseInt(projectId),
        activityType: 'material_order',
        description: 'New materials have been ordered',
        userId: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        projectId: parseInt(projectId),
        activityType: 'personnel_assigned',
        description: 'A new worker has been assigned',
        userId: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        projectId: parseInt(projectId),
        activityType: 'task_start',
        description: 'Waterproofing work has started',
        userId: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        updatedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(mockActivities)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
} 