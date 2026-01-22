import logEvent from "./middleware/logEvents.js";
import EventEmitter from "events";
import http from "http";
import path from "path";
import fsPromises from "fs/promises";
import fs from "fs";
const { dirname } = import.meta;

class LogEmitter extends EventEmitter {}

const eventLogger = new LogEmitter();

const port = process.env.PORT || 3500;

eventLogger.on("log", (msg, fileName) => logEvent(msg, fileName));

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("image") ? "utf8" : ""
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    eventLogger.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  const extension = path.extname(req.url);
  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
    case ".JPG":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(dirname, "views", req.url)
      : path.join(dirname, req.url);

      // makes .html extension not required in the browser
      if (!extension && req.url.slice(-1) !== '/') filePath += '.html';
      console.log(filePath, 'filepath')
  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serveFile(path.join(dirname, "views", "404.html"), "text/html", res);
    }
  }
});

server.listen(port, () => console.log(`Server is listening on port ${port}`));
