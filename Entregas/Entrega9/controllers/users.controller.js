import { userService, cartService } from '../repositoryservices/index.js'
import { hashData, isValidPassword } from './../utils/bcrypt.js'
import { generateToken } from '../utils/jwt.js'
import CustomError from '../utils/CustomErrors/CustomError.js'
import EErrors from '../utils/CustomErrors/EErrors.js'
import { generateUserErrorInfo }from '../utils/CustomErrors/info.js'
import UserDto from './../dto/user.dto.js'
import transport from '../utils/nodemailer.js'

class UserController {
    register = async(req, res, next) => {
        try{

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

            const hashedPassword = await hashData(password)
            console.log(hashedPassword)
            console.log(password)
            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: hashedPassword,
                cart: await cartService.create()
            }
            let result = await userService.create(newUser)
            await transport.sendMail({
                from: 'Sign Up',
                to: email,
                subject: 'Sign Up',
                html: `
                <div>
                    <h1>Sign Up</h1>
                    <p>This message is to inform that you have sign up</>
                </div>
                `
            })
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

                if(!(await isValidPassword(password, userDB.password))) return res.send({status: 'error', message: 'Your user password does not match the entered password'})

                const token = generateToken(userDB)
 
                res
                .status(200)
                .cookie("token", token, { httpOnly: true })

                return { userDB, token }
            }catch(error){
                throw error
            }
    }

    current = (req, res, next) => {
        const user = req.user;
        const { first_name, last_name, email, role, age, cart } = new UserDto(user)
        return { first_name, last_name, email, role, age, cart }
    }

    updatePassword = async(req, res, next) => {
            const {email, password} = req.body;
        
            try{
                if(!email || !password)
                    return {message: 'All fields are required'};

                await transport.sendMail({
                    from: 'Recover Password',
                    to: email,
                    subject: 'Recover password',
                    html: `
                    <div>
                        <h1>Recover your password</h1>
                        <p>This message is to inform that you have changed your password</>
                    </div>
                    `
                })

                return await userService.update(email, password)
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

    logout = (req, res, next)=>{
        if(req.cookies[process.env.JWT_COOKIE_KEY]){
            res.clearCookie(process.env.JWT_COOKIE_KEY)
            return 'Succesfully logged out'
        }else{
            return 'No user logged in'
        }
    }
}

const userController = new UserController();

export default userController;