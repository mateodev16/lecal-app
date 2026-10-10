import { env } from "./config.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[lecal-server] API escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`);
});