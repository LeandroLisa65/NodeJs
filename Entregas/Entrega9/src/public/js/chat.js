const socket = io()

let userEmail, userRole

const fetchUserData = async () => {
    try{
        const res = await fetch('/api/users/current')
            if (res.ok) {
                const data = await res.json()
                userEmail = data.payload.email
                userRole = data.payload.role

                if(userRole.toUpperCase() === 'ADMIN'){
                    input.disabled = true
                    input.placeholder = "Admins can't send messages";
                }
            } else { throw new Error('Error requesting user data'); }
    }catch(error){
        throw error
    }
}

const input = document.getElementById('text')
const log = document.getElementById('messages')
const date = new Date()
const formattedDate = `${date.getHours()}:${date.getMinutes()}/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

fetchUserData()

input.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        socket.emit('message', { email: userEmail, message: input.value, createdAt: formattedDate })
        input.value = ""
    }
})

socket.on('log', data => {
    let logs = ''
    data.logs.forEach(log => {
        logs += `<li class="w-100 bg-gray-200 py-2 px-1 rounded my-2 flex justify-between items-center"><p class="block">${log.email} says: ${log.content}</p> <span class="block text-sm text-gray-400">${log.createdAt}</span></li>`
    })
    log.innerHTML = logs
})