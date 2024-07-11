import React from 'react';
import { IconButton, FormHelperText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ExcelUploaderProps {
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    file: File | null;
    errorMsg?: string;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = (props) => {
    const { setFile, file, errorMsg } = props;
    const isFile = file instanceof File;
    const error = !file;

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        const inputElement:any = document.querySelector('input[type="file"]');
        if (inputElement) {
            inputElement.value = ''; // Clear the input field value
        }
    };

    return (
        <div>
            <div className="drop-area">
                <input name="excelFile" type="file" accept=".xlsx, .xls" onChange={handleFileInputChange} />
            </div>
            {file && !isFile && (
                <div className="file-preview">
                    <div className="preview-item">
                        {/* Display a placeholder or message for Excel files */}
                        <p>Excel file selected</p>
                        <IconButton onClick={removeFile} aria-label="delete">
                            <DeleteIcon color="inherit" />
                        </IconButton>
                    </div>
                </div>
            )}
            {isFile && (
                <div className="file-preview">
                    <div className="preview-item">
                        {/* Display Excel file details or name */}
                        <p>{file.name}</p>
                        <IconButton onClick={removeFile} aria-label="delete">
                            <DeleteIcon color="inherit" />
                        </IconButton>
                    </div>
                </div>
            )}
            {error && <FormHelperText style={{ color: '#d32f2f' }}>{errorMsg}</FormHelperText>}
        </div>
    );
};

export default ExcelUploader;
