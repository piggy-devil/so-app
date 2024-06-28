import bcrypt from "bcrypt";
import prisma from "@/lib/client";

export async function POST(request: Request) {
  try {
    const { email, password, name, username } = await request.json();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
      },
    });
    return Response.json({ message: "User created", user });
  } catch (error) {
    return Response.json({ error: "User could not be created" });
  }
}
