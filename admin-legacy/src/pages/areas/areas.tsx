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
import { getAreas, deleteArea } from '../../redux/features/areasSlice'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'
import DeleteIcon from "@material-ui/icons/Delete";

const Areas: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('Areas Listing')
  const config: Config = generateConfig(pageTitle)

  const dispatch = useDispatch<AppDispatch>()
  const [searchValues, setSearchValues] = useState<{ name: string; value: string }[]>([
    { name: 'Areas', value: '' },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOrganizationId, setSelectOrganizationId] = useState('')
  const areaSlice = useSelector((state: any) => {
    console.log('state area', state);
    return state.area
  })
  console.log('areaSlice',areaSlice)
  const data = areaSlice?.areasGettingState ? areaSlice?.areasGettingState : []
  const navigate = useNavigate()
  const addArea = useCallback(
    (id: any) => () => {
      navigate(`/areas/${id}/?show=add`)
    },
    []
  )

  useEffect(() => {
    localStorage.removeItem('organizationId')
    dispatch(getAreas())
    console.log('get areas');
  }, [])

  // Debounce delay in milliseconds
  const DEBOUNCE_DELAY = 500

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

  function handleDelete(id: number) {
    console.log('area id', id);
    dispatch(deleteArea(id))
  }

  const columns = [
    {
      accessor: `id`,
      aggregate: 'id',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Header: 'id'.toUpperCase(),
    },
    {
      Header: 'Area Name',
      accessor: 'name',
      aggregate: 'name',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
    },
    {
      id: 'action',
      disableSortBy: true,
      disableFilters: true,
      Cell: (row: any) => (
          <Box sx={{ position: 'relative' }}>
            <Tooltip title="Delete">
              <DeleteIcon
                  onClick={() => {
                    // Add your delete logic here, e.g., dispatching a delete action
                    handleDelete(row?.row?.original?.id);
                  }}
                  style={{ color: 'red' }}
              />
            </Tooltip>
          </Box>
      ),
    },
  ] as any[]
  return (
    <>
      <Helmet>
        <title>{config.title}</title>
        {/* Add other meta tags or` configurations here if needed */}
      </Helmet>
      <ToastContainer />
      <BreadcrumbsComponent />
      <Page>
        <CssBaseline />
        <Table
          name={'testTable'}
          columns={columns}
          data={data}
          onAdd={() => addArea('add')}
          btnName={'Add Area'}
        />
      </Page>
    </>
  )
}

export default Areas
