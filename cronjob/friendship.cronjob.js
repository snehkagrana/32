const cron = require('node-cron')
const UserModel = require('../models/user')

cron.schedule('* * * * *', async function () {
    const today = new Date()
    const usersWithFollowers = await UserModel.find({
        'followers.0': { $exists: true },
    }).exec()

    const usersWithFollowing = await UserModel.find({
        'following.0': { $exists: true },
    }).exec()

    // sync followers
    if (usersWithFollowers?.length > 0) {
        usersWithFollowers.forEach(async (element, userIndex) => {
            let user = await UserModel.findOne({ _id: element._id })
            for (const f of user.followers) {
                const fUser = await UserModel.findOne({ _id: f.userId })
                if (fUser) {
                    let updatedFollowers = []
                    updatedFollowers.push({
                        userId: f.userId,
                        // prettier-ignore
                        displayName: fUser?.displayName ? fUser.displayName : fUser.username || '',
                        totalXp: fUser?.xp?.total ? fUser.xp.total : f.totalXp,
                        level: fUser?.xp?.level ? fUser.xp.level : f.level,
                        imgPath: fUser?.imgPath ? fUser.imgPath : '',
                        updatedAt: new Date(),
                        createdAt: f.createdAt,
                    })
                    if (updatedFollowers?.length > 0) {
                        await UserModel.updateOne(
                            { _id: element._id },
                            {
                                $set: {
                                    followers: updatedFollowers,
                                },
                            },
                            { new: true }
                        ).exec()
                    }
                }
            }
        })
    }

    // sync following
    if (usersWithFollowing?.length > 0) {
        usersWithFollowing.forEach(async (element, userIndex) => {
            let user = await UserModel.findOne({ _id: element._id })
            for (const f of user.following) {
                const fUser = await UserModel.findOne({ _id: f.userId })
                if (fUser) {
                    let updatedFollowing = []
                    updatedFollowing.push({
                        userId: f.userId,
                        // prettier-ignore
                        displayName: fUser?.displayName ? fUser.displayName : fUser.username || '',
                        totalXp: fUser?.xp?.total ? fUser.xp.total : f.totalXp,
                        level: fUser?.xp?.level ? fUser.xp.level : f.level,
                        imgPath: fUser?.imgPath ? fUser.imgPath : '',
                        updatedAt: new Date(),
                        createdAt: f.createdAt,
                    })
                    if (updatedFollowing?.length > 0) {
                        await UserModel.updateOne(
                            { _id: element._id },
                            {
                                $set: {
                                    following: updatedFollowing,
                                },
                            },
                            { new: true }
                        ).exec()
                    }
                }
            }
        })
    }
})
