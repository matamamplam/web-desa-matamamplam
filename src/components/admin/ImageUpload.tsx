"use client"

import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { useCallback } from "react"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  disabled
}: ImageUploadProps) {
  const onUpload = useCallback((result: any) => {
    onChange(result.info.secure_url)
  }, [onChange])

  return (
    <div className="mb-4 flex flex-col items-center gap-4 border-2 border-dashed border-gray-300 p-4 rounded-lg">
      <CldUploadWidget 
        onSuccess={onUpload}
        uploadPreset="ml_default"
        options={{
          maxFiles: 1
        }}
      >
        {({ open }) => {
          return (
            <div onClick={() => !disabled && open()} className="relative cursor-pointer hover:opacity-70 transition text-center w-full">
               {value ? (
                <div className="relative h-48 w-full">
                  <Image
                    fill
                    style={{ objectFit: "cover" }}
                    src={value}
                    alt="Upload"
                    className="rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition rounded-md">
                     <p className="text-white font-semibold">Ganti Gambar</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-md">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 mt-2">
                    <span className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                      Upload Thumbnail
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        }}
      </CldUploadWidget>

      {/* Manual Input Fallback (In case Widget fails or user has URL) */}
       {!value && (
         <div className="w-full">
           <p className="text-xs text-center text-gray-400 mb-1">atau</p>
           <input
            type="text"
            placeholder="Paste URL gambar (opsional)"
            className="w-full text-xs border rounded px-2 py-1"
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
           />
         </div>
       )}
    </div>
  )
}
