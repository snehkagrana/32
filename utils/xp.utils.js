const getLevelByXpPoints = (points) => {
    const levelThresholds = [
        0, 50, 100, 200, 350, 550, 800, 1100, 1450, 1850, 2300, 2800, 3350, 3950,
        4600, 5300, 6050, 6850, 7700, 8600, 9550, 10550, 11600, 12700, 13850, 15050,
        16300, 17600, 18950, 20350, 21800, 23300, 24850, 26450, 28100, 29800, 31550,
        33350, 35200, 37100, 39050,
    ];
    for (let i = levelThresholds.length - 1; i > 0; i--) {
        if (points >= levelThresholds[i]) {
            return i;
        }
    }
    return 0
};

module.exports = {
    getLevelByXpPoints,
};
