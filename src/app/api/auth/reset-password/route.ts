
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPasswordResetTokenByToken } from "@/lib/tokens";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return NextResponse.json({ error: "Token invalid!" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: "Token expired!" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User does not exist!" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });

    return NextResponse.json({ message: "Password updated!" });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
