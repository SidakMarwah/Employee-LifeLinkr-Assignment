const express = require("express");
const path = require("path");
const { nanoid } = require("nanoid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const router = express.Router();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

router.post("/s3-url", async (req, res) => {
    const { filename, type } = req.body;
    const ext = path.extname(filename); // gets .jpg, .png, etc.
    const key = `${nanoid()}${ext}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: type,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    res.send({ url, key });
});

module.exports = router;
