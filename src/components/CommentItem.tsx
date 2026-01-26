import { useState } from "react";
import { deleteComment, type Comment } from "../services/commentServices";
import { useSelector } from "react-redux";
import type { RootState } from "../reduxStore/store";
import { timeAgo } from "../utils";
import CommentForm from "./CommentForm";

export default function CommentItem({ comment }: { comment: Comment }) {
  const { session } = useSelector((state: RootState) => state.auth);
  const [replying, setReplying] = useState(false);

  const userName = comment.user_email.split("@")[0] || "";
  const isOwner = session?.user.id === comment.user_id;

  return (
    <div className="ml-4 border-l pl-4 mt-3">
      {replying ? (
        <CommentForm
          blogId={comment.blog_id}
          toEdit={{ comment, onDone: () => setReplying(false) }}
        />
      ) : (
        <>
          <div className="text-xs font-medium pb-1.5">{userName}</div>

          {comment.image_url && (
            <div className="h-18 w-30 my-2 rounded overflow-hidden cursor-pointer">
              <img
                alt="Upload"
                className="size-full object-cover"
                src={comment.image_url}
              />
            </div>
          )}

          <p className="bg-primary/10 rounded-full px-5 py-1">
            {comment.content}
          </p>

          <div className="flex gap-2 text-xs mt-1">
            <p>{timeAgo(comment.created_at)}</p>

            {isOwner && (
              <>
                <button onClick={() => setReplying(!replying)}>Edit</button>

                <button
                  className="text-red-500"
                  onClick={async () => await deleteComment(comment.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
