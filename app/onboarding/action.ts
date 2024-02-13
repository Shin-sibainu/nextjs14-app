import { z } from "zod";
import { authGuard } from "../actions/auth";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const UserSchema = z.object({
  name: z.string().max(120),
});

export const createUser = async (validatedData: FormData) => {
  "use server";

  const id = authGuard();
  const validatedFromData = UserSchema.parse({
    name: validatedData.get("name"),
  });

  const data: Prisma.UserUncheckedCreateInput = {
    name: validatedFromData.name,
    id,
  };

  //idとnameをDBに追加
  await db.user.create({
    data,
  });

  // Clerkのユーザーメタデータにオンボーディング完了ステータスをセット
  await clerkClient.users.updateUserMetadata(id, {
    publicMetadata: {
      onboarded: true,
    },
  });

  revalidatePath("/");

  redirect("/");
};
