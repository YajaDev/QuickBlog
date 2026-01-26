export function handleImageFileChange(
  e: React.ChangeEvent<HTMLInputElement>,
  setSelectedFile: (file: File | null) => void,
  setPreviewUrl: (url: string | null) => void
) {
  const file = e.target.files?.[0];
  if (!file) return;

  setSelectedFile(file);

  const objectUrl = URL.createObjectURL(file);
  setPreviewUrl(objectUrl);
}

export const timeAgo = (date: string) => {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  return `${Math.floor(seconds / 86400)}d ago`;
};
