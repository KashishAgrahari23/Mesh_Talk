import React, { useRef, useState } from "react"
import { Send, Image as ImageIcon } from "lucide-react"

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
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async(e:any)=>{
    e.preventDefault()
    if(!message.trim() && !imageFile) return
     
    setIsUploading(true)
    await handleMessageSend(e,imageFile)
    setImageFile(null)
    setIsUploading(false)
  }
  if(!selectedUser) return null
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  return (
    <div className="p-4 border-t border-gray-700 bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        {/* Image Upload */}
        <button
          type="button"
          onClick={handleImageClick}
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          disabled={!selectedUser}
        >
          <ImageIcon className="w-5 h-5 text-gray-300" />
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
          disabled={!selectedUser}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none"
        />

        {/* Send */}
        <button
          type="submit"
          disabled={!selectedUser || (!message && !imageFile)}
          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </form>

      {/* Preview selected image */}
      {imageFile && (
        <p className="text-xs text-gray-400 mt-2">
          Selected: {imageFile.name}
        </p>
      )}
    </div>
  )
}

export default MessageInput