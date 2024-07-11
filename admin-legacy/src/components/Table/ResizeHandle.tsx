import { ReactElement } from 'react'
import { ColumnInstance } from 'react-table'

import { useStyles } from './TableStyles'

export const ResizeHandle = <T extends Record<string, unknown>>({
  column,
}: {
  column: ColumnInstance<T>
}): ReactElement => {
  const { classes, cx } = useStyles()

  const isResizableColumn = column.Header !== 'ID' && column.id !== 'action'

  return (
    <div
      {...column.getResizerProps()}
      style={{ cursor: 'col-resize' }} // override the useResizeColumns default
      className={cx({
        [classes.resizeHandle]: isResizableColumn,
        handleActive: column.isResizing,
      })}
    />
  )
}
