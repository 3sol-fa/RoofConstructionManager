import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../lib/storage'
import { insertMaterialSchema } from '../../../../../shared/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const materials = await storage.getMaterialsByProject(parseInt(projectId))
    return NextResponse.json(materials)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json()
    const validatedData = insertMaterialSchema.parse({
      ...body,
      projectId: parseInt(projectId)
    })
    const material = await storage.createMaterial(validatedData)
    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid material data' }, { status: 400 })
  }
}