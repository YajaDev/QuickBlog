import { supabase } from "./supabaseService";

type Type = "blog" | "comments";

interface UploadProps {
  file: File;
  userId: string;
  type: Type;
}

interface DeleteImageProps {
  imageUrl: string;
  type: Type;
}

export const uploadImage = async ({ type, userId, file }: UploadProps) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from(`${type}-images`)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(`${type}-images`)
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const deleteImage = async ({ imageUrl, type }: DeleteImageProps) => {
  const pathParts = imageUrl.split("/");
  const fileName = pathParts.slice(-2).join("/");

  const { error } = await supabase.storage
    .from(`${type}-images`)
    .remove([fileName]);

  if (error) throw error;
};
