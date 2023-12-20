// prettier-ignore
const initializeDiamondUser = (currentDiamond, totalXp, diamondInitialized) => {
    let NEW_DIAMOND_VALUE = currentDiamond; // keep current user diamond

    const TARGET_XP = 2500
    const DIAMOND_AWARDED = 50

    if(!diamondInitialized) { 
        // user who not initialized diamond
        if (totalXp >= TARGET_XP) {
            NEW_DIAMOND_VALUE = Math.floor(totalXp / TARGET_XP) * DIAMOND_AWARDED
        }
    }
    return NEW_DIAMOND_VALUE
}

const calculateDiamondUser = (currentDiamond, currentXp, additionalXp) => {
    let NEW_DIAMOND_VALUE = currentDiamond // keep current user diamond

    const USER_TOTAL_XP = currentXp + additionalXp
    const TARGET_XP = 2500
    const DIAMOND_AWARDED = 50

    if (additionalXp && additionalXp > 0 && USER_TOTAL_XP > currentXp) {
        const PREVIOUS_XP_VALUE = Math.floor(currentXp / TARGET_XP) * TARGET_XP
        if (USER_TOTAL_XP >= PREVIOUS_XP_VALUE + TARGET_XP) {
            NEW_DIAMOND_VALUE = currentDiamond + DIAMOND_AWARDED
        }
    }

    return NEW_DIAMOND_VALUE
}

module.exports = {
    initializeDiamondUser,
    calculateDiamondUser,
}
