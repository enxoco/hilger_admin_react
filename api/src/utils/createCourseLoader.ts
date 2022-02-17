import Dataloader from 'dataloader'
import { Course } from 'src/entities/Course'
import { User } from '../entities/User'

// Essentially grabs all users in one sql query
export const createCourseLoader = () => new Dataloader<number, User>(async userIds => {
    const users = await Course.findByIds(userIds as number[])
    const userIdToUser: Record<number, Course> = {}
    users.forEach(u => {
        userIdToUser[u.id] = u
    })

    return userIds.map((userId) => userIdToUser[userId])
})