import React from 'react'
import { IconButton, FormHelperText } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import './singleImageUploader.css'

interface SingleImageUploaderProps {
  setImage: React.Dispatch<React.SetStateAction<File | null>>
  image: File | string | null
  errorMsg?: string // Assuming errorMsg is a string representing the error message for the image validation
}

const SingleImageUploader: React.FC<SingleImageUploaderProps> = (props) => {
  const { setImage, image, errorMsg } = props
  const isFile = image instanceof File // Check if image is a File object
  const error = !image // Set the error flag to true if image is null or undefined

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setImage(file)
  }

  const removeImage = () => {
    setImage(null)
    const inputElement = document.querySelector('input[type="file"]')
    if (inputElement) {
      inputElement.value = '' // Clear the input field value
    }
  }

  return (
    <div>
      <div className="drop-area" >
        <input type="file" accept="image/*" onChange={handleFileInputChange} />
      </div>
      {image && !isFile && (
        <div className="image-preview">
          <div className="preview-item">
            <img src={image} alt="Preview" className="preview-image" />
            <IconButton onClick={removeImage} aria-label="delete">
              <DeleteIcon color="inherit" />
            </IconButton>
          </div>
        </div>
      )}
      {isFile && (
        <div className="image-preview">
          <div className="preview-item">
            <img src={URL.createObjectURL(image as File)} alt="Preview" className="preview-image" />
            <IconButton onClick={removeImage} aria-label="delete">
              <DeleteIcon color="inherit" />
            </IconButton>
          </div>
        </div>
      )}
      {error && <FormHelperText style={{ color: '#d32f2f' }}>{errorMsg}</FormHelperText>}
    </div>
  )
}

export default SingleImageUploader
