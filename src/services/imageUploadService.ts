import { supabase } from "./supabaseService";

export const uploadBlogImage = async (file: File, userId: string) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);

  return data.publicUrl;
};

export const deleteBlogImage = async (imageUrl: string) => {
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split("/");
  const fileName = pathParts.slice(-2).join("/");

  const { error } = await supabase.storage.from("blog-images").remove([fileName]);
  if (error) throw error;
};
