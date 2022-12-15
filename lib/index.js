const database = require("./clients/database")
const express = require("express")
const handlebars = require("express-handlebars")
const path = require("path");

const apiv2 = require("./assets/v2.json")
const apiv3 = require("./assets/v3_sem_plugins.json")
const apiv3_com = require("./assets/v3_com_plugins.json")

const apiRoutes = [
  "/v1/oauth/token",
  // "/v1/campaign/{id}",
  "/v1/campaign",
  "/v1/requests",
  "/v1/experiences/{experienceName}/requests/{requestId}",
  "/v1/prizes"
]

const routeDetails = {
  "/v1/campaign": {
    description: `
      <h1>essa é a minha descrição</h1>
    `,
    summary: "vai cruzeiro"
  }
}

async function main() {
  const app = express();

  app.use(express.json())
  app.use('/static', express.static(path.join(__dirname, 'assets')))
  
  // handlebars
  app.engine("handlebars", handlebars.engine())
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, "views"));

  const db = await database.init()
  // const openAPI = db.collection("openapi")

  // const results = await openAPI.find().toArray()
  const results = [apiv2, apiv3, apiv3_com]
  const openAPIFile = results[2]

  app.get("/", (_, response) => {
    return response.render('index')
  })

  app.get("/api", (_, response) => {
    let paths = {}

    Object
      .entries(openAPIFile.paths)
      .filter(([routePath]) => apiRoutes.includes(routePath))
      .forEach(([routePath, props], _, filteredRoutes) => {
        const currentRouteDetails = routeDetails[routePath]
        
        if(!currentRouteDetails) {
          paths[routePath] = Object.fromEntries(filteredRoutes)[routePath]
          return
        }
        
        const [[method, details]] = Object.entries(props)
        const { description, summary } = currentRouteDetails

        paths[routePath] = {
          ...props,
          [method]: {
            ...details,
            description: description
              .trim()
              .replace(/(\r\n|\n|\r)/gm, ""),
            summary
          }
        }
      })

    return response.json({
      ...openAPIFile,
      paths
    })
  })

  app.listen(3000)

  return 'started server at 3000';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(async () => {
    await database.close()
  });