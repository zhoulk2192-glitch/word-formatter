import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 4173);
const app = createApp();

app.listen(port, "127.0.0.1", () => {
  console.log(`Word Formatter API listening at http://127.0.0.1:${port}`);
});
