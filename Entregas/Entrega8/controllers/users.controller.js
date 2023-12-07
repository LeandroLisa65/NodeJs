import { userService, cartService } from '../repositoryservices/index.js'
import { hashData, isValidPassword } from './../utils/bcrypt.js'
import { generateToken, decodeJWT } from '../utils/jwt.js'
import CustomError from '../utils/CustomErrors/CustomError.js'
import EErrors from '../utils/CustomErrors/EErrors.js'
import { generateUserErrorInfo }from '../utils/CustomErrors/info.js'
import UserDto from './../dto/user.dto.js'

class UserController {
    register = async(req, res, next) => {
        try{
            console.log(req.body);
            const { first_name, last_name, email, password, age } = req.body

            if(!first_name || !last_name || !email){
                CustomError.createError({
                    name: 'User error',
                    cause: generateUserErrorInfo({first_name, last_name, email}),
                    message: 'Error create user',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            const user = await userService.getByEmail(email)
            if(user) return 'A user already exists with that email' 

            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: await hashData(password),
                cart: await cartService.create()
            }
            let result = await userService.create(newUser)
            console.log(result)
            return { result }
        }catch(error){
            next(error)
        }
    }

    login = async(req, res, next) => {
        const { email, password } = req.body
    
        const userDB = await userService.getByEmail(email)
            try{
                if(!userDB){
                    CustomError.createError({
                        name: 'Could not find user',
                        cause: null,
                        message: 'Error trying to find a user with the email: ' + email,
                        code: EErrors.INVALID_TYPE_ERROR
                    })
                }
                
                if(!(await isValidPassword(userDB, password))) return res.send({status: 'error', message: 'Your user password does not match the entered password'})

                const access_token = generateToken(userDB)

                lastConnection(userDB._id)
                res.cookie(process.env.JWT_COOKIE_KEY, access_token, {maxAge: 3600000, httpOnly: false, sameSite: 'none', secure: true})
    
                return { userDB, access_token }
            }catch(error){
                throw error
            }
    }

    logout = (req, res, next)=>{
        if(req.cookies[process.env.JWT_COOKIE_KEY]){
            const token = req.cookies[process.env.JWT_COOKIE_KEY]
            const user = decodeJWT(token, process.env.JWT_KEY)
            
            res.clearCookie(process.env.JWT_COOKIE_KEY)
            return 'Succesfully logged out'
        }else{
            return 'No user logged in'
        }
    }

    current = (req, res, next) => {
        const user = req.user;
        
        const { first_name, last_name, email, role, date_of_birth, cart, _id, last_connection, documents } = new UserDto(user)
        return {first_name, last_name, email, role, date_of_birth, cart, _id, last_connection, documents }
    }

    updatePassword = async(req, res, next) => {
            const { token, password } = req.body

            try{
                const user = decodeJWT(token, process.env.JWT_RESET_PASSWORD_KEY)

                if(isValidPassword(user.user, password) == true)
                    res.send({status: 'error', message: "You can't enter the same password you had before"})

                const hashedPassword = hashData(password)
                let result = await userService.update({_id: user.user._id}, {password: hashedPassword})
                return result
            }catch(error){
                throw error
            }
    }

    getUsers = async(req, res, next) => {
        try{
            const users = await userService.get()
            const usersMapped = users.map((user) => {
                const { first_name, last_name, email, role } = new UserDto(user)
                return { first_name, last_name, email, role }
            })
            return usersMapped
        }catch(error){
            throw error
        }
    }
}

const userController = new UserController();

export default userController;