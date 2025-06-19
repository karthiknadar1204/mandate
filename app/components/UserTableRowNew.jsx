'use client'

import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, User, Mail, FileText, Clock } from 'lucide-react'
import { updateEmailStatus } from '@/app/actions/email'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserTableRowNew({ email }) {
  const [isNotImportant, setIsNotImportant] = React.useState(email.isNotImportant || false)
  const [isStudent, setIsStudent] = React.useState(email.isStudentAction || false)
  const [isCounsellor, setIsCounsellor] = React.useState(email.isCounsellorAction || false)
  const [isDone, setIsDone] = React.useState(email.isDone || false)
  const [isUpdating, setIsUpdating] = React.useState(false)

  const handleStatusChange = async (field, value) => {
    setIsUpdating(true)
    try {
      let updates = {
        isNotImportant: field === 'isNotImportant' ? value : isNotImportant,
        isStudentAction: field === 'isStudent' ? value : isStudent,
        isCounsellorAction: field === 'isCounsellor' ? value : isCounsellor,
        isDone: field === 'isDone' ? value : isDone
      }

      // If marking as Not Important, uncheck and disable other checkboxes
      if (field === 'isNotImportant' && value) {
        updates = {
          ...updates,
          isStudentAction: false,
          isCounsellorAction: false,
          isDone: false
        }
        setIsStudent(false)
        setIsCounsellor(false)
        setIsDone(false)
      }
      
      const result = await updateEmailStatus(email.id, updates)
      if (result.success) {
        switch (field) {
          case 'isNotImportant':
            setIsNotImportant(value)
            break
          case 'isStudent':
            setIsStudent(value)
            break
          case 'isCounsellor':
            setIsCounsellor(value)
            break
          case 'isDone':
            setIsDone(value)
            break
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const showIsDone = isNotImportant || isStudent || isCounsellor

  return (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={email.userImage} alt={email.userName} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              {email.userName?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900 text-sm">{email.userName}</p>
            <p className="text-xs text-gray-500">{email.userEmail}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-gray-900 truncate max-w-[200px]" title={email.from}>
            {email.from}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-gray-900 truncate max-w-[250px]" title={email.subject}>
            {email.subject}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-gray-600 truncate max-w-[300px]" title={email.summary || 'No summary'}>
          {email.summary || 'No summary'}
        </p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-gray-900">
            {new Date(email.date).toLocaleDateString()}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {isNotImportant && (
            <Badge variant="destructive" className="text-xs">
              Not Important
            </Badge>
          )}
          {isStudent && (
            <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
              Student Action
            </Badge>
          )}
          {isCounsellor && (
            <Badge variant="default" className="text-xs bg-purple-100 text-purple-800">
              Counsellor Action
            </Badge>
          )}
          {isDone && (
            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
              Done
            </Badge>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-1">
            <Checkbox 
              id={`not-important-${email.id}`}
              checked={isNotImportant}
              onCheckedChange={(checked) => handleStatusChange('isNotImportant', checked)}
              disabled={isUpdating}
              className="h-3 w-3"
            />
            <label
              htmlFor={`not-important-${email.id}`}
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              NI
            </label>
          </div>
          <div className="flex items-center space-x-1">
            <Checkbox 
              id={`student-${email.id}`}
              checked={isStudent}
              onCheckedChange={(checked) => handleStatusChange('isStudent', checked)}
              disabled={isUpdating || isNotImportant}
              className="h-3 w-3"
            />
            <label
              htmlFor={`student-${email.id}`}
              className={`text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isNotImportant ? 'opacity-50' : ''}`}
            >
              S
            </label>
          </div>
          <div className="flex items-center space-x-1">
            <Checkbox 
              id={`counsellor-${email.id}`}
              checked={isCounsellor}
              onCheckedChange={(checked) => handleStatusChange('isCounsellor', checked)}
              disabled={isUpdating || isNotImportant}
              className="h-3 w-3"
            />
            <label
              htmlFor={`counsellor-${email.id}`}
              className={`text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isNotImportant ? 'opacity-50' : ''}`}
            >
              C
            </label>
          </div>
          {showIsDone && (
            <div className="flex items-center space-x-1">
              <Checkbox 
                id={`done-${email.id}`}
                checked={isDone}
                onCheckedChange={(checked) => handleStatusChange('isDone', checked)}
                disabled={isUpdating || isNotImportant}
                className="h-3 w-3"
              />
              <label
                htmlFor={`done-${email.id}`}
                className={`text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isNotImportant ? 'opacity-50' : ''}`}
              >
                D
              </label>
            </div>
          )}
        </div>
      </td>
    </>
  )
} 