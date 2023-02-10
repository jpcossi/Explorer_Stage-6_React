const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const UsersController = require("../controllers/UsersController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const usersRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const usersController = new UsersController()

usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), (request, response) => {
    console.log(request.file.filename)
    response.json()
})

module.exports = usersRoutes


//metodo GET com request e response usando params/query
/*
usersRoutes.get("/message/:id/:user", (request, response) => {
    const {id, user} = request.params
    
    response.send(`
        Mensagen ID: ${id}.
        Para o usuário ${user}.
    `)
})

usersRoutes.get("/users", (request, response) => {
    const {page, limit} = request.query
    
    response.send(`
        Página: ${page}.
        Mostrar ${limit}.
    `)
})

Uma outra alternativa mais simples de verificação do middleware

function myMiddleware(request, response, next){
    console.log("vc passou pelo middleware")
    console.log(request.body)

    if(!request.body.isAdmin){
        return response.json({message: "user unauthorized"})
    }

    next()
}

*/