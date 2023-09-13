const express = require('express')
const { MainApp } = require("./mainApp")
const dataConnect = require("./database/db")
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi =  require("swagger-ui-express")

const app = express()
const port = 7045

dataConnect
	.initialize()
    .then(() => {
        console.log("my sql has been connected ")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

    
 const swaggerDefinition = {
  basePath: '/',
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'cham access  ',
    description: 'chamacess',
   },
  
  components: {
    securitySchemes: {
      Authorization: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        value: "Bearer <JWT token here>"
      },
    },
  },
//  security: [{ Authorization: [] }],
  
  servers: [
    { url: '/' },
     ],
//    consumes: ['application/json'],
   produces: ['application/json']
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./controller/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocs, { explorer: true }));

const server = app.listen(port,() => {
    console.log(`server is listening on port ${port}`)
})



MainApp(app)

process.on("uncaughtExpection", (err) => {
    console.log("shutting down server")
    console.log(err)
    process.exit(1);
})

process.on("unhandledRejection", (reason) => {
    console.log("shutting down: unhandled rejection")
    console.log(reason)
    process.exit(1);

    server.close(() => {
        process.exit(1)
    })
})