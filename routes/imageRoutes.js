const express = require("express");
const router = express.Router();
const { upload, ImageController } = require("../utils/imageController");

router.post("/upload", upload.single("image"), ImageController.uploadImage);
router.get("/", ImageController.getImages);
// router.delete("/:filename", ImageController.deleteImage);

module.exports = router;
