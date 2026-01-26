import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBlog,
  getBlogsByUser,
  type Blog,
} from "../services/blogServices";
import type { RootState } from "../reduxStore/store";
import { clearPages, setBlogToEdit } from "../reduxStore/blogSlice";
import { useNavigate } from "react-router-dom";
import { deleteImage } from "../services/imageUploadService";
import { setNotification } from "../reduxStore/notificationSlice";

export default function BlogListPage() {
  const { session } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session || blogs) return;

    const fetchBlog = async () => {
      setIsLoading(true);

      const data = await getBlogsByUser(session.user.id);
      setBlogs(data);
      setIsLoading(false);
    };

    fetchBlog();
  }, [blogs, session]);

  const handleEdit = (blog: Blog) => {
    dispatch(setBlogToEdit(blog));
    navigate("addblog");
  };

  const handleDelete = async (blog: Blog) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    try {
      if (blog.img_url) {
        await deleteImage({ type: "blog", imageUrl: blog.img_url });
      }
      await deleteBlog(blog.id);
      setBlogs((prev) => prev?.filter((b) => b.id !== blog.id) || null);

      dispatch(clearPages());

      dispatch(
        setNotification({
          status: "success",
          message: "Blog deleted successfully",
        }),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete blog";

      dispatch(setNotification({ status: "error", message }));
    }
  };

  return (
    <>
      <h5 className="text-foreground/85 max-sm:bg-background max-sm:p-3 font-medium pb-4">
        All Blogs
      </h5>

      <div className="text-sm bg-background shadow rounded">
        <table className="w-full tex p-4 md:p-10 text-secondary-foreground">
          <thead>
            <tr className="[&>th]:px-2 [&>th]:py-4">
              <th>#</th>
              <th>BLOG TITLE</th>
              <th className="max-md:hidden text-left">DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {blogs &&
              !isLoading &&
              blogs.map((blog, i) => (
                <tr
                  key={blog.id}
                  className="border-y border-border [&>td]:px-2 [&>td]:py-4"
                >
                  <th>{i + 1}</th>
                  <td>{blog.title}</td>
                  <td className="max-md:hidden">
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="flex justify-center [&>button]:p-2">
                      <button onClick={() => handleEdit(blog)}>
                        <Pencil className="text-primary size-4" />
                      </button>
                      <button onClick={() => handleDelete(blog)}>
                        <Trash2 className="text-red-500 size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {isLoading && (
          <div className="flex flex-col justify-center items-center h-60 w-full">
            <LoaderCircle className="text-primary animate-spin size-10" />
            <span className="text-secondary-foreground">loading...</span>
          </div>
        )}

        {!blogs && !isLoading && <p>No Blogs found</p>}
      </div>
    </>
  );
}
