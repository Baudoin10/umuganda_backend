// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Umuganda APIs docs",
      version: "1.0.0",
      description: "API documentation for umuganda",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: ["./routes/*.js"], // your route files
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use(
    "/api-docs",
    // set the server URL dynamically from the actual request (Render or local)
    (req, _res, next) => {
      const proto = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.get("host");
      swaggerSpec.servers = [{ url: `${proto}://${host}` }];
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};

module.exports = swaggerDocs;
