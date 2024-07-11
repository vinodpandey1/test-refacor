import { CssBaseline } from '@mui/material'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { CellProps } from 'react-table'

import { Page } from '../../components/Page'
import { Table } from '../../components/Table'
import Tooltip from '@material-ui/core/Tooltip'
import EditIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUsers, deleteUser } from '../../redux/features/usersSlice'
import { useDispatch, useSelector } from 'react-redux'
import { UserI } from '../../interfaces/userInterface'
import { AppDispatch } from '@/redux/store'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Box, Button } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'

const User: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('User Listing')
  const config: Config = generateConfig(pageTitle)
  const dispatch = useDispatch<AppDispatch>()
  const userList = useSelector((state: any) => state.users)
  const data = userList?.userState ? userList?.userState : []
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')

  const navigate = useNavigate()
  const addUser = useCallback(
    (id: any) => () => {
      navigate(`/users/${id}/?show=add`)
    },
    []
  )

  useEffect(() => {
    sessionStorage.removeItem('userId')
    localStorage.removeItem('roleId')
    dispatch(getUsers())
  }, [])

  const handleDeleteUser = (id: any) => {
    dispatch(deleteUser(id))
  }

  const handleToggleModal = (userId: string) => {
    setSelectedUserId((prevUserId: any) => (prevUserId === userId ? '' : userId))
    setIsOpen((prevOpen: any) => !prevOpen)
  }

  const editUser = (data: any, name: any) => {
    navigate(`/users/${data}?show=${name}`, { state: { data } })
  }

  const modalRef = useRef<HTMLDivElement>(null)

  const handleCloseModal = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false)
      setSelectedUserId('')
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleCloseModal)
    return () => {
      document.removeEventListener('mousedown', handleCloseModal)
    }
  }, [])

  const handleUserDetails = (id: any) => {
    navigate(`/users/${id}/details`, { state: { id } })
  }

  const columns = [
    {
      accessor: `id`,
      aggregate: 'id',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Header: 'id'.toUpperCase(),
      Cell: ({ value }: { value: any }) => (value !== null && value !== undefined ? value : 'N/A'),
    },
    {
      Header: 'Name',
      accessor: 'User.name',
      aggregate: 'User.name',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Cell: (row: any) => (
        <span
          style={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}
          onClick={() => handleUserDetails(row.row.original.id)}
        >
          {row.row.original.User.name}
        </span>
      ),
    },
    {
      Header: 'Email',
      accessor: 'User.email',
      aggregate: 'User.email',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Cell: ({ value }: { value: any }) => (value !== null && value !== undefined ? value : 'N/A'),
    },
    {
      Header: 'Mobile Number',
      accessor: 'User.mobile',
      aggregate: 'User.mobile',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Cell: ({ value }: { value: any }) => (value !== null && value !== undefined ? value : 'N/A'),
    },
    {
      Header: 'Role',
      accessor: 'Role.name',
      aggregate: 'Role.name',
      Aggregated: ({ value }: { value: any }) => (value !== null && value !== undefined ? value : 'N/A'),
      Cell: ({ value }: { value: any }) => (value !== null && value !== undefined ? value : 'N/A'),
    },

    // {
    //   accessor: 'onboardingStep',
    //   aggregate: 'onboardingStep',
    //   Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
    // },
    {
      id: 'action',
      disableSortBy: true,
      disableFilters: true,
      Cell: (row: any) => (
        <Box sx={{ position: 'relative' }}>
          <Tooltip title="edit">
            <MoreHorizIcon
              onClick={() => {
                handleToggleModal(row?.row?.original?.id)
              }}
            />
          </Tooltip>
          {isOpen && selectedUserId === row?.row?.original?.id && (
            <Box
              ref={modalRef}
              sx={{
                position: 'absolute',
                top: 0,
                left: '100%',
                transform: 'translateX(8px)',
                width: 200,
                height: 50,
                bgcolor: 'background.paper',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                p: 1,
                borderRadius: 4,
                zIndex: 1,
              }}
            >
              <Button
                variant="text"
                startIcon={<EditIcon />}
                onClick={() => editUser(row?.row?.original?.id, 'basic')}
                sx={{ mb: 1 }}
              >
                Edit
              </Button>
            </Box>
          )}
        </Box>
      ),
    },
  ]

  return (
    <>
      <Helmet>
        <title>{config.title}</title>
        {/* Add other meta tags or configurations here if needed */}
      </Helmet>
      <ToastContainer />
      <BreadcrumbsComponent />
      <Page>
        <CssBaseline />
        <Table
          name={'testTable'}
          columns={columns}
          data={data}
          onAdd={() => addUser('add')}
          btnName={'Add User'}
          heading={`Users`}
          // spreadSheetUrl="https://docs.google.com/spreadsheets/d/1krvfPKM_E_o4PdNxvDQd-A7BgSASLcV7gpuC_JiZEbs/edit#gid=0"
        />
      </Page>
    </>
  )
}

export default User
