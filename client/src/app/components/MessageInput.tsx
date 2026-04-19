import React, { useRef, useState } from "react"
import { Send, ImagePlus , X } from "lucide-react"
import Image from "next/image"

interface MessageInputProps {
  selectedUser: string | null
  message: string
  setMessage: (message: string) => void
  handleMessageSend: (e: any, imageFile?: File | null) => void
}

const MessageInput = ({
  selectedUser,
  message,
  setMessage,
  handleMessageSend,
}: MessageInputProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!message.trim() && !imageFile) return

    setIsUploading(true)
    await handleMessageSend(e, imageFile)

    setMessage("")
    setImageFile(null)
    setPreview(null)
    setIsUploading(false)
  }

  if (!selectedUser) return null

  const handleImageClick = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreview(URL.createObjectURL(file)) 
    }
  }

  return (
    <div className="p-3 border-t border-gray-700 bg-gray-900">

      {/* Preview */}
      {preview && (
  <div className="mb-2 relative inline-block">
    <Image
      src={preview}
      alt="preview"
      className="w-32 h-32 object-cover rounded-lg"
      width={1}
      height={1}
    />

    <button
      type="button"
      onClick={() => {
        setImageFile(null)
        setPreview(null)
        if (fileRef.current) {
          fileRef.current.value = "" 
        }
      }}
      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 p-1 rounded-full"
    >
      <X className="w-4 h-4 text-white" />
    </button>
  </div>
)}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        {/* Image Button */}
        <button
          type="button"
          onClick={handleImageClick}
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <ImagePlus className="w-5 h-5 text-gray-300" />
        </button>

        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-white outline-none"
        />

        {/* Send */}
        <button
          type="submit"
          disabled={isUploading || (!message && !imageFile)}
          className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </form>
    </div>
  )
}

export default MessageInput