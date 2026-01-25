import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../reduxStore/store";
import { useEffect, useState } from "react";
import { addBlog, editBlog, type NewBlog } from "../services/blogServices";
import uploadImg from "../assets/upload-img.svg";
import {
  deleteBlogImage,
  uploadBlogImage,
} from "../services/imageUploadService";
import { setNotification } from "../reduxStore/notificationSlice";
import { clearBlogToEdit, clearPages } from "../reduxStore/blogSlice";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const AddBlog = () => {
  const { session } = useSelector((state: RootState) => state.auth);
  const { blogToEdit } = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState<NewBlog>({
    title: "",
    subTitle: "",
    description: "",
    user_id: session?.user.id || "",
    img_url: null,
  });

  useEffect(() => {
    if (blogToEdit) {
      setBlogData({
        title: blogToEdit.title,
        subTitle: blogToEdit.subTitle,
        description: blogToEdit.description,
        user_id: session?.user.id || "",
        img_url: blogToEdit.img_url,
      });

      setPreviewUrl(blogToEdit.img_url); //Set preview URL to existing image
    }
  }, [blogToEdit, session?.user.id]);

  useEffect(() => {
    return () => resetBlogState();
  }, [dispatch]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;

    try {
      setIsLoading(true);
      const updatedBlogData = { ...blogData }; // local blog copy

      if (selectedFile) {
        // Delete prev image on bucket
        if (blogToEdit?.img_url) deleteBlogImage(blogToEdit.img_url);

        const imgUrl = await uploadBlogImage(selectedFile, session.user.id); // Upload image
        updatedBlogData.img_url = imgUrl; // Update blogData
      }

      if (blogToEdit) {
        await editBlog({
          blogId: blogToEdit.id,
          updatedBlog: updatedBlogData,
        });

        dispatch(
          setNotification({
            status: "success",
            message: "Blog updated successfully!",
          }),
        );

        navigate("/dashboard");
      } else {
        await addBlog(updatedBlogData);
        dispatch(clearPages());
        dispatch(
          setNotification({
            status: "success",
            message: "Blog created successfully!",
          }),
        );
      }

      // Reset form
      setBlogData({
        title: "",
        subTitle: "",
        description: "",
        user_id: session.user.id,
        img_url: null,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      dispatch(clearBlogToEdit());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      dispatch(setNotification({ status: "error", message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetBlogState();
    dispatch(clearBlogToEdit());
    navigate("/dashboard");
  };

  function resetBlogState() {
    setBlogData((state) => ({
      title: "",
      subTitle: "",
      description: "",
      user_id: state.user_id,
      img_url: null,
    }));
    setPreviewUrl(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background p-4 md:p-10 shadow rounded space-y-4 [&>div>label]:text-foreground/85"
    >
      <h2 className="text-2xl font-bold text-foreground/90">
        {blogToEdit ? "Edit Blog" : "Add New Blog"}
      </h2>

      <div>
        <label htmlFor="image" className="block mb-2">
          Upload thumbnail
        </label>

        <div className="relative">
          <label htmlFor="image">
            <div
              className={`h-18 w-30 mt-2 rounded overflow-hidden border-dashed cursor-pointer ${
                !previewUrl && "border"
              }`}
            >
              <img
                alt="Upload"
                className="size-full object-cover"
                src={previewUrl ? previewUrl : uploadImg}
              />
            </div>
          </label>

          {previewUrl && (
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
              }}
              className="absolute -top-1.5 left-32 p-1"
            >
              <X className="size-4 stroke-3 text-secondary-foreground bg-primary/10" />
            </button>
          )}
        </div>
        <input
          id="image"
          hidden
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {selectedFile && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block mb-2">
          Blog title
        </label>
        <input
          type="text"
          id="title"
          value={blogData.title || ""}
          required
          onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
          placeholder="Enter blog title"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="subTitle" className="block mb-2">
          Sub title
        </label>
        <input
          type="text"
          id="subTitle"
          value={blogData.subTitle || ""}
          onChange={(e) =>
            setBlogData({ ...blogData, subTitle: e.target.value })
          }
          placeholder="Enter subtitle (optional)"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="decription" className="block mb-2">
          Blog Description
        </label>
        <textarea
          id="decription"
          value={blogData.description || ""}
          required
          onChange={(e) =>
            setBlogData({ ...blogData, description: e.target.value })
          }
          placeholder="Enter blog description"
          className="w-full p-2 border rounded h-32"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-primary text-white px-4 py-2 rounded hover:bg-primary/85 ${
            isLoading && "cursor-not-allowed bg-primary/60"
          }`}
        >
          {isLoading
            ? "Uploading..."
            : blogToEdit
              ? "Update Blog"
              : "Create Blog"}
        </button>

        {blogToEdit && !isLoading && (
          <button
            type="button"
            className="px-4 py-2 rounded hover:bg-primary/20 transition-colors duration-300"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddBlog;
