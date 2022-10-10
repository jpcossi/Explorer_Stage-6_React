const {Router} = require("express")

const UsersController = require("../controllers/UsersController")

const usersRoutes = Router()

function myMiddleware(request, response, next){
    console.log("vc passou pelo middleware")
    console.log(request.body)

    if(!request.body.isAdmin){
        return response.json({message: "user unauthorized"})
    }

    next()
}

const usersController = new UsersController()

usersRoutes.post("/", myMiddleware, usersController.create)
usersRoutes.put("/:id", usersController.update)


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
*/