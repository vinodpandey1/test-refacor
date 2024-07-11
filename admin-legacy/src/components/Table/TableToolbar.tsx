import AddIcon from '@mui/icons-material/Add'
import CachedIcon from '@mui/icons-material/Cached'
import CreateIcon from '@mui/icons-material/CreateOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import FilterListIcon from '@mui/icons-material/FilterList'
import ViewColumnsIcon from '@mui/icons-material/ViewColumn'
import { Button, IconButton, Theme, Toolbar, Tooltip, Paper } from '@mui/material'
import { MouseEvent, MouseEventHandler, PropsWithChildren, ReactElement, useCallback, useState } from 'react'
import type { TableInstance } from 'react-table'
import { makeStyles } from 'tss-react/mui'

import { ColumnHidePage } from './ColumnHidePage'
import { FilterPage } from './FilterPage'
import React from 'react'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import { Link } from '@material-ui/core'
import { styled } from '@mui/material/styles'

export interface TableMouseEventHandler<T extends Record<string, unknown>> {
  (instance: TableInstance<T>): MouseEventHandler
}

export const useStyles = makeStyles()((theme: Theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  toolbarinner: {
    display: 'flex',
  },
  leftButtons: {},
  rightButtons: {},
  leftIcons: {
    '&:first-of-type': {
      marginLeft: -12,
    },
  },
  rightIcons: {
    padding: 12,
    marginTop: '-6px',
    width: 48,
    height: 48,
    '&:last-of-type': {
      marginRight: -12,
    },
  },
}))

interface ActionButton<T extends Record<string, unknown>> {
  instance: TableInstance<T>
  icon?: JSX.Element
  onClick: TableMouseEventHandler<T>
  enabled?: (instance: TableInstance<T>) => boolean
  label: string | any
  variant?: 'right' | 'left'
}

export const LabeledActionButton = <T extends Record<string, unknown>>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true,
}: ActionButton<T>): ReactElement => (
  <Button variant="outlined" color="primary" onClick={onClick(instance)} disabled={!enabled(instance)}>
    {icon}
    &nbsp;
    {label}
  </Button>
)

export const SmallIconActionButton = <T extends Record<string, unknown>>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true,
  variant,
}: ActionButton<T>) => {
  const { classes, cx } = useStyles()
  return (
    <Tooltip title={label} aria-label={label}>
      <span>
        <IconButton
          className={cx({ [classes.rightIcons]: variant === 'right', [classes.leftIcons]: variant === 'left' })}
          onClick={onClick(instance)}
          disabled={!enabled(instance)}
          size="large"
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export interface Command<T extends Record<string, unknown>> {
  label: string
  onClick: TableMouseEventHandler<T>
  icon?: JSX.Element
  enabled: (instance: TableInstance<T>) => boolean
  type?: 'icon' | 'button'
}

interface TableToolbarProps<T extends Record<string, unknown>> {
  instance: TableInstance<T>
  onAdd?: TableMouseEventHandler<T>
  onDelete?: TableMouseEventHandler<T>
  onEdit?: TableMouseEventHandler<T>
  onRefresh?: MouseEventHandler
  extraCommands?: Command<T>[]
  btnName?: string
  onSearch?: () => void
  searchValues: any
  onSearchChange: (index: number) => (value: string) => void
  searchLabels: any
}

export function TableToolbar<T extends Record<string, unknown>>({
  instance,
  onAdd,
  onDelete,
  onEdit,
  extraCommands = [],
  onRefresh,
  btnName,
  onSearch,
  searchValues,
  onSearchChange,
  searchLabels,
  heading,
  spreadSheetUrl,
}: PropsWithChildren<TableToolbarProps<T>>): ReactElement | null {
  const { columns } = instance
  const { classes } = useStyles()
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const hideableColumns = columns.filter((column: any) => !(column.id === '_selector'))

  const handleColumnsClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget)
      setColumnsOpen(true)
    },
    [setAnchorEl, setColumnsOpen]
  )

  const handleFilterClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget)
      setFilterOpen(true)
    },
    [setAnchorEl, setFilterOpen]
  )

  function handleClose() {
    setColumnsOpen(false)
    setFilterOpen(false)
    setAnchorEl(undefined)
  }

  const handleSearch = () => {
    // Perform search based on searchValues
    onSearch()
  }

  const SpreadsheetLink = styled(Link)(({ theme }) => ({
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    textDecoration: 'none',
  }))

  // toolbar with add, edit, delete, filter/search column select.
  return (
    <Toolbar className={classes.toolbar}>
      <div className={classes.toolbarinner}>
        <div className={classes.rightButtons}>
          {onAdd && <h2>{heading || btnName.replace(/^\w+\s/, '')}</h2>}
          {onEdit && (
            <SmallIconActionButton<T>
              instance={instance}
              icon={<CreateIcon />}
              onClick={onEdit}
              label="Edit"
              enabled={({ state }: TableInstance<T>) => Object.keys(state.selectedRowIds).length === 1}
              variant="left"
            />
          )}
          {onDelete && (
            <SmallIconActionButton<T>
              instance={instance}
              icon={<DeleteIcon />}
              onClick={onDelete}
              label="Delete"
              enabled={({ state }: TableInstance<T>) => Object.keys(state.selectedRowIds).length > 0}
              variant="left"
            />
          )}

          {extraCommands.map((c) => {
            const { type = 'icon' } = c
            return type === 'icon' ? (
              <SmallIconActionButton<T>
                key={`command-${c.label}`}
                instance={instance}
                icon={c.icon}
                onClick={c.onClick}
                label={c.label}
                enabled={c.enabled}
                variant="left"
              />
            ) : (
              <LabeledActionButton<T>
                key={`command-${c.label}`}
                instance={instance}
                icon={c.icon}
                onClick={c.onClick}
                label={c.label}
                enabled={c.enabled}
              />
            )
          })}
        </div>
        {searchValues
          ? searchValues.map((search: any, index: any) => (
              <div key={`search-box-${index}`}>
                <Paper
                  component="form"
                  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, marginLeft: '20%' }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1, marginTop: '10px' }}
                    placeholder={`Search ${search.name}...`}
                    inputProps={{ 'aria-label': 'search' }}
                    value={search.value}
                    onChange={(event: any) => onSearchChange(index)(event.target.value)}
                  />
                </Paper>
              </div>
            ))
          : ''}
      </div>
      <div className={classes.rightButtons}>
        <ColumnHidePage<T> instance={instance} onClose={handleClose} show={columnsOpen} anchorEl={anchorEl} />
        <FilterPage<T> instance={instance} onClose={handleClose} show={filterOpen} anchorEl={anchorEl} />
        {onAdd && (
          <>
            {spreadSheetUrl ? (
              <SpreadsheetLink href={spreadSheetUrl} target="_blank" rel="noopener" style={{ marginRight: '15px' }}>
                Spread Sheet Url
              </SpreadsheetLink>
            ) : (
              ''
            )}
            <SmallIconActionButton<T>
              instance={instance}
              icon={<Button variant="contained">{btnName}</Button>}
              onClick={onAdd}
              label={btnName}
              enabled={({ state }: TableInstance<T>) => Object.keys(state.selectedRowIds).length === 0}
              variant="left"
            />
          </>
        )}
        {onRefresh && (
          <SmallIconActionButton<T>
            instance={instance}
            icon={<CachedIcon />}
            onClick={() => onRefresh}
            label="Refresh Table"
            variant="right"
          />
        )}
        {hideableColumns.length > 1 && (
          <SmallIconActionButton<T>
            instance={instance}
            icon={<ViewColumnsIcon />}
            onClick={() => handleColumnsClick}
            label="Show / hide columns"
            variant="right"
          />
        )}
      </div>
    </Toolbar>
  )
}
