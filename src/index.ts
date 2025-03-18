import app from "@app";
import logger from "@logger";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  logger.info(`Server started on http://localhost:${PORT}`);
});


