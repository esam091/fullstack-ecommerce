import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import zod from "zod";

const schema = zod.object({
  id: zod.string(),
});

const uploadImage = async (
  imageFile: File,
  progressCallback: (progress: number) => void,
) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        progressCallback(progress);
      }
    };

    xhr.onload = async () => {
      if (xhr.status !== 200) {
        reject(new Error("Upload failed"));
      } else {
        const result = schema.safeParse(JSON.parse(String(xhr.response)));

        if (!result.success) {
          reject(new Error("Invalid response format"));
        } else {
          resolve(result.data.id);
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed"));
    };

    xhr.open("POST", "/api/upload-image", true);
    xhr.send(formData);
  });
};

export const useImageUpload = () => {
  const [progress, setProgress] = useState(0);
  const mutation = useMutation({
    mutationFn: (imageFile: File) => {
      return uploadImage(imageFile, setProgress);
    },
    onSettled() {
      setProgress(0);
    },
  });
  return {
    ...mutation,
    progress,
  };
};
