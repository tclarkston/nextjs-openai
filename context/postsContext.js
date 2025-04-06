import { useCallback, useState } from "react";
import React from "react";

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    setPosts(postsFromSSR);
  }, []);

  const getPosts = useCallback(
    async (lastPostDate) => {
      const request = await fetch(`/api/getPosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({lastPostDate}),
      });
      const json = await request.json();
      const postResults = json.posts || [];
      console.log("POSTS: ", postResults);
      setPosts((value) => {
        const newPosts = [...value];
        postResults.forEach((post) => {
          const existingPost = newPosts.find((p) => p._id === post._id);
          if (!existingPost) {
            newPosts.push(post);
          }
        });
        return newPosts;
      });
    },
    [posts]
  );

  return (
    <PostsContext.Provider value={{ posts, setPostsFromSSR, getPosts }}>
      {children}
    </PostsContext.Provider>
  );
};
