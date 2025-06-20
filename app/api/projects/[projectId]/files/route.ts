import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../lib/storage'
import { insertFileSchema } from '../../../../../shared/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const files = await storage.getFilesByProject(parseInt(projectId))
    return NextResponse.json(files)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json()
    const validatedData = insertFileSchema.parse({
      ...body,
      projectId: parseInt(projectId)
    })
    const file = await storage.createFile(validatedData)
    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid file data' }, { status: 400 })
  }
}