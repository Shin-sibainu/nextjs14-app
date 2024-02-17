import { authGuard } from "@/app/actions/auth";
import { db } from "@/lib/prisma";
import { putImage } from "@/lib/storage";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PostSchema = z.object({
  body: z.string().max(140),
});

export const createPost = async (formData: FormData) => {
  const authorId = authGuard();
  const id = randomUUID();
  const validatedData = PostSchema.parse({
    body: formData.get("body"),
  });
  const newData: Prisma.PostUncheckedCreateInput = {
    ...validatedData,
    id,
    authorId,
  };

  const thumbnailDataURL = formData.get("thumbnail") as string;

  if (thumbnailDataURL) {
    newData.thumbnailURL = await putImage(
      thumbnailDataURL,
      `posts/${id}/thumbnail.png`
    );
  }

  await db.post.create({
    data: newData,
  });

  revalidatePath("/");
  redirect("/");
};
