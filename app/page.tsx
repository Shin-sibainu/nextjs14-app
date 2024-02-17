import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const posts = await db.post.findMany();
  return (
    <main>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>記事はりません。</p>
      )}
    </main>
  );
}
