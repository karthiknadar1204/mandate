'use client'

import React from 'react'
import { PaginatedTable } from './PaginatedTable'
import { UserTableRowNew } from './UserTableRowNew'
import { Calendar, Mail, FileText, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { updateEmailStatus } from '@/app/actions/email'

export function UserTable({ emails }) {
  // Define columns for user table
  const userColumns = [
    { key: 'user', label: 'User', sortable: true },
    { key: 'sender', label: 'Sender', sortable: true },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'summary', label: 'Summary', sortable: false },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ]

  const renderUserRow = (email) => {
    return <UserTableRowNew email={email} />
  }

  return (
    <PaginatedTable
      data={emails}
      columns={userColumns}
      itemsPerPage={15}
      title="Users & Emails Management"
      searchable={true}
      exportable={true}
      renderRow={renderUserRow}
      onExport={(data) => {
        // Export functionality can be implemented here
        console.log('Exporting data:', data)
      }}
    />
  )
} 