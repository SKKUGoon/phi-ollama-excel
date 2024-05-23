/* eslint-disable no-undef */
import express from "express";
import * as https from "https";
import * as httpProxy from "http-proxy-middleware";
import { ensureCertificatesAreInstalled, getHttpsServerOptions } from "office-addin-dev-certs";

const createServer = async () => {
  await ensureCertificatesAreInstalled();

  const app = express();

  const apiProxy = httpProxy.createProxyMiddleware({
    target: "http://localhost:11434", // target server
    changeOrigin: true,
    secure: false, // only for development
    logger: console,
  });

  app.use(apiProxy); // Use the proxy middleware
  app.use(express.static("public"));

  getHttpsServerOptions().then((options) => {
    https.createServer(options, app).listen("3000", () => {
      console.log("[Server] >>> Server running on https://localhost:3000");
    });
  });
};

createServer().catch((err) => {
  console.log(`failed creating HTTPS Server ${err}`);
});
