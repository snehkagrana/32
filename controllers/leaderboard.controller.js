const dayjs = require('dayjs')
const LeaderBoardModel = require('../models/leaderboard')
const UserModel = require('../models/user')

exports.getLeaderBoardFriends = async (req, res) => {
    const authUserId = req.user._id
    const leaderBoard = await LeaderBoardModel.findOne({
        isActive: true,
    })
    const user = await UserModel.findOne({ _id: authUserId }).exec()

    if (leaderBoard && user) {
        let users = []

        for (const u of leaderBoard.users) {
            if (user.following.find(x => x.userId == u.userId)) {
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

    const prevLeaderBoard = await LeaderBoardModel.findOne({
        isActive: false,
        endDate: { $lt: currentLeaderBoard.startDate },
    })

    if (prevLeaderBoard) {
        // prettier-ignore
        const myRank = prevLeaderBoard.users?.find(x => x.userId == req.user._id) || null
        return res.json({
            data: {
                leaderBoardId: prevLeaderBoard._id,
                winner: {
                    1: prevLeaderBoard.users?.[0] || null,
                    2: prevLeaderBoard.users?.[1] || null,
                    3: prevLeaderBoard.users?.[2] || null,
                },
                myRank,
            },
            message: 'Success.',
        })
    }

    return res.status(400).json({ message: 'Failed to get result leaderboard' })
}

exports.markSeen = async (req, res) => {
    const authUserId = req.user._id
    const leaderBoardId = req.params.leaderBoardId
    const user = await UserModel.findOne({ _id: authUserId }).exec()

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
    }
    return res.status(400).json({ message: 'Failed to mark seen leaderboard' })
}
