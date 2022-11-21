import { useEffect } from "react";
import BlogDetails from "../components/BlogDetails";
import BlogForm from "../components/BlogForm";
import { useBlogContext } from "../hooks/useBlogContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
  const { blogs, dispatch } = useBlogContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch("https://yet-another-blog-api.onrender.com/", {
        headers:{
          "Authorization": `Bearer ${user.token}`
        }
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_BLOG", payload: json });
      }
    };

    if (user) {
      fetchBlogs();
    }
  }, [dispatch, user]);
  return (
    <div className="home">
      <div className="blogs">
        {blogs &&
          blogs.map((blog) => (
            <BlogDetails key={blog._id} blog={blog} />
          ))}
      </div>
      <BlogForm />
    </div>
  );
};

export default Home;
