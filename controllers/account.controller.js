const AccountService = require('../services/account.service')

exports.getMyRewards = async (req, res) => {
    const result = await AccountService.getMyRewards(req.user.email)
    if (result) {
        return res.json({
            message: 'Success',
            data:
                result?.length > 0
                    ? result.map(x => ({
                          ...x._doc,
                          currencyValue: x._doc?.currencyValue
                              ? x._doc.currencyValue.toString()
                              : null,
                      }))
                    : [],
        })
    }
    return res.status(400).json({ message: 'Failed to get my reward' })
}

exports.markSeenMyReward = async (req, res) => {
    const result = await AccountService.markSeenMyReward(
        req.user.email,
        req.body
    )
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed!' })
}
