const cron = require('node-cron')
const UserModel = require('../models/user')

const runCronjob = userList => {
    console.log('Run-->>')
}

cron.schedule('* * * * *', async function () {
    console.log('CRONJOB RUN->>')
    // const user = await UserModel.find({
    //     lastHeartAccruedAt: { $exists: true },
    // }).exec()
    // console.log('USER', user)
    // runCronjob()
})
