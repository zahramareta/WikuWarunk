import React, {useState} from "react"
import axios from "axios"

const Login = () => {
    const [username,setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = event => {
        event.preventDefault()
        let payLoad = {username, password}

        let url = `http://localhost:8000/auth`

        axios.post(url, payLoad)
            .then(response => {
                if (response.data.status === true) {
                    //login success
                    let token = response.data.token
                    let user = response.data.data

                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(user))

                    window.alert(`Login success`)
                    window.location.href = "/home"
                } else {
                    //wrong username/password
                    window.alert(`Username / password wrong`)
                }
            })
            .catch(error => {
                window.alert(error)
            })
    }

    return (
        <div className="vw-100 vh-100 d-flex justify-content-center align-items-center" style={{backgroundImage: 'url(/login.jpg)', backgroundRepeat:false, backgroundSize:'cover'}}>
            <div className="col-md-4 border rounded-2 bg-white p-3 shadow" style={{opacity: "80%"}}>
                <h1 className="text-center">
                    <img src="/logonavbar.png" alt="brand" style={{ width: `250px`}} />
                </h1>

                <form onSubmit={handleLogin} className="mt-4">
                    <input type="text" className="form-control mb-2" required={true} 
                        placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>

                    <input type="password" className="form-control mb-2" required={true} 
                        placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>

                    <button type="submit" className="btn btn-primary w-100 mb-2">LOGIN</button>
                </form>
            </div>
        </div>
    )
}

export default Login