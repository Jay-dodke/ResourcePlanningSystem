const checkHelloworld = (req, res, next) => {
  const key = req.headers["hello"];

  if (key === "abchello") {
    return next(); // pass to route
  }

  res.status(401).send("invalid user");
};

export default checkHelloworld;
