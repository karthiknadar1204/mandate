'use client'

import React from 'react'
import { PaginatedTable } from './PaginatedTable'
import { ActionsTableRow } from './ActionsTableRow'

export function ActionsTable({ emails }) {
  // Define columns for actions table
  const actionsColumns = [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'from', label: 'From', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'studentAction', label: 'Student Action', sortable: false },
    { key: 'counsellorAction', label: 'Counsellor Action', sortable: false },
    { key: 'status', label: 'Status', sortable: false }
  ]

  const renderActionsRow = (email) => {
    return <ActionsTableRow email={email} />
  }

  return (
    <PaginatedTable
      data={emails}
      columns={actionsColumns}
      itemsPerPage={10}
      title="Action Items"
      searchable={true}
      exportable={true}
      renderRow={renderActionsRow}
      onExport={(data) => {
        // Export functionality can be implemented here
        console.log('Exporting actions data:', data)
      }}
    />
  )
} 