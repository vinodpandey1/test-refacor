import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, Button, CssBaseline, Tooltip } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { CellProps } from 'react-table'
import { Page } from '../../components/Page'
import { Table } from '../../components/Table'
import EditIcon from '@mui/icons-material/Create'
import { getRole, deleteRoles } from '../../redux/features/roleSlice'
import { RoleI } from '../../interfaces/roleInterface'
import { AppDispatch } from '@/redux/store'
import { Loader } from '../../components/Loader'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'

const Roles: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('Role Listing')
  const config: Config = generateConfig(pageTitle)
  const dispatch = useDispatch<AppDispatch>()
  const roleList = useSelector((state: any) => state?.role?.roleGettingState)
  const loader = useSelector((state: any) => state?.loader.loader)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')

  const data = roleList || []
  const navigate = useNavigate()
  const addRole = useCallback(
    (id: string) => () => {
      navigate(`/roles/${id}`)
    },
    [navigate]
  )

  const editRole = (name: string, id: string) => {
    navigate(`/roles/${name}`, { state: { id } })
  }

  useEffect(() => {
    dispatch(getRole())
  }, [dispatch])

  const handleDeleteRoles = (id: string) => {
    dispatch(deleteRoles(id))
  }

  const handleToggleModal = (userId: string) => {
    setSelectedUserId((prevUserId) => (prevUserId === userId ? '' : userId))
    setIsOpen((prevOpen) => !prevOpen)
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

  const columns = [
    {
      accessor: 'id',
      aggregate: 'id',
      Aggregated: ({ cell: { value } }: CellProps<RoleI>) => `${value}`,
      Header: 'ID'.toUpperCase(),
    },
    {
      Header: 'Role Name',
      accessor: 'name',
      aggregate: 'name',
      Aggregated: ({ cell: { value } }: CellProps<RoleI>) => `${value}`,
    },
    {
      Header: 'Role Type',
      accessor: 'type',
      aggregate: 'type',
      Aggregated: ({ cell: { value } }: CellProps<RoleI>) => `${value}`,
    },
    {
      Header: 'Description',
      accessor: 'description',
      aggregate: 'description',
      Aggregated: ({ value }: { value: any }) => (value !== null ? value : 'N/A'),
      Cell: ({ value }: { value: any }) => (value !== null ? value : 'N/A'),
    },
    {
      id: 'action',
      disableSortBy: true,
      disableFilters: true,
      Cell: ({ row }: CellProps<RoleI>) => (
        <Box sx={{ position: 'relative' }}>
          <Tooltip title="Action">
            <MoreHorizIcon onClick={() => handleToggleModal(row.original.id)} style={{ cursor: 'pointer' }} />
          </Tooltip>
          {isOpen && selectedUserId === row.original.id && (
            <Box
              ref={modalRef}
              sx={{
                position: 'absolute',
                top: 0,
                left: '100%',
                transform: 'translateX(8px)',
                width: 200,
                // height: 80,
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
                onClick={() => editRole('edit', row.original.id)}
                sx={{ mb: 1 }}
              >
                Edit
              </Button>
              {/* <Button
                variant="text"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteRoles(row.original.id)}
                sx={{ mb: 1 }}
              >
                Delete
              </Button> */}
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
      <BreadcrumbsComponent />
      <Loader loading={loader} />
      <ToastContainer />
      <Page>
        <CssBaseline />
        <Table name="testTable" columns={columns} data={data} onAdd={() => addRole('add')} btnName="Add Roles" />
      </Page>
    </>
  )
}

export default Roles
