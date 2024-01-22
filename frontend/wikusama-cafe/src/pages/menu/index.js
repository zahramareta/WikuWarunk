import React from 'react'
import MenuItem from './menuItem'
import { useState, useEffect } from 'react'
import { Modal } from 'bootstrap'
import axios from "axios" //utk connect to another server (backend)
const baseURL = "http://localhost:8000"

const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

export default function Menu() {
    const [menus, setMenus] = useState([])

    //define state to store prop to menu
    const [id_menu, setIDMenus] = useState(0)
    const [nama_menu, setNamaMenu] = useState("")
    const [jenis, setJenis] = useState("")
    const [deskripsi, setDeskripsi] = useState("")
    const [harga, setHarga] = useState(0)
    const [gambar, setGambar] = useState(undefined)

    //define state to strore modal
    const [modal, setModal] = useState(undefined)

    //define state to store status of edit
    const [isEdit, setIsEdit] = useState(true)

    const [keyword, setKeyword] = useState("")

    const [role, setRole] = useState("")

    async function getMenu() {
        try {
            let url = `${baseURL}/menu`
            let { data } = await axios.get(url, header)
            setMenus(data.data)
        } catch (error) {
            console.log(error);
        }
    }

    async function searching(e) {
        try {
            // jika tekan tombol enter(13) 
            if (e.keyCode == 13) {
                let url = `${baseURL}/menu/find`
                let dataSearch = { keyword: keyword }
                let { data } = await axios.post(url, dataSearch, header)
                setMenus(data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function addMenu() {
        //show modal
        modal.show()

        //reset state of menu
        setIDMenus(0)
        setNamaMenu("")
        setDeskripsi("")
        setHarga(0)
        setJenis("")
        setGambar(undefined)
        setIsEdit(false)
    }

    async function edit(menu) {
        // open modal
        modal.show()
        setIsEdit(true)
        setIDMenus(menu.id_menu)
        setNamaMenu(menu.nama_menu)
        setDeskripsi(menu.deskripsi)
        setHarga(menu.harga)
        setJenis(menu.jenis)
        setGambar(undefined)
    }

    async function drop(menu) {
        try {
            if (window.confirm(`Apakah anda yakin menghapus ${menu.nama_menu}`)) {
                let url = `${baseURL}/menu/${menu.id_menu}`
                axios.delete(url, header)
                    .then(result => {
                        if (result.data.status == true) {
                            window.alert(result.data.message)
                        }
                        // refresh data
                        getMenu()
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function saveMenu(e) {
        try {
            e.preventDefault()
            // action for close modal
            modal.hide()
            if (isEdit) {
                //untuk edit
                let form = new FormData()
                form.append("nama_menu", nama_menu)
                form.append("harga", harga)
                form.append("jenis", jenis)
                form.append("deskripsi", deskripsi)

                if (gambar != undefined) {
                    form.append("gambar", gambar)
                }

                // send to backend
                let url = `${baseURL}/menu/${id_menu}`
                let result = await axios.put(
                    url, form, header
                )
                if (result.data.status == true) {
                    // refresh data menu
                    getMenu()
                }
                window.alert(result.data.message)

            } else {
                //untuk tambah
                let form = new FormData()
                form.append("nama_menu", nama_menu)
                form.append("harga", harga)
                form.append("jenis", jenis)
                form.append("deskripsi", deskripsi)
                form.append("gambar", gambar)

                // send to backend
                let url = `${baseURL}/menu`
                let result = await axios.post(
                    url, form, header
                )
                if (result.data.status == true) {
                    // refresh data menu
                    getMenu()
                }
                window.alert(result.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => { //menjalankan aksi saat komponen ini dimuat
        // initializing modal
        let data = JSON.parse(localStorage.getItem('user'))
        setModal(new Modal('#modalMenu'))
        setRole(data?.role)
        getMenu()
    }, [])

    return (
        <div className='container-fluid min-vh-100'>
            <div className='p-2'>
                <h3 style={{fontWeight: 'bold', color: 'Black' }}>Daftar Menu</h3>
                <hr style={{color: "black"}}></hr>
                <button className={`btn btn-sm ${['admin'].includes(role) ? 'd-block':'d-none'}`} style={{ background: '#526D82' }} onClick={() => addMenu()}>
                    <h6 style={{ color: 'white', textAlign: 'center'}}>Tambah Menu</h6>
                </button>

                <input type='text' className='form-control my-2' value={keyword} onChange={e => setKeyword(e.target.value)} onKeyUp={e => searching(e)}>

                </input>
            </div>

            <div className='row me-0'>
                {menus.map(menu => (
                    <div key={`menu${menu.id_menu}`} className="col-md-6 col-lg-4">
                        <MenuItem
                            img={`${baseURL}/menu_image/${menu.gambar}`}
                            nama_menu={menu.nama_menu}
                            deskripsi={menu.deskripsi}
                            harga={menu.harga}
                            jenis={menu.jenis}
                            onEdit={() => edit(menu)}
                            onDelete={() => drop(menu)} />
                    </div>
                ))}
            </div>

            {/* create div of modal */}
            <div className='modal fade' id='modalMenu'>
                <div className='modal-dialog modal-md'>
                    <div className='modal-content'>
                        <form onSubmit={e => saveMenu(e)}>
                            {/* HEADER */}
                            <div className='modal-header' style={{ background: '#526D82', color: 'white' }}>
                                <h4>Form Menu</h4>
                            </div>

                            {/* BODY */}
                            <div className='modal-body'>
                                <small>Nama Menu</small>
                                <input type='text'
                                    required={true}
                                    className='form-control mb-2'
                                    value={nama_menu}
                                    onChange={e => setNamaMenu(e.target.value)}></input>

                                <small>Deskripsi</small>
                                <input type='text'
                                    required={true}
                                    className='form-control mb-2'
                                    value={deskripsi}
                                    onChange={e => setDeskripsi(e.target.value)}></input>

                                <small>Harga</small>
                                <input type='number'
                                    required={true}
                                    className='form-control mb-2'
                                    value={harga}
                                    onChange={e => setHarga(e.target.value)}></input>

                                <small>Gambar</small>
                                <input type='file'
                                    className='form-control mb-2'
                                    accept='image/*'
                                    onChange={e => setGambar(e.target.files[0])}></input>

                                <small>Jenis Menu</small>
                                <select
                                    className='from-control mb-2'
                                    required={true}
                                    value={jenis}
                                    onChange={e => setJenis(e.target.value)}>
                                    <option value="">---Pilih Jenis Makanan---</option>
                                    <option value="makanan">Makanan</option>
                                    <option value="minuman">Minuman</option>
                                </select>
                            </div>

                            {/* FOOTER */}
                            <div className='modal-footer'>
                                <button type='submit' className='w-100 btn btn-success'>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
