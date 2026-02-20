const checkHelloworld = (req, res, next) => {
  const key = req.query.hello;

  if (key === "abchello") {
    return next();
  }

  res.status(401).send("invalid user");
};

export default checkHelloworld;
