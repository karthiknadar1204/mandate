'use client'

import React from 'react'
import { Calendar, Mail, CheckCircle2, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ActionsTableRow({ email }) {
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
            <p className="font-medium text-gray-900 text-sm">{email.subject}</p>
            <p className="text-xs text-gray-500">To: {email.userName}</p>
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
          <Calendar className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-gray-900">
            {new Date(email.date).toLocaleDateString()}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge 
          variant={email.isStudentAction ? 'default' : 'secondary'} 
          className={`text-xs ${email.isStudentAction ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
        >
          {email.isStudentAction ? 'Yes' : 'No'}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <Badge 
          variant={email.isCounsellorAction ? 'default' : 'secondary'} 
          className={`text-xs ${email.isCounsellorAction ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}
        >
          {email.isCounsellorAction ? 'Yes' : 'No'}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {email.isDone ? (
            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Done
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      </td>
    </>
  )
} 