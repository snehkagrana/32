const getLevelByXpPoints = points => {
    const levelThresholds = [
        0, 50, 125, 275, 500, 800, 1175, 1625, 2150, 2750, 3425, 4175, 5000,
        5900, 6875, 7925, 9050, 10250, 11525, 12875, 14200, 15700, 17275, 18925,
        20650, 22450, 24325, 26275, 28300, 30400, 32575, 34825, 37150, 39550,
        42025, 44575, 47200, 49900, 52675, 55525, 58450, 61450, 64525,
    ]
    for (let i = levelThresholds.length - 1; i > 0; i--) {
        if (points >= levelThresholds[i]) {
            return i + 1
        }
    }

    return 1
}

module.exports = {
    getLevelByXpPoints,
}
