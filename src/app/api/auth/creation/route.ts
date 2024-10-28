import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";

export async function GET() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log("User from session:", user);

  if (!user || user === null || !user.id) {
    console.error("No user found in session or user.id is missing");
    return NextResponse.redirect(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://projectshub-two.vercel.app/"
    );
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  console.log("User from database:", dbUser);

  if (!dbUser) {
    try {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          firstName: user.given_name ?? "",
          lastName: user.family_name ?? "",
          email: user.email ?? "",
          profileImage:
            user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
        },
      });
    } catch (error) {
      console.error("Error creating user in database:", error);
      return NextResponse.redirect(
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://projectshub-two.vercel.app/"
      );
    }
  }

  if (dbUser) {
    return NextResponse.redirect(
      process.env.NODE_ENV === "development"
      ?"http://localhost:3000/"
      : "https://projectshub-two.vercel.app/"
    );
  } else {
    return NextResponse.redirect(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://projectshub-two.vercel.app/"
    );
  }
}