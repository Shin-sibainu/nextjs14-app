import { authMiddleware, clerkClient, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/terms"],

  async afterAuth(auth, req) {
    if (!auth.userId && auth.isPublicRoute) {
      return;
    }

    //未ログインかつ非公開ルートへのアクセスはログイン画面へリダイレクト
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    //セッションにオンボーディングの完了ステータスがあるか確認
    let onboarded = auth.sessionClaims?.onboarded;

    //セッションになければClerkユーザー情報からステータス取得
    if (!onboarded) {
      const user = await clerkClient.users.getUser(auth.userId as string);
      onboarded = user.publicMetadata.onboarded;
    }

    // オンボーディング前ならオンボーディングページへリダイレクト
    if (!onboarded && req.nextUrl.pathname !== "/onboarding") {
      const orgSelection = new URL("/onboarding", req.url);
      return NextResponse.redirect(orgSelection);
    }

    // オンボーディング済みでオンボーディングページへアクセスしたらトップページへリダイレクト
    if (onboarded && req.nextUrl.pathname === "/onboarding") {
      const orgSelection = new URL("/", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

//ユーザーからのリクエストのパスが以下に該当した際にミドルウェアが発火する。
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
