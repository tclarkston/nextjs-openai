import { useCallback, useState } from "react";
import React from "react";

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const setPostdFromSSR = useCallback((postsFromSSR = []) => {
    setPosts(postsFromSSR);
  }, []);

  return (
    <PostsContext.Provider value={{ posts, setPostdFromSSR }}>
      {children}
    </PostsContext.Provider>
  );
};
