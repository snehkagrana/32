const cron = require('node-cron')
const UserModel = require('../models/user')
const LeaderBoardModel = require('../models/leaderboard')
const {
    MAX_HEARTS,
    HEARTS_REFILL_RATE,
    MINIMUM_XP_LEADER_BOARD,
} = require('../constants/app.constant')
const dayjs = require('dayjs')

cron.schedule('*/1 * * * *', async function () {
    const today = new Date()

    // prettier-ignore
    const users = await UserModel.find({
        'xp.total': { $gt: MINIMUM_XP_LEADER_BOARD },
    }).limit(40).exec()

    if (users?.length > 0) {
        /**
         *   startDate: Date,
        endDate: Date,
        isActive: Boolean,
        users: [
        {
          userId: mongoose.Schema.Types.ObjectId,
          position: Number,
          displayName: String,
          xp: Number,
          email: String,
          imgPath: String,
        },
        ],
        */

        // prettier-ignore
        const orderedUsers = users.map(x => ({
          userId: x._doc._id,
          xp: x._doc.xp.total,
          displayName: x._doc.displayName ? x._doc.displayName : x._doc.username || '',
          email: x._doc.email,
          imgPath: x._doc.imgPath ?? null,
        }))
        .reverse((a, b) => !a - !b || a.totalXp - b.totalXp)

        LeaderBoardModel.create({
            isActive: true,
            startDate: new Date(),
            endDate: dayjs(new Date()).add(7, 'day').toISOString(),
            users: orderedUsers.map((x, index) => ({
                ...x,
                position: index + 1,
            })),
        })
    }

    // console.log('users->>', users?.length ?? null)
})
