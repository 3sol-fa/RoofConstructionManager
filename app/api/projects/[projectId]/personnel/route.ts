import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    
    // Mock personnel data since we don't have a real personnel table
    const mockPersonnel = [
      {
        id: 1,
        projectId: parseInt(projectId),
        name: 'John Kim',
        role: 'Site Manager',
        phone: '010-1234-5678',
        email: 'kim@example.com',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days from now
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        projectId: parseInt(projectId),
        name: 'Alex Lee',
        role: 'Worker',
        phone: '010-2345-6789',
        email: 'lee@example.com',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(), // 25 days ago
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 55).toISOString(), // 55 days from now
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        projectId: parseInt(projectId),
        name: 'Michael Park',
        role: 'Worker',
        phone: '010-3456-7890',
        email: 'park@example.com',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50).toISOString(), // 50 days from now
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        projectId: parseInt(projectId),
        name: 'Sarah Choi',
        role: 'Safety Manager',
        phone: '010-4567-8901',
        email: 'choi@example.com',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days from now
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        projectId: parseInt(projectId),
        name: 'Paul Jung',
        role: 'Technician',
        phone: '010-5678-9012',
        email: 'jung@example.com',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40).toISOString(), // 40 days from now
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(mockPersonnel)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch personnel' }, { status: 500 })
  }
} 