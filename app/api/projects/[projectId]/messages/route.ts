import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    
    // Mock messages data since we don't have a real messages table
    const mockMessages = [
      {
        id: 1,
        projectId: parseInt(projectId),
        senderId: 1,
        content: '안녕하세요! 오늘 작업 일정 확인해주세요.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        projectId: parseInt(projectId),
        senderId: 2,
        content: '네, 확인했습니다. 지붕 시공 작업 진행하겠습니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        projectId: parseInt(projectId),
        senderId: 3,
        content: '자재가 도착했습니다. 확인 부탁드립니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        projectId: parseInt(projectId),
        senderId: 1,
        content: '좋습니다! 자재 품질 확인 후 작업 진행하세요.',
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        projectId: parseInt(projectId),
        senderId: 4,
        content: '안전장비 점검 완료했습니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        updatedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(mockMessages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json();
    
    // Mock message creation
    const newMessage = {
      id: Date.now(), // Simple ID generation
      projectId: parseInt(projectId),
      senderId: body.senderId || 1,
      content: body.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
} 