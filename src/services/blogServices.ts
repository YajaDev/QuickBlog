import { supabase } from "./supabaseService";

export interface Blog {
  id: string;
  user_id: string;
  title: string;
  subTitle?: string;
  description: string;
  img_url: string | null;
  created_at: string;
}

export type NewBlog = Omit<Blog, "id" | "created_at">;

export const getBlogs = async (
  from: number,
  to: number,
  blogsPerPage: number
) => {
  const { data, count, error } = await supabase
    .from("blogs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    blogs: data || [],
    pageCount: Math.ceil((count || 0) / blogsPerPage),
  };
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

export const addBlog = async (blog: NewBlog) => {
  const { data, error } = await supabase.from("blogs").insert(blog).single();

  if (error) throw error;

  return data;
};

export const editBlog = async ({
  blogId,
  updatedBlog,
}: {
  blogId: string;
  updatedBlog: Partial<Blog>;
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
