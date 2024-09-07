import { registerAs } from "@nestjs/config";

export default registerAs('config', () => ({
    port: parseInt(process.env.PORT) || 3000,
    clientHost: process.env.CLIENT_HOST || 'localhost'
  }));
  