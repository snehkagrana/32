const cron = require('node-cron')
const UserModel = require('../models/user')
const LeaderBoardModel = require('../models/leaderboard')
const {
    MINIMUM_WEEKLY_XP_LEADER_BOARD,
    MAX_WEEKLY_USERS_LEADER_BOARD,
} = require('../constants/app.constant')
const dayjs = require('dayjs')

cron.schedule('*/30 * * * * *', async function () {
    /**
     * NOTES
     * dayOfWeek 0 - Sunday
     * dayOfWeek 1 - Monday
     */
    const dayOfWeek = dayjs(new Date()).day()
    const hour = dayjs(new Date()).hour()
    const minute = dayjs(new Date()).minute()

    // prettier-ignore
    const currentActiveLeaderBoard = await LeaderBoardModel.findOne({ isActive: true }).exec()

    if (currentActiveLeaderBoard) {
        // Reset leaderboard
        if (dayOfWeek === 0 && hour === 23 && minute >= 50) {
            await LeaderBoardModel.updateOne(
                { _id: currentActiveLeaderBoard._id },
                { isActive: false, lastUpdate: new Date() },
                { new: true }
            )

            // also reset weekly xp users
            const users = await UserModel.find({
                'xp.weekly': { $gte: MINIMUM_WEEKLY_XP_LEADER_BOARD },
            }).exec()

            if (users.length > 0) {
                users.forEach(async user => {
                    // prettier-ignore
                    await UserModel.updateOne(
                        { email: user.email },
                        { $set: {
                            'xp.weekly': 0
                        }}
                    ).exec()
                })
            }
        } else {
            // sync leaderboard
            // prettier-ignore
            const users = await UserModel.find({ 'xp.weekly': { $gte: MINIMUM_WEEKLY_XP_LEADER_BOARD } }).limit(MAX_WEEKLY_USERS_LEADER_BOARD).exec()

            if (users?.length > 0) {
                // prettier-ignore
                let leaderBoardUsers = users.map(x => ({
                    userId: x._doc._id, 
                    displayName: x._doc.displayName ? x._doc.displayName : x._doc.username || '',
                    xp: x._doc.xp.weekly,
                    email: x._doc.email,
                    imgPath: x._doc.imgPath || null, 
                }));
                leaderBoardUsers.sort((a, b) => b.xp - a.xp)

                await LeaderBoardModel.updateOne(
                    { _id: currentActiveLeaderBoard._id },
                    {
                        lastUpdate: new Date(),
                        users: leaderBoardUsers.map((x, index) => ({
                            ...x,
                            position: index + 1,
                        })),
                    },
                    { new: true }
                )
                // console.log('LEADERBOARD SYNCED >>>>')
            }
        }
    } else {
        if (dayOfWeek === 1) {
            const endDate = dayjs(new Date())
                .add(6, 'day')
                .hour(23)
                .minute(53)
                .toISOString()

            // prettier-ignore
            const users = await UserModel.find({ 'xp.weekly': { $gte: MINIMUM_WEEKLY_XP_LEADER_BOARD } }).limit(MAX_WEEKLY_USERS_LEADER_BOARD).exec()

            if (users?.length > 0) {
                // prettier-ignore
                let leaderBoardUsers = users.map(x => ({
                    userId: x._doc._id, 
                    displayName: x._doc.displayName ? x._doc.displayName : x._doc.username || '',
                    xp: x._doc.xp.weekly,
                    email: x._doc.email,
                    imgPath: x._doc.imgPath || null,
                }));
                leaderBoardUsers.sort((a, b) => b.xp - a.xp)

                // Create this week leaderboard
                await LeaderBoardModel.create({
                    isActive: true,
                    startDate: new Date(),
                    endDate,
                    lastUpdate: new Date(),
                    users: leaderBoardUsers.map((x, index) => ({
                        ...x,
                        position: index + 1,
                    })),
                })
            }
        }
    }
})
