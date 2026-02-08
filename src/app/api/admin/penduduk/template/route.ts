import { NextResponse } from "next/server"
import { generateTemplate } from "@/lib/excel"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const buffer = generateTemplate()

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="template_import_penduduk.xlsx"',
      },
    })
  } catch (error: any) {
    console.error("Template generation error:", error)
    return NextResponse.json(
      { message: "Failed to generate template", error: error.message },
      { status: 500 }
    )
  }
}
