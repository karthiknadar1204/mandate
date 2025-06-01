'use server'

import { db } from '@/configs/db'
import { usersTable } from '@/configs/schema'
import { eq } from 'drizzle-orm'

export async function createOrUpdateUser(userData) {
  try {
    // Check if user already exists
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, userData.email)
    })

    if (existingUser) {
      // Update existing user
      const [updatedUser] = await db
        .update(usersTable)
        .set({
          name: userData.name,
          image: userData.image,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          provider: userData.provider,
          updatedAt: new Date()
        })
        .where(eq(usersTable.email, userData.email))
        .returning()

      return { success: true, user: updatedUser }
    }

    // Create new user
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: userData.name,
        email: userData.email,
        image: userData.image,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
        provider: userData.provider,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    return { success: true, user: newUser }
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return { success: false, error: 'Failed to create/update user' }
  }
} 