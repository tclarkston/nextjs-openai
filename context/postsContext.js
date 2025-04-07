import { useCallback, useState } from "react";
import React from "react";

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [noMorePosts, setNoMorePosts] = useState(false);

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
      console.log("postResults length: ", postResults.length);
      if (postResults.length < 5) {
        setNoMorePosts(true);
      }

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
    <PostsContext.Provider value={{ posts, setPostsFromSSR, getPosts, noMorePosts }}>
      {children}
    </PostsContext.Provider>
  );
};
