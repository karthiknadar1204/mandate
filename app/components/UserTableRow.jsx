'use client'

import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from 'lucide-react'
import { updateEmailStatus } from '@/app/actions/email'

export function UserTableRow({ email }) {
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
    <tr className="hover:bg-gray-50/50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {email.userImage && (
            <img className="h-10 w-10 rounded-full" src={email.userImage} alt="" />
          )}
          <div>
            <p className="font-medium text-gray-900">{email.userName}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-900">{email.userEmail}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-900">{email.from}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-900">{email.subject}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-gray-900">{email.summary || 'No summary'}</p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <p className="text-gray-900">
            {new Date(email.date).toLocaleDateString()}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`not-important-${email.id}`}
              checked={isNotImportant}
              onCheckedChange={(checked) => handleStatusChange('isNotImportant', checked)}
              disabled={isUpdating}
            />
            <label
              htmlFor={`not-important-${email.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Not Important
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`student-${email.id}`}
              checked={isStudent}
              onCheckedChange={(checked) => handleStatusChange('isStudent', checked)}
              disabled={isUpdating || isNotImportant}
            />
            <label
              htmlFor={`student-${email.id}`}
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isNotImportant ? 'opacity-50' : ''}`}
            >
              Student
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`counsellor-${email.id}`}
              checked={isCounsellor}
              onCheckedChange={(checked) => handleStatusChange('isCounsellor', checked)}
              disabled={isUpdating || isNotImportant}
            />
            <label
              htmlFor={`counsellor-${email.id}`}
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isNotImportant ? 'opacity-50' : ''}`}
            >
              Counsellor
            </label>
          </div>
          {showIsDone && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`done-${email.id}`}
                checked={isDone}
                onCheckedChange={(checked) => handleStatusChange('isDone', checked)}
                disabled={isUpdating || isNotImportant}
              />
              <label
                htmlFor={`done-${email.id}`}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isNotImportant ? 'opacity-50' : ''}`}
              >
                Done
              </label>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
} 