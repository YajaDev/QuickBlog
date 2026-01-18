import Header, { type TypeOfButton } from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../reduxStore/store";
import { useEffect, useState } from "react";
import { setNotification } from "../reduxStore/notificationSlice";
import { getBlogById, type Blog } from "../services/blogServices";
import { useParams, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const BlogDetail = () => {
  const { session } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const typeOfButton: TypeOfButton = session ? "dashboard" : "auth";
  const { id } = useParams();

  useEffect(() => {
    const getBlogDetails = async () => {
      if (!id) throw new Error("Blog ID not found");

      try {
        setIsLoading(true);
        const data = await getBlogById(id);
        setBlog(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        dispatch(setNotification({ status: "error", message }));
        navigate("/"); // Navigate back if blog not found
      } finally {
        setIsLoading(false);
      }
    };

    getBlogDetails();
  }, [dispatch, id, navigate]);

  return (
    <div className="mx-8 md:mx-20 xl:mx-32 md:mt-3">
      <Header typeOfButton={typeOfButton} />

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center h-60">
          <LoaderCircle className="text-primary animate-spin size-10" />
          <span className="text-secondary-foreground">loading...</span>
        </div>
      )}

      {/* Blog Detail */}
      {blog && (
        <article className="max-w-4xl mx-auto my-8">
          <div className="text-center mt-20 mb-15 text-secondary-foreground space-y-3">
            <p className="text-primary font-medium">
              Bublish on{" "}
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto">
              {blog.title}
            </h1>
            <h5 className="my-5 max-w-lg truncate mx-auto">{blog.subTitle}</h5>
          </div>

          {/* Blog Image */}
          {blog.img_url && (
            <div className="aspect-video shadow-xl rounded-xl overflow-hidden">
              <img src={blog.img_url} alt={blog.title} className="size-full" />
            </div>
          )}

          <div className="mx-2 md:mx-10 mt-5">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {blog.description}
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="text-primary/80 hover:text-primary flex items-center gap-2"
            >
              <span>←</span> Back to all blogs
            </button>
          </div>
        </article>
      )}
    </div>
  );
};

export default BlogDetail;
