const getDiamondUser = (currentDiamond, totalXp) => {
    const TARGET_XP = 2500
    const DIAMOND_AWARDED = 50

    if (totalXp >= TARGET_XP) {
        return currentDiamond + DIAMOND_AWARDED
    } else {
        return currentDiamond
    }
}

module.exports = {
    getDiamondUser,
}
