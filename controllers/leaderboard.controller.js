const LeaderBoardModel = require('../models/leaderboard')

exports.getCurrentLeaderBoard = async (req, res) => {
    const leaderBoard = await LeaderBoardModel.findOne({ isActive: true })

    if (leaderBoard) {
        return res.json({
            data: leaderBoard,
            message: 'Success.',
        })
    }

    return res.status(400).json({ message: 'Failed to get leaderboard' })
}
