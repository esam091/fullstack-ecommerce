import { useMutation } from "@tanstack/react-query";
import zod from "zod";

const schema = zod.object({
  id: zod.string(),
});

const uploadImage = async (imageFile: File) => {
  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: imageFile,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const result = schema.safeParse(await response.json());

  if (!result.success) {
    throw new Error("Invalid response format");
  }

  return result.data.id;
};

export const useImageUpload = () => {
  const mutation = useMutation(uploadImage);
  return mutation;
};
