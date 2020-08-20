const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * MEtodos http:
 * 
 * get: Busca informaçõpes no back end
 * post: Criar informação no back end
 * put/patch: Aleterar uma informação no back end
 * delete: Deletar dados
 * 
 */

 /**
  * Tipos de parametros
  * 
  * Query Params: Filtros e paginação
  * Route Params: Identificar recursos (Atualizar / Deletar)
  * Request Params: Conteudo na hora de criar ou editar um recurso (VEM EM JSON)
  * 
  */

  /**
   * Middleware:
   * 
   * Interceptador de requisisções que interrompe totalmente a requisição ou alterar dados da requisiçao
   */

const projects = [];

function logRequests(request, response, next){
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);
}

function validateProjectId(request, response, next){
    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({ error: 'Invalid project ID.'})
    }

    return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) =>{
    const { title} = request.query;
    
    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(results);

});

app.post('/projects', (request, response) =>{    
    const { title, owner } =  request.body;
    const project = { id: uuid(), title, owner };

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) =>{
    const { id } = request.params;
    const { title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id == id)
    
    if(projectIndex < 0){
        return response.status(400).json({ error: 'Project not found.'})
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project)
});

app.delete('/projects/:id', (request, response) =>{
    const { id } = request.params;
    console.log(id);
    const projectIndex = projects.findIndex(project => project.id == id)

    if(projectIndex < 0){
        return response.status(400).json({ error: 'Project not found.'})
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

// Segundo parametro e mensagem que aparece no console enquanto está rodando
app.listen(3333, () =>{
    console.log('Backend started!')
});