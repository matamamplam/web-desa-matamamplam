
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return await NextResponse.json(
        { error: "Email yang Anda masukkan belum terdaftar dalam sistem. Silakan periksa kembali penulisan email Anda atau hubungi administrator jika Anda yakin ini adalah kesalahan." },
        { status: 404 }
      );
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return NextResponse.json({ message: "Email sent!" });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
