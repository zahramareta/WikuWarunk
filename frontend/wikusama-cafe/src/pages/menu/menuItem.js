import React from 'react'
import { useState, useEffect } from 'react'

export default function MenuItem(props) {
    const [role, setRole] = useState("")

    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('user'))
        setRole(data?.role)
    }, [])

  return (
    <div className='w-100 m-2' style={{background: '#F9F5EB', border: '2px solid black', borderRadius: '10px'}}>
        <img src={props.img} alt="img-menu" className=' img-fluid p-3 w-100' style={{height: '300px', borderRadius: '25px'}}></img>
        <div className='w-100 mt-2 mx-3'>
            <h5 className='mb-1' style={{color: "3C2A21"}}>
                {props.nama_menu}
            </h5>
            <div className='mb-1 badge' style={{color: "#E5E5CB", fontWeight: "bold", background: '#3C2A21', fontSize: '15px'}}>
                {props.jenis}
            </div>
            <p className='mb-1' style={{color: "#3C2A21"}}>
                {props.deskripsi}
            </p>
            <h5 style={{color: "#3C2A21"}}>
                Rp {props.harga}
            </h5>
        </div>
        <div className='w-100 p-2 '>
            <button className={`btn btn-primary ${['admin'].includes(role) ? 'd-inline':'d-none'}`} onClick={() => props.onEdit()}>
                Edit
            </button>
            <button className={`btn btn-danger mx-2 ${['admin'].includes(role) ? 'd-inline':'d-none'}`} onClick={() => props.onDelete()}>
                Hapus
            </button>
        </div>
    </div>
  )
}
