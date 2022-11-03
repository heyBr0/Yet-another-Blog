import { createContext, useReducer } from "react";

export const BlogContext = createContext();

export const blogReducer = (state, action) => {
  switch (action.type) {
    case "SET_BLOG":
      return {
        blogs: action.payload,
      };
    case "CREATE_BLOG":
      return {
        blogs: [action.payload, ...state.blogs],
      };
    case "DELETE_BLOG":
      return {
        blogs: state.blogs.filter(
          (item) => item._id !== action.payload._id
        ),
      };

    default:
      return state;
  }
};

export const BlogsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, { blogs: null });

  return (
    <BlogContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BlogContext.Provider>
  );
};
