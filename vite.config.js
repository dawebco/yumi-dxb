import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function apiDevPlugin(env) {
  return {
    name: "api-dev-server",
    configureServer(server) {
      // Ensure process.env has the loaded environment variables for serverless handlers
      Object.assign(process.env, env);

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        const endpoint = req.url.split("?")[0].replace(/^\/api\//, "");
        let handlerFile;
        if (endpoint === "chat") handlerFile = "./api/chat.js";
        else if (endpoint === "create-order") handlerFile = "./api/create-order.js";
        else if (endpoint === "verify-payment") handlerFile = "./api/verify-payment.js";
        else return next();

        // Read and parse JSON request body for POST/PUT requests
        let body = {};
        if (req.method === "POST" || req.method === "PUT") {
          try {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const raw = Buffer.concat(buffers).toString();
            if (raw) {
              body = JSON.parse(raw);
            }
          } catch {
            body = {};
          }
        }
        req.body = body;

        // Polyfill Express/Vercel response helpers
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
          return res;
        };

        try {
          const mod = await server.ssrLoadModule(handlerFile);
          await mod.default(req, res);
        } catch (err) {
          console.error(`API Error in ${endpoint}:`, err);
          if (!res.writableEnded) {
            res.status(500).json({ message: err.message || "Internal server error" });
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin(env)],
  };
});