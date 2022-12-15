function createElement(html) {
  const template = document.createElement("template")
  template.innerHTML = html.trim()
  
  return template.content.firstElementChild
}

const runTOC = () => {
  const opblocks = document.querySelectorAll(".opblock")
  const requests = document.querySelectorAll(".opblock-summary-path")
  const toc = document.querySelector("#toc")

  opblocks.forEach(opblock => {
    const requestId = opblock.id
    const requestRoute = opblock.querySelector(".opblock-summary-path")

    const listItem = createElement(`
      <li>
        <a href="#${requestId}">${requestRoute.innerText}</a>
      </li>
    `)
    
    toc.appendChild(listItem)
  })
}

window.ui = SwaggerUIBundle({
  url: "http://localhost:3000/api",
  dom_id: "#apis",
  presets: [
    SwaggerUIBundle.presets.apis,
    SwaggerUIStandalonePreset
  ],
  plugins: [
    SwaggerUIBundle.plugins.DownloadUrl
  ],
  layout: "StandaloneLayout",
});

const swaggerExists = setInterval(() => {
  if (document.querySelector(".swagger-ui") !== null) {
    runTOC();
    
    clearInterval(swaggerExists);
  }
}, 100);