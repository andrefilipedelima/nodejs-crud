const express = require('express');
const server = express();

server.use(express.json());
const cursos = ['NodeJS', 'Javascript', 'React Native', 'Typescript'];


//middleware global
server.use((req, res, next) => {
    console.log(`URL Chamada: ${req.url}`);
    return next();
});


//middleware function
function checkCurso(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: "A propriedade 'name' não está definida." });
    }

    return next();
}

function checkIndexCurso(req, res, next) {
    const curso = cursos[req.params.index];
    if (!curso) {
        return res.status(400).json({ error: "ID do curso não existe" });
    }

    req.curso = curso;

    return next();
}


//listar cursos
server.get('/cursos', (req, res) => {
    return res.json(cursos)
});

//criar curso
server.post('/cursos', checkCurso, (req, res) => {
    const { name } = req.body;
    cursos.push(name);

    return res.json(cursos);
});

//get curso
server.get('/cursos/:index', checkIndexCurso, (req, res) => {
    return res.json(req.curso);
});

//update curso
server.put('/cursos/:index', checkCurso, checkIndexCurso, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    cursos[index] = name;

    return res.json(cursos);
});

//deletar curso
server.delete('/cursos/:index', checkIndexCurso, (req, res) => {
    const { index } = req.params;

    cursos.splice(index, 1);

    return res.json({ message: `Curso ${cursos[index]} removido.`});
})



server.listen(3000);