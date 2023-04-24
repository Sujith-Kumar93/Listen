const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Podcast = require("../models/podcast");
const { podcastSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");
const Joi = require("joi");

const User = require("../models/user");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({
  storage: storage,
  limits: { fileSize: 1023 * 1024 * 20 },
}).single("video");
const podcasts = require("../controllers/podcast");

const validatePodcast = (req, res, next) => {
  const { error } = podcastSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(".");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/", catchAsync(podcasts.index));

router.post("/", isLoggedIn, validatePodcast, podcasts.new);

router.get("/:id", isLoggedIn, catchAsync(podcasts.getPodcast));

router.post("/:id/favourite", isLoggedIn, podcasts.favourite);

router.get("/:id/edit", isLoggedIn, catchAsync(podcasts.editPodcasts));

router.put("/:id", isLoggedIn, catchAsync(podcasts.updatePodcast));

router.delete("/:id", isLoggedIn, catchAsync(podcasts.deletePodcast));

router.post("/search", podcasts.search);

module.exports = router;
