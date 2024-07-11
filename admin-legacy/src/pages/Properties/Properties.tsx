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
import { getProperty, searchProperty } from '../../redux/features/propertySlice'
import { debounce } from 'lodash'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { ToastContainer } from 'react-toastify'
import BreadcrumbsComponent from '../../components/Breadcrums/Breadcrums'
import generateConfig, { Config } from '../../components/HelmetConfig'
import { Helmet } from 'react-helmet'

const Properties: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('Property Listing')
  const config: Config = generateConfig(pageTitle)

  const dispatch = useDispatch<AppDispatch>()
  const [searchValues, setSearchValues] = useState<{ name: string; value: string }[]>([
    { name: 'Property', value: '' },
    { name: 'Owner', value: '' },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPropertyId, setSelectPropertyId] = useState('')
  const propertyList = useSelector((state: any) => state.property)
  const data = propertyList?.propertyGettingState ? propertyList?.propertyGettingState : []
  const navigate = useNavigate()
  const addProperties = useCallback(
    (id: any) => () => {
      navigate(`/properties/${id}/?show=add`)
    },
    []
  )

  const editProperty = (data: any, name: any) => {
    navigate(`/properties/${data}?show=${name}`, { state: { data } })
  }

  useEffect(() => {
    localStorage.removeItem('propertyId')
    dispatch(getProperty())
  }, [])

  const handlePropertyDetails = (id: any) => {
    navigate(`/properties/${id}/details`, { state: { id } })
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
    setSelectPropertyId((prevUserId) => (prevUserId === userId ? '' : userId))
    setIsOpen((prevOpen) => !prevOpen)
  }

  // Debounced API call
  const debouncedSearch = useRef(
    debounce((propertyValue: string, ownerValue: string) => {
      const payload = {
        propertyValue: propertyValue || '',
        ownerValue: ownerValue || '',
      }

      if (propertyValue !== '' || ownerValue !== '') {
        dispatch(searchProperty(payload))
      } else {
        setSearchValues([
          { name: 'Property', value: '' },
          { name: 'Owner', value: '' },
        ])
        dispatch(getProperty())
      }
    }, DEBOUNCE_DELAY)
  ).current

  useEffect(() => {
    const propertyValue = searchValues.find((item) => item.name === 'Property')?.value || ''
    const ownerValue = searchValues.find((item) => item.name === 'Owner')?.value || ''

    if (propertyValue !== searchValuesRef.current.propertyValue || ownerValue !== searchValuesRef.current.ownerValue) {
      debouncedSearch(propertyValue, ownerValue)
      searchValuesRef.current.propertyValue = propertyValue
      searchValuesRef.current.ownerValue = ownerValue
    }

    // Cleanup the debounced function on unmount
    return () => debouncedSearch.cancel()
  }, [searchValues])

  const searchValuesRef = useRef<{ propertyValue: string; ownerValue: string }>({
    propertyValue: '',
    ownerValue: '',
  })

  const modalRef = useRef<HTMLDivElement>(null)

  const handleCloseModal = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false)
      setSelectPropertyId('')
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
      Header: 'Property Name',
      accessor: 'name',
      aggregate: 'name',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Cell: (row: any) => (
        <span
          style={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}
          onClick={() => handlePropertyDetails(row.row.original.id)} // Add your onClick method here
        >
          {row.row.original.name}
        </span>
      ),
    },
    {
      Header: 'Property Owner',
      accessor: (row: any) => {
        row?.PrimaryOwner ? row.PrimaryOwner?.User?.name : 'N/A'
        return row?.PrimaryOwner?.User?.name
      },
    },
    {
      accessor: `code`,
      aggregate: 'code',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Header: 'Property Code',
    },
    {
      Header: 'Sorting Order',
      accessor: 'property_order',
      Cell: ({ cell }: CellProps<UserI>) => {
        const value = cell.value || 'N/A'
        return <span>{value}</span>
      },
    },
    {
      Header: 'Slug',
      accessor: 'slug',
      Cell: ({ cell }: CellProps<UserI>) => {
        const value = cell.value || 'N/A'
        return <span>{value}</span>
      },
    },
    {
      Header: 'City',
      accessor: 'Address.city',
      Cell: ({ cell }: CellProps<UserI>) => {
        const value = cell.value || 'N/A'
        return <span>{value}</span>
      },
    },
    {
      Header: 'Area',
      accessor: 'Address.area',
      Cell: ({ cell }: CellProps<UserI>) => {
        const value = cell.value || 'N/A'
        return <span>{value}</span>
      },
    },
    {
      Header: 'Stage',
      accessor: 'LifecycleStage.name',
      aggregate: 'LifecycleStage.name',
      Aggregated: ({ cell: { value } }: CellProps<UserI>) => `${value}`,
      Cell: ({ cell }: CellProps<UserI>) => {
        const value = cell.value || 'N/A'
        return <span>{value}</span>
      },
    },
    {
      id: 'action',
      disableSortBy: true,
      disableFilters: true,
      Cell: (row: any) => (
        <Tooltip title="edit">
          <Button
            variant="text"
            startIcon={<EditIcon />}
            onClick={() => editProperty(row?.row?.original?.id, 'basic')}
            sx={{ mb: 1 }}
          ></Button>
        </Tooltip>
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
          onAdd={() => addProperties('add')}
          btnName={'Add Property'}
          spreadSheetUrl="https://docs.google.com/spreadsheets/d/19895a0O3EgxNJ8gS2I3gHeqMoWqzkPh2wElFydMZNnQ/edit?usp=sharing"
          searchValues={searchValues}
          onSearchChange={handleSearchChange}
          searchLabels={['Search by Property', 'Search by Owner Name']}
        />
      </Page>
    </>
  )
}

export default Properties
