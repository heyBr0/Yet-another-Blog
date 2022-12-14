import { useState } from "react";
import { useBlogContext } from "../hooks/useBlogContext";
import { useAuthContext } from "../hooks/useAuthContext";

const BlogForm = () => {
  const { dispatch } = useBlogContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imgFile, uploading] = useState([]);

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(reader.result);
    };
  };

  const onChange = (e) => {
    const files = e.target.files;
    const file = files[0];
    getBase64(file);
  };

  const onLoad = (fileString) => {
    /* console.log(fileString); */
    uploading(fileString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const blog = { title, text, imgFile };
    const response = await fetch("/api/blogs", {
      method: "POST",
      body: JSON.stringify(blog),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setText("");
      uploading([]);
      setError(null);
      setEmptyFields([]);
      console.log("new blog added", json);
      dispatch({ type: "CREATE_BLOG", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new Blog post</h3>
      <label>Title</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Text:</label>
      <textarea
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
        className={emptyFields.includes("text") ? "error" : ""}
      />
      <hr />
      <h3>Post Icon Upload </h3>
     
   {/*    <p id="kilobyte">(max. file size: 60 kb)</p> */}
      <input id="fileButton" type="file" onChange={onChange} />
      <button>Add blog</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default BlogForm;
