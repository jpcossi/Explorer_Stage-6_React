const {hash, compare} = require("bcryptjs")
const { Database } = require("sqlite")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

class UsersController {
    /*
    - index -> GET para listar vários registros
    - show -> GET para exibir um registro especifico
    - create -> POST para criar um registro
    - update -> PUT para atualizar um registro
    - delete -> DELETE para remover um registro
    */

    async create(request, response){
        //response.send("Voce chamou o POST!")
        //response.send(`Usuário ${nome}, E-mail: ${email}. E a senha é: ${password} `)
        /*
        if(!nome){
            throw new AppError("Nome é obrigatório!")
        }
        
        response.json({nome, email, password})*/
        const {nome, email, password} = request.body

        const database = await sqliteConnection() 
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
        
        if(checkUserExists){
            throw new AppError("Este e-mail já está em uso!")
        }

        const  hashedPassword = await hash(password, 8)

        await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [nome, email, hashedPassword])


        return response.status(201).json()
    }

    async update(request, response){
        const {name, email, password, old_password} = request.body
        const user_id = request.user.id
        //const {id} = request.params
        
        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)",
        [user_id])
        
        if(!user){
            throw new AppError("Usuário não encontrado")
        }
        
        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)",
        [email])
        
        if((userWithUpdatedEmail) && (userWithUpdatedEmail.id !== user.id)){
            throw new AppError("E-mail já existe")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)
        
            if(!checkOldPassword){
                throw new AppError("Senha antiga não confere")
            }

            user.password = await hash(password, 8)
        }
        
        user.name = name ?? user.name 
        user.email = email ?? user.email
        
        if(password && !old_password){
            throw new AppError("Voce precisa informar a sua antiga senha!")
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
        )
        
        
        return response.json()
    }
}

module.exports = UsersController