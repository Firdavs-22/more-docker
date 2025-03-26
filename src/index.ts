import http from "node:http";
import initializeSocket from "@socket";
import app from "@app";
import logger from "@logger";

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);
const io = initializeSocket(server)

server.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`);
});


