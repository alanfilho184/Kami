import express from "express";
import logger from "../configs/logger";
import bodyParser from "./body-parser.middleware";
import verifySignature from "./verify-signature.middleware";

const middlewares = express.Router();

middlewares.use(bodyParser);
middlewares.use(verifySignature);

export default middlewares;