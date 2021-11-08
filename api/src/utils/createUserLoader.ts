import Dataloader from 'dataloader'
import { User } from '../entities/User'

// Essentially grabs all users in one sql query
export const createUserLoader = () => new Dataloader<number, User>(async userIds => {
    const users = await User.findByIds(userIds as number[])
    const userIdToUser: Record<number, User> = {}
    users.forEach(u => {
        userIdToUser[u.id] = u
    })

    return userIds.map((userId) => userIdToUser[userId])
})