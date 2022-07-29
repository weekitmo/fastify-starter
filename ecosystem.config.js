module.exports = {
  apps: [
    {
      name: "@weekit/fastify-server",
      script: "pnpm start",
      instances: 1,
      error_file: "./logs/app-error.log",
      out_file: "./logs/app-out.log",
      env: {
        NODE_ENV: "production"
      },
      env_production: {
        NODE_ENV: "production"
      },
      env_development: {
        NODE_ENV: "development"
      },
      env_local: {
        NODE_ENV: "local"
      }
    }
  ]
}
