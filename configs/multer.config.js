const multer = require('multer')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET_KEY,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
})

const BUCKET = process.env.BUCKET
const s3 = new aws.S3()

exports.multerUpload = multer({
    storage: multerS3({
        bucket: BUCKET,
        s3: s3,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `image-${Date.now()}. ${file.originalname}`)
        },
    }),
})
