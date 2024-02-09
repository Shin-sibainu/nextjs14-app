import { auth } from "@clerk/nextjs";

export const authGuard = () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("新規登録 or ログインしてください。");
  }

  return userId;
};
