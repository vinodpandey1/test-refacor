import { Button, CssBaseline, Box } from '@mui/material'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { CellProps } from 'react-table'

import { Page } from '../../components/Page'
import { Table } from '../../components/Table'
import Tooltip from '@material-ui/core/Tooltip'
import EditIcon from '@material-ui/icons/Create'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { UserI } from '../../interfaces/userInterface'
import { AppDispatch } from '@/redux/store'
import { getOrganization } from '../../redux/features/organizationSlice'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'

const Organizations: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('Organization Listing')
  const config: Config = generateConfig(pageTitle)

  const dispatch = useDispatch<AppDispatch>()
  const [searchValues, setSearchValues] = useState<{ name: string; value: string }[]>([
    { name: 'Organization', value: '' },
    { name: 'Owner', value: '' },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOrganizationId, setSelectOrganizationId] = useState('')
  const organizationList = useSelector((state: any) => state.organization)
  console.log('organizationList',organizationList)
  const data = organizationList?.organizationGettingState ? organizationList?.organizationGettingState : []
  const navigate = useNavigate()
  const addOrganizations = useCallback(
    (id: any) => () => {
      navigate(`/organizations/${id}/?show=add`)
    },
    []
  )

  const editOrganization = (data: any, name: any) => {
    navigate(`/organizations/${data}/edit`, { state: { data } })
  }

  useEffect(() => {
    localStorage.removeItem('organizationId')
    dispatch(getOrganization())
  }, [])

  const handleOrganizationDetails = (id: any) => {
    navigate(`/organizations/${id}/details`, { state: { id } })
  }

  // Debounce delay in milliseconds
  const DEBOUNCE_DELAY = 500

  const handleSearchChange = (index: number) => (value: string) => {
    setSearchValues((prevValues) => {
      const updatedValues = [...prevValues]
      updatedValues[index].value = value
      return updatedValues
    })
  }

  const handleToggleModal = (userId: string) => {
    setSelectOrganizationId((prevUserId) => (prevUserId === userId ? '' : userId))
    setIsOpen((prevOpen) => !prevOpen)
  }

  // Debounced API call






  const modalRef = useRef<HTMLDivElement>(null)

  const handleCloseModal = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false)
      setSelectOrganizationId('')
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
      accessor: `id`,
      aggregate: 'id',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Header: 'id'.toUpperCase(),
    },
    {
      Header: 'Organization Name',
      accessor: 'name',
      aggregate: 'name',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Cell: (row: any) => (
        <span
          style={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}
          onClick={() => handleOrganizationDetails(row.row.original.id)} // Add your onClick method here
        >
          {row.row.original.name}
        </span>
      ),
    },
    {
      Header: 'Organization Type',
      accessor: 'BusinessPartnership.name',
      aggregate: 'BusinessPartnership.name',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
    },

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
          {isOpen && selectedOrganizationId === row?.row?.original?.id && (
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
                onClick={() => editOrganization(row?.row?.original?.id, 'basic')}
                sx={{ mb: 1 }}
              >
                Edit
              </Button>
            </Box>
          )}
        </Box>
      ),
    },
  ] as any[]
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
          onAdd={() => addOrganizations('add')}
          btnName={'Add Organization'}
          spreadSheetUrl="https://docs.google.com/spreadsheets/d/19895a0O3EgxNJ8gS2I3gHeqMoWqzkPh2wElFydMZNnQ/edit?usp=sharing"
        />
      </Page>
    </>
  )
}

export default Organizations
