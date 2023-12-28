import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus as ImageIcon } from "lucide-react";
import clsx from "clsx";
import { Progress } from "./progress";
import Image from "next/image";

function ImageUploader() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    setUploading(true);
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        setUploading(false);
        setUploadedImage(URL.createObjectURL(acceptedFiles[0]));
      }
    }, 500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {uploadedImage ? (
        <Image
          src={uploadedImage}
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
          {uploading ? (
            <Progress value={uploadProgress} max={100} className="h-2" />
          ) : (
            <ImageIcon size={50} strokeWidth={1.1} />
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
