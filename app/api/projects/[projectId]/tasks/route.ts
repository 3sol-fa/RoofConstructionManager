import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../lib/storage'
import { insertTaskSchema } from '../../../../../shared/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const tasks = await storage.getTasksByProject(parseInt(projectId))
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json()
    const validatedData = insertTaskSchema.parse({
      ...body,
      projectId: parseInt(projectId)
    })
    const task = await storage.createTask(validatedData)
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid task data' }, { status: 400 })
  }
}