import React from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus as ImageIcon } from "lucide-react";
import clsx from "clsx";
import { Progress } from "./progress";
import Image from "next/image";
import { useImageUpload } from "@/lib/useImageUpload";

const imagePrefix =
  "https://rymmmspllbfdqosgmyzt.supabase.co/storage/v1/object/public/hc-images/";

function ImageUploader() {
  const { progress, isLoading, data, mutate: upload } = useImageUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".webp"],
    },
    onDrop(acceptedFiles) {
      const file = acceptedFiles[0];
      if (file) {
        upload(file);
      }
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {data ? (
        <Image
          src={`${imagePrefix}${data}`}
          alt="Uploaded"
          className="h-28 w-28 rounded-md"
          width={112}
          height={112}
        />
      ) : (
        <div
          className={clsx(
            "flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed  p-2 py-10",
            isDragActive
              ? "border-blue-500 bg-blue-100 text-blue-600"
              : "border-gray-300 bg-background text-gray-300",
          )}
        >
          {isLoading ? (
            <Progress value={progress} max={100} className="h-2" />
          ) : (
            <ImageIcon size={50} strokeWidth={1.1} />
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
