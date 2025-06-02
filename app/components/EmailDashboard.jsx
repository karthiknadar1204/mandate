'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Mail, User, Calendar, FileText, UserCircle, MessageSquare, FileText as FileTextIcon } from "lucide-react";
import { db } from '@/configs/db';
import { emails } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { updateEmailStatus } from '@/app/actions/email';

export function EmailDashboard({ emails: initialEmails }) {
  const [expandedEmails, setExpandedEmails] = useState({});
  const [emails, setEmails] = useState(initialEmails);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setEmails(initialEmails);
  }, [initialEmails]);

  const toggleEmail = (emailId) => {
    setExpandedEmails(prev => ({
      ...prev,
      [emailId]: !prev[emailId]
    }));
  };

  const handleStatusChange = (emailId, field, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [emailId]: {
        ...prev[emailId],
        [field]: value
      }
    }));
  };

  const handleConfirmChanges = async (emailId) => {
    try {
      setIsUpdating(true);
      console.log("Confirming changes for email:", emailId);
      
      const changes = pendingChanges[emailId];
      if (!changes) return;

      const result = await updateEmailStatus(emailId, changes);
      
      if (result.success) {
        // Update local state with the returned email data
        setEmails(prev => prev.map(email => 
          email.id === emailId 
            ? { ...email, ...result.email }
            : email
        ));

        // Clear pending changes for this email
        setPendingChanges(prev => {
          const newPending = { ...prev };
          delete newPending[emailId];
          return newPending;
        });
      } else {
        console.error('Failed to update email:', result.error);
      }
    } catch (error) {
      console.error('Error updating email status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasPendingChanges = (emailId) => {
    return pendingChanges[emailId] && Object.keys(pendingChanges[emailId]).length > 0;
  };

  const formatEmailContent = (content) => {
    if (!content) return 'No content available';
    
    // Remove HTML tags and decode HTML entities
    let formattedContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
      .trim();

    // Split content into paragraphs
    const paragraphs = formattedContent.split('\n\n');
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Email Dashboard</h1>
      
      <div className="space-y-4">
        {emails.map((email) => (
          <Card key={email.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex-shrink-0">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(email.from)}`} />
                    <AvatarFallback>{email.from.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Subject and Receiver Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{email.subject}</h3>
                      <span className="text-sm text-gray-500">
                        {format(new Date(email.date), 'PPP p')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                      <span className="text-base text-gray-600">Receiver: {email.userName}</span>
                    </div>
                  </div>

                  {/* Email Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">From: {email.from}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">To: {email.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Date: {format(new Date(email.date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Status: {email.status}</span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Actions</h4>
                      {hasPendingChanges(email.id) && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirmChanges(email.id)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Updating...' : 'Confirm Changes'}
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`not-important-${email.id}`}
                          checked={pendingChanges[email.id]?.isNotImportant ?? email.isNotImportant}
                          onCheckedChange={(checked) => handleStatusChange(email.id, 'isNotImportant', checked)}
                          disabled={isUpdating}
                        />
                        <label
                          htmlFor={`not-important-${email.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Not Important
                        </label>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`student-${email.id}`}
                            checked={pendingChanges[email.id]?.isStudentAction ?? email.isStudentAction}
                            onCheckedChange={(checked) => handleStatusChange(email.id, 'isStudentAction', checked)}
                            disabled={isUpdating}
                          />
                          <label
                            htmlFor={`student-${email.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Student
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`counsellor-${email.id}`}
                            checked={pendingChanges[email.id]?.isCounsellorAction ?? email.isCounsellorAction}
                            onCheckedChange={(checked) => handleStatusChange(email.id, 'isCounsellorAction', checked)}
                            disabled={isUpdating}
                          />
                          <label
                            htmlFor={`counsellor-${email.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Counsellor
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-5 w-5 text-gray-500" />
                      <h4 className="text-lg font-semibold text-gray-700">Summary</h4>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed whitespace-pre-wrap">{email.summary}</p>
                  </div>

                  {/* Full Content Toggle */}
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 mb-4"
                    onClick={() => toggleEmail(email.id)}
                  >
                    {expandedEmails[email.id] ? 'Hide Full Content' : 'Show Full Content'}
                    {expandedEmails[email.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  
                  {expandedEmails[email.id] && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileTextIcon className="h-5 w-5 text-gray-500" />
                          <h4 className="text-lg font-semibold text-gray-700">Original Email Content</h4>
                        </div>
                      </div>
                      <ScrollArea className="h-[400px]">
                        <div className="p-6">
                          <div className="prose prose-sm max-w-none">
                            {formatEmailContent(email.content)}
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 