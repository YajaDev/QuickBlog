import { useEffect, useState } from "react";
import {
  addComment,
  editComment,
  type Comment,
} from "../services/commentServices";
import { setNotification } from "../reduxStore/notificationSlice";
import { handleImageFileChange } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { Camera, SendHorizontal, X } from "lucide-react";
import type { RootState } from "../reduxStore/store";
import { deleteImage, uploadImage } from "../services/imageUploadService";

interface Props {
  blogId: string;
  toEdit?: {
    comment: Comment;
    onDone: () => void;
  };
}

export default function CommentForm({ blogId, toEdit }: Props) {
  const { session } = useSelector((state: RootState) => state.auth);

  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null | "idle">(
    "idle",
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toEdit) {
      setContent(toEdit.comment.content);
      setPreviewUrl(toEdit.comment.image_url);
      setSelectedFile("idle");
    }
  }, [toEdit]);

  const handleSubmit = async (e: React.FormEvent<Element>) => {
    e.preventDefault();

    try {
      if (!session)
        throw new Error(`Cant comment unauthorized user. "Login first"`);

      setLoading(true);
      let image_url = toEdit?.comment.image_url || null;

      if (selectedFile === null && image_url) {
        console.log("delete img");
        await deleteImage({
          type: "comments",
          imageUrl: image_url,
        });
        image_url = null;
      }

      if (selectedFile instanceof File) {
        if (image_url) {
          await deleteImage({
            type: "comments",
            imageUrl: image_url,
          });
        }

        const imageUrl = await uploadImage({
          type: "comments",
          file: selectedFile,
          userId: session.user.id,
        });

        image_url = imageUrl;
      }

      if (toEdit) {
        await editComment({
          commentId: toEdit.comment.id,
          updatedComment: { content, image_url },
        });
      } else {
        await addComment({
          blogId,
          content,
          image_url,
          user_email: session?.user.email || "",
        });
      }

      toEdit?.onDone();

      setContent("");
      setSelectedFile(null);
      setPreviewUrl(null);
      dispatch(
        setNotification({ status: "success", message: "Comment added" }),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      dispatch(setNotification({ status: "error", message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg bg-primary/10 border mt-10 border-primary/10">
        <textarea
          className="w-full rounded p-2 outline-none scroll-hidden"
          placeholder="Write a comment..."
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          id="image"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) =>
            handleImageFileChange(e, setSelectedFile, setPreviewUrl)
          }
        />
        <div className="flex justify-between items-center py-1 px-3">
          <label htmlFor="image">
            <Camera className="size-5 stroke-2 hover:scale-110 duration-300 text-foreground/90 cursor-pointer" />
          </label>
          <div className="flex  gap-4">
            {toEdit && (
              <button type="button" className="text-red-500 text-sm" onClick={toEdit.onDone}>
                Cancel
              </button>
            )}
            <button type="submit" disabled={loading}>
              <SendHorizontal
                className={`size-5 fill-primary/80 text-primary stroke-1 hover:scale-110 duration-300 ${loading && "opacity-70"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="relative">
          <div className="h-18 w-30 my-2 rounded overflow-hidden cursor-pointer ">
            <img
              alt="Upload"
              className="size-full object-cover"
              src={previewUrl}
            />
          </div>

          <button
            className="absolute top-0 left-32 p-1 text-secondary-foreground hover:bg-primary/10 cursor-pointer rounded-full"
            onClick={() => {
              setPreviewUrl(null);
              setSelectedFile(null);
            }}
          >
            <X className="size-4 stroke-3" />
          </button>
        </div>
      )}
    </form>
  );
}
