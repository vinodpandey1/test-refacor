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
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'
import DeleteIcon from "@material-ui/icons/Delete";
import { getMasterBusinessModels } from "../../redux/features/masterBusinessModelSlice";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const MasterBusinessModel: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('Master Business Model Listing')
  const config: Config = generateConfig(pageTitle)

  const dispatch = useDispatch<AppDispatch>()
  const [searchValues, setSearchValues] = useState<{ name: string; value: string }[]>([
    { name: 'MasterBusinessModels', value: '' },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOrganizationId, setSelectOrganizationId] = useState('')
  const masterBusinessModelsSlice = useSelector((state: any) => {
    console.log('state master business model', state);
    return state.masterBusinessModels
  })
  console.log('masterBusinessModelsSlice',masterBusinessModelsSlice)
  const data = masterBusinessModelsSlice?.masterBusinessModelsGettingState ? masterBusinessModelsSlice?.masterBusinessModelsGettingState : []
  const navigate = useNavigate()

  const addMasterBusinessModel = useCallback(
    (id: any) => () => {
      navigate(`/master-business-models/add?show=add`)
      console.log('create master business model');
    },
    []
  )

  useEffect(() => {
    dispatch(getMasterBusinessModels())
    console.log('get master business model');
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

  const editBusinessModel = (data: any, name: any) => {
    navigate(`/organizations/${data}/edit`, { state: { data } })
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
      Header: 'Name',
      accessor: 'name',
      aggregate: 'name',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
    },
    {
      Header: 'Payout Percentage',
      accessor: 'payout_percentage',
      aggregate: 'payout_percentage',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
    },
    {
      Header: 'Commission Percentage',
      accessor: 'commission_percentage',
      aggregate: 'commission_percentage',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
    },
    {
      id: 'action',
      disableSortBy: true,
      disableFilters: true,
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
        />
      </Page>
    </>
  )
}

export default MasterBusinessModel
