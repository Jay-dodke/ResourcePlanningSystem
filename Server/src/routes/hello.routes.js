import express from "express";
import {getHello} from "../controllers/hello.controller.js";

import checkHelloworld from "../middlewares/hello.middleware.js";

const router = express.Router();

// middleware applied here
router.get("/", checkHelloworld, getHello);

export default router;
