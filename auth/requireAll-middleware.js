function requireAll(req, res, next) {
  if (
    !req.body.name ||
    !req.body.type ||
    !req.body.length_minutes ||
    !req.body.intensitylvl ||
    !req.body.location ||
    !req.body.current_size ||
    !req.body.max_size
  ) {
    res.status(400).json({
      message:
        "Please provide name, type, lenth_minutes, intensitylvl, location, current_size, max_size in the request body. Thank you. -Anywhere Fitness Inc."
    });
  } else {
    next();
  }
}

module.exports = requireAll;
