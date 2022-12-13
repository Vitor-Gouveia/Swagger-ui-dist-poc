function createElement(html) {
  const template = document.createElement("template")
  template.innerHTML = html.trim()
  
  return template.content.firstElementChild
}

const runTOC = () => {
  const requests = document.querySelectorAll(".operation-tag-content > span .opblock")
  const toc = document.querySelector("#toc")
  
  requests.forEach(request => {
    const requestId = request.id
    .split("-")[2]
    .replaceAll("_", " ")
    
    const listItem = createElement(`
    <li>
    <a href="#${request.id}">${requestId}</a>
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