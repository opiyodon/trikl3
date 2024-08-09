"use client";

import { Button } from "@nextui-org/react";
import { Upload } from "lucide-react";

const FilePicker = ({ handleFileUpload, fileName }) => {
  return (
    <>
      <Button className="btnPri my-4">
        <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
          <Upload size={20} />
          Upload Picture
        </label>
      </Button>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
    </>
  );
};

export default FilePicker;