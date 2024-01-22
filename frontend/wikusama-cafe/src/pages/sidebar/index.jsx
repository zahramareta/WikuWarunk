import { Link } from "react-router-dom"
import { useState, useEffect, Children } from "react"
const Sidebar = ({ title, children }) => {
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")

    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('user'))
        setUsername(data.nama_user)
        setRole(data?.role)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = "/login"
    }
    return (
        <div className="container-fluid ">
            <div className="row no-wrap">
                {/** sidebar */}
                <div className="col-2 vh-100 shadow sticky-top"
                    style={{ backgroundColor: "white" }}>
                    {/** logo */}
                    <div className="w-100 d-flex justify-content-center my-4">
                        <img src="/logocafe.png" alt="brand"
                            style={{ width: `130px` }} />
                    </div>

                    {/** user display */}
                    <div className="w-100 p-3 text-center">
                        <h5 className="m-1">{username}</h5>
                        <small>Position: {role}</small>
                    </div>

                    {/** list menu */}
                    <div className="w-100 ps-3 d-flex flex-column" > {/** text-start : rata kiri  */}
                        <Link className="w-100 p-2 text-start text-decoration-none h6" to="/home">
                            <b className="bi bi-house-fill me-2" style={{ color: "#526D82" }}> Dashboard </b>
                        </Link>

                        <Link className={`w-100 p-2 text-start text-decoration-none h6 ${['kasir', 'manajer'].includes(role) ? 'd-block' : 'd-none'}`} to="/transaksi/chart">
                            <b className="bi bi-bar-chart-fill me-2" style={{ color: "#526D82" }}> Chart </b>
                        </Link>

                        <Link className={`w-100 p-2 text-start text-decoration-none h6 ${['admin', 'manager', 'kasir'].includes(role) ? 'd-block' : 'd-none'}`} to="/menu">
                            <b className="bi bi-book-fill me-2" style={{ color: "#526D82" }}> Menu </b>
                        </Link>

                        <Link className={`w-100 p-2 text-start text-decoration-none h6 ${['admin', 'kasir'].includes(role) ? 'd-block' : 'd-none'}`} to="/meja">
                            <b className="bi bi-plus-square-fill me-2" style={{ color: "#526D82" }}> Meja </b>
                        </Link>

                        <Link className={`w-100 p-2 text-start text-decoration-none h6 ${['admin', 'manager'].includes(role) ? 'd-block' : 'd-none'}`} to="/user">
                            <b className="bi bi-person-fill me-2" style={{ color: "#526D82" }}> User </b>
                        </Link>

                        <Link className={`w-100 p-2 text-start text-decoration-none h6 ${['kasir', 'manajer'].includes(role) ? 'd-block' : 'd-none'}`} to="/transaksi">
                            <b className="bi bi-receipt me-2" style={{ color: "#526D82" }}> Transaksi </b>
                        </Link>

                        <Link className="w-100 p-2 text-start text-decoration-none h6" to="/login" onClick={() => handleLogout()}>
                            <b className="bi bi-door-open-fill me-2" style={{ color: "#526D82" }}> Logout </b>
                        </Link>
                    </div>
                </div>

                {/** content */}
                <div className="col min-vh-100 p-0">
                    {/** header */}
                    <div className="w-100 shadow p-2 sticky-top bg-white">
                        <img src="/logonavbar.png" alt="brand" style={{ width: `150px`}} />
                    </div>

                    {/** content page */}
                    <div className="w-100 p-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Sidebar