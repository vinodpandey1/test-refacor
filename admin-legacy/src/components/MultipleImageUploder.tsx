import React, { useState } from 'react'
import './multipleImage.css'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Grid from '@mui/material/Grid'

interface MultipleImageUploaderProps {
  setImages: React.Dispatch<React.SetStateAction<File[]>>
  images: File[]
}

const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = (props) => {
  const { setImages, images } = props
  //   const [images, setImages] = useState<File[]>([])

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const files = Array.from(event.dataTransfer.files)
    const droppedImages = files.filter((file) => file.type.startsWith('image/'))

    setImages((prevImages) => [...prevImages, ...droppedImages])
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDragStart = (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDropTarget = (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const draggedIndex = Number(event.dataTransfer.getData('text/plain'))
    const updatedImages = [...images]
    const draggedImage = updatedImages[draggedIndex]
    updatedImages.splice(draggedIndex, 1)
    updatedImages.splice(index, 0, draggedImage)
    setImages(updatedImages)
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files as FileList)
    const selectedImages = files.filter((file) => file.type.startsWith('image/'))

    setImages((prevImages) => [...prevImages, ...selectedImages])
  }

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  return (
    <>
      <Grid item xs={4}>
        <div className="drop-area" onDragOver={handleDragOver} onDrop={handleDrop}>
          <input type="file" accept="image/*" multiple onChange={handleFileInputChange} />
        </div>
      </Grid>
      <div className="image-preview">
        {images.map((image, index) => (
          <div
            key={index}
            className="preview-item"
            draggable
            onDragStart={handleDragStart(index)}
            onDrop={handleDropTarget(index)}
            onDragOver={handleDragOver}
          >
            <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="preview-image" />
            <span>{`priority ${index + 1}`}</span>
            <IconButton onClick={() => removeImage(index)} aria-label="delete">
              <DeleteIcon color="inherit" />
            </IconButton>
          </div>
        ))}
      </div>
    </>
  )
}

export default MultipleImageUploader
