import { ReactNode } from 'react'
import styles from './Table.module.css'

export interface Column<T> {
  /** Unique key for the column */
  key: string
  /** Header label */
  header: string
  /** Function to render cell content */
  render: (row: T) => ReactNode
  /** Optional width */
  width?: string
}

export interface TableProps<T> {
  /** Column definitions */
  columns: Column<T>[]
  /** Data rows */
  data: T[]
  /** Function to get unique key for each row */
  rowKey: (row: T) => string
  /** Optional class name */
  className?: string
}

export function Table<T>({
  columns,
  data,
  rowKey,
  className,
}: TableProps<T>) {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
