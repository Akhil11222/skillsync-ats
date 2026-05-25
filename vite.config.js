import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to serve serverless api functions locally under Vite dev server
const localApiPlugin = () => ({
  name: 'local-api-middleware',
  configureServer(server) {
    // Read local API key if not already defined in process.env
    if (!process.env.GEMINI_API_KEY) {
      try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf-8');
          const match = envContent.match(/^GEMINI_API_KEY\s*=\s*(.*)$/m);
          if (match && match[1]) {
            process.env.GEMINI_API_KEY = match[1].trim().replace(/^["']|["']$/g, '');
            console.log('Loaded GEMINI_API_KEY from .env locally for serverless functions.');
          }
        }
      } catch (err) {
        console.error('Failed to parse .env file locally:', err);
      }
    }

    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/')) {
        // Parse name from url
        const url = new URL(req.url, 'http://localhost');
        const apiName = url.pathname.replace(/^\/api\//, '');
        const handlerPath = path.resolve(process.cwd(), 'api', `${apiName}.js`);
        
        if (fs.existsSync(handlerPath)) {
          try {
            // Buffer request body
            let body = '';
            await new Promise((resolve) => {
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', () => {
                resolve();
              });
            });

            if (body && req.headers['content-type']?.includes('application/json')) {
              req.body = JSON.parse(body);
            } else {
              req.body = {};
            }

            // Mock Vercel response helper methods
            const vercelRes = {
              statusCode: 200,
              headers: {},
              setHeader(name, value) {
                this.headers[name] = value;
                res.setHeader(name, value);
                return this;
              },
              status(code) {
                this.statusCode = code;
                res.statusCode = code;
                return this;
              },
              json(data) {
                this.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return this;
              }
            };

            // Dynamically load the ES Module file
            const handlerModule = await server.ssrLoadModule(`/api/${apiName}.js`);
            if (handlerModule && handlerModule.default) {
              await handlerModule.default(req, vercelRes);
              return;
            }
          } catch (err) {
            console.error(`Error in local serverless handler /api/${apiName}:`, err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
            return;
          }
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
})
