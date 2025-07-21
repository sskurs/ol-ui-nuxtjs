import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: true
      }
    })
    
    return {
      success: true,
      data: users
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
})