import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo";
import { useContext, useEffect } from "react";
import PostsContext from "../../../context/postsContext";

export const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
}) => {
  const { user } = useUser();
  const { setPostsFromSSR, posts, getPosts, noMorePosts } = useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
  }, [postsFromSSR, setPostsFromSSR]);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link className="btn" href="/post/new">
            New Post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post._id}`}
              className={`block border border-white/0 m-2 p-2 bg-white/10 rounded-sm ${
                postId === post.id ? "bg-white/30 border-white" : ""
              }`}
            >
              <div>{post.topic}</div>
            </Link>
          ))}
          { noMorePosts && (
            <div className="text-center text-slate-400 text-sm mt-4">
              No more posts
            </div>
          )}
          {!noMorePosts && (
          <div
              className="hover:underline text-slate-400 text-center cursor-pointer text-sm mt-4"
              onClick={() => {
                getPosts(posts[posts?.length - 1]?.created);
              }}
            >
              Load More Posts
            </div>
          )}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  width={50}
                  height={50}
                  className="rounded-full bg-white"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
        </div>

          {children}
    </div>
  );
};
