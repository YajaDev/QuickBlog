  import { useEffect, useState } from "react";
  import { getBlogComment, type Comment } from "../services/commentServices";
  import { setNotification } from "../reduxStore/notificationSlice";
  import { useDispatch } from "react-redux";
  import CommentItem from "./CommentItem";
  import { supabase } from "../services/supabaseService";

  const CommentsContainer = ({ blogId }: { blogId: string }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
      const fetchComment = async () => {
        try {
          const data = await getBlogComment(blogId);
          setComments(data);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unexpected error";
          dispatch(setNotification({ status: "error", message }));
        }
      };

      fetchComment();
    }, [blogId, dispatch]);

    useEffect(() => {
      const channel = supabase
        .channel("comments-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "comments",
            filter: `blog_id=eq.${blogId}`,
          },
          (payload) => {
            console.log(payload);

            if (payload.eventType === "INSERT") {
              setComments((prev) => [payload.new as Comment, ...prev]);
              console.log("insert");
            }

            if (payload.eventType === "UPDATE") {
              setComments((prev) =>
                prev.map((c) =>
                  c.id === payload.new.id ? (payload.new as Comment) : c,
                ),
              );
              console.log("update");
            }

            if (payload.eventType === "DELETE") {
              setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
              console.log("delete");
            }
          },
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }, [blogId]);

    return (
      <div className="mt-5">
        <h3 className="font-medium">Comments ({comments.length})</h3>
        <div>
          {comments &&
            comments.map((c) => (
              <div key={c.id}>
                <CommentItem comment={c} />
              </div>
            ))}
        </div>
      </div>
    );
  };

  export default CommentsContainer;
