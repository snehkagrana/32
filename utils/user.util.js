const getFirstName = user => {
    if (!user?.firstName) {
        return user?.displayName || ''
    } else {
        return user?.firstName || ''
    }
}

const getFullName = user => {
    if (!user?.displayName) {
        return `${user?.firstName || ''} ${user.lastName || ''}`
    } else if (user?.displayName && !user?.firstName) {
        return user?.displayName || ''
    } else {
        return user?.displayName || ''
    }
}

module.exports = {
    getFirstName,
    getFullName,
}
