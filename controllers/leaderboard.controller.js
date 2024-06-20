const dayjs = require('dayjs')
const LeaderBoardModel = require('../models/leaderboard')
const UserModel = require('../models/user')
const {
    MINIMUM_WEEKLY_XP_LEADER_BOARD,
    MAX_WEEKLY_USERS_LEADER_BOARD,
} = require('../constants/app.constant')

exports.getLeaderBoardFriends = async (req, res) => {
    const authUserId = req.user._id
    const leaderBoard = await LeaderBoardModel.findOne({
        isActive: true,
    })
    const user = await UserModel.findOne({ _id: authUserId }).exec()

    if (leaderBoard && user) {
        let users = []

        for (const u of leaderBoard.users) {
            if (
                user.following.find(x => x.userId == u.userId) ||
                String(user._id) == u.userId
            ) {
                users.push(u)
            }
        }

        return res.json({
            data: {
                ...leaderBoard._doc,
                users: users,
            },
            message: 'Success.',
        })
    }

    return res.status(400).json({ message: 'Failed to get fiends leaderboard' })
}

exports.getCurrentLeaderBoard = async (req, res) => {
    const leaderBoard = await LeaderBoardModel.findOne({
        isActive: true,
    })

    if (leaderBoard) {
        return res.json({
            data: leaderBoard,
            message: 'Success.',
        })
    }

    return res.status(400).json({ message: 'Failed to get leaderboard' })
}

exports.getResultLeaderBoard = async (req, res) => {
    const currentLeaderBoard = await LeaderBoardModel.findOne({
        isActive: true,
    })

    const prevLeaderBoards = await LeaderBoardModel.find({
        isActive: false,
        startDate: { $lt: currentLeaderBoard.startDate },
    })

    if (prevLeaderBoards?.length > 0) {
        // prettier-ignore
        const lastPrevLeaderBoard = prevLeaderBoards?.[prevLeaderBoards.length - 1];

        // prettier-ignore
        const myRank = lastPrevLeaderBoard?.users?.find(x => x.userId == req.user._id) || null

        if (lastPrevLeaderBoard) {
            return res.json({
                data: {
                    leaderBoardId: lastPrevLeaderBoard._id,
                    winner: {
                        1: lastPrevLeaderBoard.users?.[0] || null,
                        2: lastPrevLeaderBoard.users?.[1] || null,
                        3: lastPrevLeaderBoard.users?.[2] || null,
                    },
                    myRank,
                },
                message: 'Success.',
            })
        } else {
            return res
                .status(400)
                .json({ message: 'Failed to get result leaderboard' })
        }
    }

    return res.status(400).json({ message: 'Failed to get result leaderboard' })
}

exports.markSeen = async (req, res) => {
    const authUserId = req.user._id
    const leaderBoardId = req.params.leaderBoardId
    const user = await UserModel.findOne({ _id: authUserId }).exec()

    const leaderboard = await LeaderBoardModel.findOne({
        _id: leaderBoardId,
    })

    // prettier-ignore
    if (user && user.leaderBoards?.find(x => x.leaderBoardId == leaderBoardId)) {
        const newUserLeaderBoards = user.leaderBoards.map((x)=> ({
            ...x._doc,
            hasSeen: true
        }))
        await UserModel.updateOne(
            { _id: authUserId },
            {
                $set: {
                    leaderBoards: newUserLeaderBoards,
                },
            },
            { new: true }
        ).exec()

        return res.json({
            message: 'Success.',
        })
    } else {
        // create leaderboard result with no rank
        const userLeaderboardNoRank = {
            leaderBoardId: leaderBoardId,
            startDate: leaderboard.startDate,
            endDate: leaderboard.endDate,
            hasSeen: true,
            position: 0,
            xp: 0,
        }

        console.log("userLeaderboardNoRank",userLeaderboardNoRank)
        await UserModel.updateOne(
            { _id: authUserId },
            {
                $set: {
                    leaderBoards: [...user.leaderBoards, userLeaderboardNoRank],
                },
            }, 
            { new: true }
        ).exec()
        return res.json({
            message: 'Success.',
        })
    }
    return res.status(400).json({ message: 'Failed to mark seen leaderboard' })
}

exports.updateAndSyncWeeklyLeaderBoard = async (req, res) => {
    const now = new Date()

    const userId = req.user._id
    const xp = req.body?.xp || 0

    /**
     * NOTES
     */
    // prettier-ignore
    let activeLeaderBoard = await LeaderBoardModel.findOne({ isActive: true }).exec()
    // console.log('activeLeaderBoard', activeLeaderBoard)

    if (activeLeaderBoard) {
        // sync leaderboard
        // prettier-ignore
        const users = await UserModel.find({ 'xp.weekly': { $gte: MINIMUM_WEEKLY_XP_LEADER_BOARD } }).limit(MAX_WEEKLY_USERS_LEADER_BOARD).exec()

        if (users?.length > 0) {
            // prettier-ignore
            let leaderBoardUsers = users.map(x => {
                // console.log("x._doc.xp.weekly + xp",x._doc.xp.weekly + xp)
                return {
                    userId: x._doc._id,
                    displayName: x._doc.firstName ? x._doc.firstName : x._doc.displayName || '',
                    // xp: String(x._doc._id) == userId ? x._doc.xp.weekly + xp : x._doc.xp.weekly || MINIMUM_WEEKLY_XP_LEADER_BOARD,
                    xp: x._doc.xp.weekly || MINIMUM_WEEKLY_XP_LEADER_BOARD,
                    email: x._doc.email,
                    imgPath: x._doc.imgPath || '',
                }
            });
            leaderBoardUsers.sort((a, b) => b.xp - a.xp)

            await LeaderBoardModel.updateOne(
                { _id: activeLeaderBoard._id },
                {
                    lastUpdate: now,
                    users: leaderBoardUsers.map((x, index) => ({
                        ...x,
                        position: index + 1,
                    })),
                }
            )

            return res.json({
                data: null,
                message: 'Success.',
            })
        }
    }
}
