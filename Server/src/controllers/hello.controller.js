export const getHello = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello world!",
  });
};
