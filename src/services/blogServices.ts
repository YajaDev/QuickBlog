import { supabase } from "./supabaseService";

export interface Blog {
  id: string; // UUID of the blog
  user_id: string; // UUID of the user who created it
  title: string; // Main title
  subTitle?: string; // Optional subtitle
  description: string; // Blog content or description
  img_url: string | null; // Image URL, nullable
  created_at: string; // ISO date string
}

export const getBlogs = async () => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

export const getBlogsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

export const editBlog = async ({
  blogId,
  updatedBlog,
}: {
  blogId: string;
  updatedBlog: Blog;
}) => {
  const { data, error } = await supabase
    .from("blogs")
    .update(updatedBlog)
    .eq("id", blogId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteBlog = async (blogId: string) => {
  const { error } = await supabase.from("blogs").delete().eq("id", blogId);
  if (error) throw error;
};
