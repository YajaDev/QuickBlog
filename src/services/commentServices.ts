import { supabase } from "./supabaseService";

export interface Comment {
  id: string;
  user_id: string;
  content: string;
  user_email: string;
  image_url: string | null;
  created_at: string;
  blog_id: string;
}

export const getBlogComment = async (blogId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("blog_id", blogId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Comment[];
};

export const addComment = async ({
  blogId,
  content,
  user_email,
  image_url,
}: {
  blogId: string;
  content: string;
  image_url: string | null;
  user_email: string;
}) => {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      blog_id: blogId,
      content,
      image_url,
      user_email,
    })
    .single();

  if (error) throw error;
  return data;
};

export const editComment = async ({
  commentId,
  updatedComment,
}: {
  commentId: string;
  updatedComment: Partial<Comment>;
}) => {
  const { error } = await supabase
    .from("comments")
    .update(updatedComment)
    .eq("id", commentId)
    .single();

  if (error) throw error;
};

export const deleteComment = async (comment_id: string) => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", comment_id)

  if (error) throw error;
};
