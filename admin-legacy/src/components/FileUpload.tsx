import React from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
import { readString } from 'papaparse'
import { read, utils, WorkBook, WorkSheet } from 'xlsx'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dropzone: {
    width: '400px',
    minHeight: '200px',
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))

interface FileUploadProps {
  onFileUpload: (file: File) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const classes = useStyles()

  const handleFileUpload = (files: File[]) => {
    const file = files[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const contents = e.target?.result as string
        const fileType = file.name.split('.').pop()?.toLowerCase()

        if (fileType === 'csv') {
          const { data } = readString(contents)
          const jsonData = JSON.stringify(data)
          const jsonFile = new File([jsonData], 'data.json', { type: 'application/json' })
          onFileUpload(jsonFile)
        } else if (fileType === 'xlsx') {
          const workbook: WorkBook = read(contents, { type: 'binary' })
          const sheetName: string = workbook.SheetNames[0]
          const sheet: WorkSheet = workbook.Sheets[sheetName]
          const jsonData = utils.sheet_to_json(sheet, { header: 1 })
          const jsonFile = new File([JSON.stringify(jsonData)], 'data.json', { type: 'application/json' })
          onFileUpload(jsonFile)
        } else {
          console.log('Unsupported file type')
        }
      }

      reader.readAsBinaryString(file)
    }
  }

  return (
    <div>
      <DropzoneArea
        acceptedFiles={['.csv', '.xlsx']}
        dropzoneClass={classes.dropzone}
        dropzoneText="File Upload"
        onChange={handleFileUpload}
      />
    </div>
  )
}

export default FileUpload
