import { useBlogContext } from "../hooks/useBlogContext";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";

const BlogDetails = ({ blog }) => {
  const { dispatch } = useBlogContext();
  const { user } = useAuthContext();
  const handleClick = async () => {
    if (!user) {
      return;
    }
    const response = await fetch("api/blogs/" + blog._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_BLOG", payload: json });
    }
  };
  return (
    <div className="blog-details">
      <h4>{blog.title}</h4>
      <p className="textDetails">{blog.text}</p>
      <p>
        {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
      </p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default BlogDetails;
