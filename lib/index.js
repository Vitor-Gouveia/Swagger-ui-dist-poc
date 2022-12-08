const database = require("./clients/database")
const express = require("express")
const handlebars = require("express-handlebars")
const path = require("path")

async function main() {
  const app = express();

  app.use(express.json())
  app.use('/static', express.static(path.join(__dirname, 'assets')))
  app.engine("handlebars", handlebars.engine())
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, "views"));

  const db = await database.init()
  const openAPI = db.collection("openapi")

  const results = await openAPI.find().toArray()

  app.get("/", (_, response) => {
    const resultsCopy = results[0]
    delete resultsCopy._id
    return response.render('index', {
      toc: []
    })
  })

  app.get("/api", (_, response) => {
    return response.json(results[0])
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