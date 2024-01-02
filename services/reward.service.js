const RewardModel = require('../models/reward')
const UserModel = require('../models/user')
const GuestModel = require('../models/guest')
const dayjs = require('dayjs')
const { mailTransporter } = require('../utils/mail.util')
const {
    sendEmailUserRedeemGiftCard,
    sendEmailGiftCardRunOut,
} = require('../email/send-email')
const { MAX_REDEEM_GIFT_CARD_PER_MONTH } = require('../constants/app.constant')

var ObjectId = require('mongoose').Types.ObjectId

exports.create = body => {
    return RewardModel.create(body)
}

exports.update = async body => {
    const { _id, ...rest } = body
    return await RewardModel.findOneAndUpdate({ _id: _id }, rest, { new: true })
}

exports.findAll = async filters => {
    return await RewardModel.find(filters)
}

exports.findById = async id => {
    return await RewardModel.findById(id)
}

exports.remove = async id => {
    return await RewardModel.deleteOne({ _id: id })
}

exports.giftReward = async (adminEmail, body) => {
    let reward = await RewardModel.findById(body.itemId)
    let userAdmin = await UserModel.findOne({ email: adminEmail })
    let user = await UserModel.findOne({ email: body.email })

    let result = null

    // check is reward code still exist
    // don't need to check user diamond
    const rewardVariantStillExists = reward.variants.find(
        x => x._id == body.variantId
    )

    if (user && userAdmin && rewardVariantStillExists?.isAvailable) {
        const getUpdateUserRewards = userRewards => {
            const newUserReward = {
                ...reward._doc,
                givenBy: {
                    userId: userAdmin._id,
                    displayName: userAdmin.displayName,
                    email: userAdmin.email,
                },
                rewardId: body.itemId,
                variantId: body.variantId,
                claimCode: reward._doc.variants.find(
                    x => x._id == body.variantId
                ).claimCode,
                pin: reward._doc.variants.find(x => x._id == body.variantId)
                    .pin,
                notes: body.notes,
                isRedeemed: false,
                hasSeen: false,
                redeemedAt: null,
            }
            if (userRewards.length > 0) {
                return [...userRewards, newUserReward]
            } else {
                return [newUserReward]
            }
        }

        const getUpdateVariantsValue = _variants => {
            return _variants.map(x => {
                if (x._id == body.variantId) {
                    return {
                        ...x._doc,
                        isAvailable: false,
                        redeemedBy: {
                            userId: user?._id,
                            displayName: user.displayName ?? '',
                            email: user.email,
                        },
                    }
                } else {
                    return x._doc
                }
            })
        }

        // delete given code from reward variants
        reward = await RewardModel.findByIdAndUpdate(body.itemId, {
            $set: {
                variants: getUpdateVariantsValue(reward.variants),
            },
        }).exec()

        // update user rewards
        user = await UserModel.findOneAndUpdate(
            { email: body.email },
            {
                // NOTES! don'ts decrement diamond user
                $set: {
                    rewards: getUpdateUserRewards(user?.rewards ?? []),
                },
            },
            { new: true }
        ).exec()

        result = user.rewards.find(
            x => x.rewardId == body.itemId && x.variantId == body.variantId
        )
    } else {
        result = null
    }

    return result
}

exports.upload = async (file, id) => {
    RewardModel.findById(id, async (err, doc) => {
        if (err) {
            console.log('ERROR', err)
        } else {
            if (file && file.location) {
                const res = await RewardModel.updateOne(
                    { _id: id },
                    { $set: { imageURL: file.location } }
                )
            } else {
                return res.json({
                    imageUrl: doc.imageUrl,
                })
            }
        }
        res.json({
            imageUrl: req.file.location, // URL of the uploaded file in S3
        })
    })
}

exports.redeem = async (email, body) => {
    const today = new Date()
    let reward = await RewardModel.findById(body.itemId)
    let user = await UserModel.findOne({ email })
    let result = null

    const rewardVariantStillExists = reward.variants.find(
        x => x._id == body.variantId
    )

    const remainingGiftCard = reward.variants.filter(
        x => x._id != body.variantId && x.isAvailable
    )

    // check limitation
    const isLimitRedeem = () => {
        const previousRewards = user.rewards.filter(x => {
            // prettier-ignore
            if(x?.redeemedAt && dayjs(x.redeemedAt).isSame(dayjs(today).toISOString(), 'month')) {
                return true
            }
        })
        return previousRewards.length >= MAX_REDEEM_GIFT_CARD_PER_MONTH
    }

    // variant reward still exist & user diamond greater than diamond value can be to redeem
    if (
        rewardVariantStillExists?.isAvailable &&
        user.diamond >= reward.diamondValue &&
        !isLimitRedeem()
    ) {
        const getUpdateUserRewards = userRewards => {
            const newUserReward = {
                ...reward._doc,
                rewardId: body.itemId,
                variantId: body.variantId,
                claimCode: reward._doc.variants.find(
                    x => x._id == body.variantId
                ).claimCode,
                pin: reward._doc.variants.find(x => x._id == body.variantId)
                    .pin,
                notes: body.notes,
                isRedeemed: true,
                hasSeen: true,
                redeemedAt: new Date().toISOString(),
            }
            if (userRewards.length > 0) {
                return [...userRewards, newUserReward]
            } else {
                return [newUserReward]
            }
        }

        const getUpdateVariantsValue = _variants => {
            return _variants.map(x => {
                if (x._id == body.variantId) {
                    return {
                        ...x._doc,
                        isAvailable: false,
                        redeemedBy: {
                            userId: user?._id,
                            displayName: user?.displayName
                                ? user.displayName
                                : user.username ?? '',
                            email: user.email,
                        },
                    }
                } else {
                    return x._doc
                }
            })
        }

        reward = await RewardModel.findByIdAndUpdate(body.itemId, {
            $set: {
                // update variants
                variants: getUpdateVariantsValue(reward.variants),
            },
        }).exec()

        user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    diamond: user.diamond - reward._doc.diamondValue,
                    rewards: getUpdateUserRewards(user?.rewards ?? []),
                },
            },
            { new: true }
        ).exec()

        /**
         * Send email notification to admin
         */
        await sendEmailUserRedeemGiftCard({
            to: [process.env.CONTACT_EMAIL_1, process.env.CONTACT_EMAIL_2],
            from: process.env.MAIL,
            name: user.displayName || user.email,
            giftCardName: reward.name,
            code: rewardVariantStillExists.claimCode,
            pin: rewardVariantStillExists.pin,
            time: dayjs(new Date()).format('DD MMM, YYYY, HH:mm'),
        })

        /**
         * Send email notification gift card run out
         */
        if (remainingGiftCard.length === 0) {
            await sendEmailGiftCardRunOut({
                to: [process.env.CONTACT_EMAIL_1, process.env.CONTACT_EMAIL_2],
                from: process.env.MAIL,
                name: reward.name,
            })
        }

        result = user.rewards.find(
            x => x.rewardId == body.itemId && x.variantId == body.variantId
        )
    } else {
        result = null
    }

    return result
}

exports.claimReward = async ({ user: userParams, type }) => {
    let DIAMOND_AWARDED = 0

    let user = await UserModel.findById(userParams._id).exec()
    let guest = await GuestModel.findById(userParams._id).exec()

    const today = new Date().toISOString()

    let result = null

    if (type == 'daily quest') {
        DIAMOND_AWARDED = 1

        if (user) {
            // check claimed gems from daily quest
            // prettier-ignore
            if (!user.lastClaimedGemsDailyQuest || (user.lastClaimedGemsDailyQuest && dayjs(user.lastClaimedGemsDailyQuest).isBefore(dayjs(today).toISOString(), 'day'))) {
                user = await UserModel.findOneAndUpdate(
                    { email },
                    {
                        $set: {
                            lastClaimedGemsDailyQuest: new Date(),
                            diamond: user.diamond + DIAMOND_AWARDED,
                        },
                    },
                    { new: true }
                ).exec()
                result = {
                    value: DIAMOND_AWARDED,
                }
            }
        } else if (guest && userParams.email === 'GUEST') {
            // prettier-ignore
            if (!guest.lastClaimedGemsDailyQuest || (guest.lastClaimedGemsDailyQuest && dayjs(guest.lastClaimedGemsDailyQuest).isBefore(dayjs(today).toISOString(), 'day'))) {
                guest = await GuestModel.findOneAndUpdate(
                    { _id: guest._id },
                    {
                        $set: {
                            lastClaimedGemsDailyQuest: new Date(),
                            diamond: guest.diamond + DIAMOND_AWARDED,
                        },
                    },
                    { new: true }
                ).exec()
                result = {
                    value: DIAMOND_AWARDED,
                }
            }
        }
    }
    // other type
    else {
    }

    return result
}
