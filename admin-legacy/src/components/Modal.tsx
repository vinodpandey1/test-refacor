import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';



const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
  };

interface ModalComponentProps {
  modalContent: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
}

const ModalComponent: React.FC<ModalComponentProps> = ({ modalContent, open, setOpen }) => {
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        hideBackdrop={true}
      >
        <Box sx={style}>
          <IconButton
            sx={{ position: 'absolute', top: 0, right: 0 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          {modalContent}
        </Box>
      </Modal>
    </div>
  )
}

export default ModalComponent
