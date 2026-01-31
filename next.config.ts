// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Если хотите статический экспорт - добавьте:
  output: 'export', // ← для статического хостинга
  // Или оставьте как есть для Node.js сервера
};

export default nextConfig;