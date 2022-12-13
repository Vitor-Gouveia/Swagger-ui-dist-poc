const database = require("./clients/database")
const express = require("express")
const handlebars = require("express-handlebars")
const path = require("path");

const descriptions = {
  "Autenticação": {
    summary: "(Suporte a criptografia a nível de mensagem)",
    description: `
      <section>
        <h1 id='4'>4. Autenticação - Com Suporte a criptografia a nível de mensagem</h1>

        <p>
          Para realizar a conexão com nossa API, será necessário solicitar um token de acesso que,
          posteriormente, será utilizadono Header de todas as chamadas.
        </p>

        <p>
          Na solicitação do token de acesso, será necessário o <strong>client_id</strong> e
          <strong>client_secret</strong>, fornecidos previamente pela Minu.
        </p>
      </section>`
  },
  "Criação de Campanha": {
    summary: "",
    description: `
      <section>
        <h3 id='5.1'>5.1. Criação de Campanha</h3>

        <p>
          Este recurso é dedicado para a criação de campanhas. Os dados requeridos para criar uma campanha mudam de acordo com o seu tipo. Os tipos de campanha são os seguintes:
        </p>

        <ul style='list-style: disc;'>
          <li>
            <p><strong>Recompensa Única de Telefonia:</strong> neste tipo de campanha os consumidores finais recebem como recompensa bônus de telefonia (voz, SMS ou dados) de acordo com a operadora de telefonia contratada;</p>
          </li>

          <li>
            <p><strong>Recompensa Única:</strong> neste tipo de campanha o cliente corporativo define a recompensa que será para os consumidores participantes da campanha;</p>
          </li>

          <li>
            <p><strong>Recompensas de Múltipla Escolha:</strong> o cliente corporativo seleciona até 5 recompensas que irão compor a campanha possibilitando que o consumidor final escolha a recompensa que mais lhe agradar.</p>
          </li>
        </ul>
      <section>
    `
  }
}

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
  const openAPIFile = results[0]

  app.get("/", (_, response) => {
    return response.render('index')
  })

  app.get("/api", (_, response) => {
    let paths = openAPIFile.paths

    Object
      .entries(openAPIFile.paths)
      .forEach(([key, operation]) => {
        const [HTTPMethod] = Object.keys(paths[key])
        
        const { operationId } = operation[HTTPMethod]
        const { description, summary } = descriptions[operationId]

        paths[key] = {
          ...operation,
          [HTTPMethod]: {
            ...operation[HTTPMethod],
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