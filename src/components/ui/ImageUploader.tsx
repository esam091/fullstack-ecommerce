"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus as ImageIcon, Trash } from "lucide-react";
import clsx from "clsx";
import { Progress } from "./progress";
import Image from "next/image";
import { useImageUpload } from "@/lib/useImageUpload";
import { Button } from "./button";

const imagePrefix =
  "https://rymmmspllbfdqosgmyzt.supabase.co/storage/v1/object/public/hc-images/";

type ImageUploaderProps = {
  onImageIdChange(id: string | null): void;
  value?: string;
};

function ImageUploader({ onImageIdChange, value }: ImageUploaderProps) {
  const {
    progress,
    isLoading,
    mutate: upload,
    isIdle,
    reset,
  } = useImageUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: !!value,
    maxFiles: 1,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".webp"],
    },
    onDrop(acceptedFiles) {
      const file = acceptedFiles[0];
      if (file) {
        upload(file, {
          onSuccess: onImageIdChange,
        });
      }
    },
  });

  const { className: rootClassName, ...rootProps } = getRootProps();

  return (
    <div
      {...rootProps}
      className={clsx(rootClassName, "group relative h-28 w-28")}
    >
      <input {...getInputProps()} />
      {value ? (
        <>
          <Image
            src={`${imagePrefix}${value}`}
            alt="Uploaded"
            className="h-full w-full rounded-md bg-cover shadow-sm"
            width={112}
            height={112}
          />

          <div className="none absolute bottom-0 left-0 right-0 top-0 hidden justify-end rounded-md bg-slate-800 bg-opacity-15 p-1 group-hover:flex">
            <Button
              type="button"
              size={"icon"}
              variant={"outline"}
              onClick={() => {
                reset();
                onImageIdChange(null);
              }}
            >
              <Trash size={20} />
            </Button>
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "flex h-full w-full  flex-col items-center justify-center rounded-md border-2  border-dashed p-2 py-10",
            isDragActive
              ? "border-blue-500 bg-blue-100 text-blue-600"
              : "border-gray-300 bg-background text-gray-300",
            isIdle && "cursor-pointer",
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
