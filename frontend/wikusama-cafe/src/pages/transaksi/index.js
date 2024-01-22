import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Modal } from "bootstrap"
import { Margin, usePDF, Resolution } from "react-to-pdf";

const baseURL = 'http://localhost:8000'
const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}
const Transaksi = () => {
    const [transaksi, setTransaksi] = useState([])
    const [menu, setMenu] = useState([])
    const [meja, setMeja] = useState([])
    const [pendapatan, setPendapatan] = useState(0)
    const printRef = useRef()
    const [selectedItem, setSelectedItem] = useState(null)
    const [showNota, setShowNota] = useState(false)
    const { toPDF, targetRef } = usePDF({ filename: "tes.pdf", canvas: { qualityRatio: 1 }, resolution: Resolution.HIGH, page: { margin: Margin.MEDIUM, format: "letter" } })

    // grab data logged user from local storage
    const USER = JSON.parse(
        localStorage.getItem('user')
    )

    const [id_user, setIdUser] = useState(
        USER.id_user
    )

    const [tgl_transaksi, setTglTransaksi] = useState("")
    const [nama_pelanggan, setNamaPelanggan] = useState("")
    const [id_meja, setIdMeja] = useState("")
    const [detail_transaksi, setDetailTransaksi] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [keyword, setKeyword] = useState("")
    const [filterTanggal, setFilterTanggal] = useState("")
    const [role, setRole] = useState()

    const [id_menu, setIdMenu] = useState("")
    const [jumlah, setJumlah] = useState(0)
    const [modal, setModal] = useState(null)

    // ----------------------------------------------------------------------------------------------------------------------------

    // method get all menu
    const getMenu = () => {
        const url = `${baseURL}/menu`

        axios.get(url, header)
            .then(response => {
                setMenu(response.data.data)
            })
            .catch(error => console.log(error))
    }

    // method get all meja
    const getMeja = () => {
        const url = `${baseURL}/meja/available`

        axios.get(url, header)
            .then(response => {
                setMeja(response.data.data)
            })
            .catch(error => console.log(error))
    }

    // method get all transaksi
    const getTransaksi = () => {
        const url = `${baseURL}/transaksi`

        axios.get(url, header)
            .then(response => {

                if (USER.role === 'kasir') {
                    setTransaksi(response.data.data.filter(item => item.id_user === USER.id_user))
                    setFilteredData(response.data.data.filter(item => item.id_user === USER.id_user))
                } else {
                    setTransaksi(response.data.data)
                    setFilteredData(response.data.data)
                }

            })
            .catch(error => console.log(error))
    }

    const addMenu = () => {
        // set selected menu
        let selectedMenu = menu.find(item => item.id_menu == id_menu)

        let newItem = {
            ...selectedMenu,
            jumlah: jumlah
        }

        let tempDetail = [...detail_transaksi]
        // insert new item to detail
        tempDetail.push(newItem)

        // update array detail menu
        setDetailTransaksi(tempDetail)

        // reset option menu n jumlah
        setIdMenu("")
        setJumlah(0)
    }

    const handleSaveTransaksi = event => {
        event.preventDefault()
        if (nama_pelanggan === "" || id_meja === "" || tgl_transaksi === "" || detail_transaksi.length == 0) {
            window.alert(`Please complete form`)
        }
        else {
            const url = `${baseURL}/transaksi`
            const payload = {
                tgl_transaksi, id_meja, id_user, nama_pelanggan, detail_transaksi
            }
            axios.post(url, payload, header)
                .then(response => {
                    // show message
                    window.alert(`Data Transaksi berhasil ditambahkan`)

                    // close modal
                    modal.hide()

                    // reset data 
                    setTglTransaksi("")
                    setIdMeja("")
                    setIdMenu("")
                    setJumlah("")
                    setNamaPelanggan("")
                    setDetailTransaksi([])

                    // recall get transaksi
                    getTransaksi()

                    // recall meja
                    getMeja()
                })
                .catch(error => console.log(error))
        }
    }

    const handleDelete = item => {
        if (window.confirm(`Hapus data?`)) {
            const url = `${baseURL}/transaksi/${item.id_transaksi}`
            axios.delete(url, header)
                .then(response => getTransaksi())
                .catch(error => console.log(error))
        }
    }

    const handleCetak = item => {
        setSelectedItem({ ...item })
        setShowNota(true)
    }

    const handlePay = item => {
        if (window.confirm(`Bayar sekarang?`)) {
            const url = `${baseURL}/transaksi/${item.id_transaksi}`
            const payload = {
                ...item, status: "lunas"
            }

            axios.put(url, payload, header)
                .then(response => getTransaksi())
                .catch(error => console.log(error))
        }
    }

    const handleFilter = (filterBy) => {
        if (filterBy === 'keyword') {
            setFilterTanggal("")
            let filterData = transaksi.filter((trans) => {
                if (USER.role === 'kasir') {
                    return trans.nama_pelanggan.includes(keyword)
                } else {
                    return trans.user.nama_user.includes(keyword)
                }
            })
            // Lakukan sesuatu dengan data yang sudah difilter
            setFilteredData(filterData);
        }

        if (filterBy === 'date') {
            setKeyword("")

            // tanda T setelah tanggal di inspeksi, split ngebagi tanggal sama angka setelah T jadi 2 index = 0 sama 1 trus [0] brati diambil index 0 
            let filterData = transaksi.filter((trans) => {
                // let tgl_transaksi = new Date(trans.tgl_transaksi).toISOString().split('T')[0];
                let tgl_transaksi = trans.tgl_transaksi.substring(0, 10)
                return tgl_transaksi === filterTanggal
            })
            // Lakukan sesuatu dengan data yang sudah difilter
            setFilteredData(filterData);
        }

    };

    // console.log(filteredData);

    async function searching(e) {
        try {
            // jika tekan tombol enter(13) 
            if (e.keyCode == 13) {
                // let url = `${baseURL}/transaksi/find`
                // let dataSearch = { keyword: keyword }
                // let { data } = await axios.post(url, dataSearch, header)
                // setTransaksi(data.data)
                handleFilter("keyword")
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleFilter("date")
    }, [filterTanggal])

    useEffect(() => {
        let total = 0
        for (let index = 0; index < filteredData.length; index++) {
            for (let indexDetail = 0; indexDetail < filteredData[index].detail_transaksi.length; indexDetail++) {
                total += filteredData[index].detail_transaksi[indexDetail].jumlah * filteredData[index].detail_transaksi[indexDetail].harga
            }
        }
        setPendapatan(total)
    }, [filteredData])

    useEffect(() => {
        getTransaksi()
        getMeja()
        getMenu()


        // register modal
        setModal(new Modal(`#modal-transaksi`))

        const user = JSON.parse(localStorage.getItem("user"))
        setRole(user.role);
    }, [])

    useEffect(() => {
        if (selectedItem) {
            toPDF()
            setShowNota(false)
        }
    }, [selectedItem])

    return (
        <div className="w-100 p-0">
            <h1 style={{ marginLeft: '10px', color: '#526D82' }}>Data Transaksi</h1>

            <div className="row">

                <div className="col-md-4">
                    <input type="text"
                        className='form-control my-2 mx-2 w-4/6'
                        value={keyword}
                        onKeyUp={e => searching(e)}
                        onChange={e => setKeyword(e.target.value)} />
                </div>

                <div className="col-md-4">
                    <input type="date"
                        className='form-control my-2 w-4/6'
                        value={filterTanggal}
                        onChange={e => setFilterTanggal(e.target.value)} />
                </div>

                <div className="col-md-4">
                    <h5 className="text-info">Total Pendapatan</h5> 
                    <h5 className="fw-bold">{pendapatan}</h5>
                </div>

            </div>

            <button className={`btn my-2 ms-2 ${['kasir'].includes(role) ? 'd-block' : 'd-none'}`} style={{ backgroundColor: "#526D82", color: "white" }} onClick={() => {
                modal.show()
                let today = new Date(new Date()).toISOString().substring(0, 10)
                console.log(today);
                setTglTransaksi(today)
            }}>
                Transaksi Baru
            </button>

            <div className="p-2">
                <ul className="list-group">
                    {filteredData.map((item, index) => (
                        <li className="list-group-item" key={`tran${index}`}>
                            <div className="row">
                                <div className="col-md-3">
                                    <small className="text-info">
                                        Tgl. Transaksi
                                    </small> <br />
                                    {item.tgl_transaksi}
                                </div>

                                <div className="col-md-3">
                                    <small className="text-info">
                                        Nama Kasir
                                    </small> <br />
                                    {item.user.nama_user}
                                </div>

                                <div className="col-md-3">
                                    <small className="text-info">
                                        Nama Pelanggan
                                    </small> <br />
                                    {item.nama_pelanggan}
                                </div>

                                <div className="col-md-3">
                                    <small className="text-info">
                                        No. Meja
                                    </small> <br />
                                    {item.meja.nomor_meja}
                                </div>

                                <div className="col-md-3">
                                    <small className="text-info">
                                        Total
                                    </small> <br></br>
                                    {item.detail_transaksi.reduce((sum, obj) => Number(sum) + (obj["jumlah"] * obj["harga"]), 0)}
                                </div>

                                <div className="col-md-3">
                                    <small className="text-info">
                                        Status
                                    </small> <br />
                                    <span className={`badge ${item.status === 'belum_bayar' ? 'bg-danger' : 'bg-success'}`}>
                                        {item.status}
                                    </span>
                                    <br></br>

                                    {item.status === 'belum_bayar' ?
                                        <>
                                            <button className={`btn btn-sm btn-info ${['kasir'].includes(role) ? 'd-block' : 'd-none'}`} onClick={() => handlePay(item)}>
                                                PAY
                                            </button>
                                        </> : <></>}
                                </div>

                                <div className={`col-md-3 ${['admin', 'kasir'].includes(role) ? 'd-block' : 'd-none'}`}>
                                    <small className="text-info">
                                        Action
                                    </small> <br></br>

                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item)}>
                                        &times;
                                    </button>

                                    <button className="btn btn-sm mx-1 btn-success" onClick={() => handleCetak(item)}>
                                        CETAK
                                    </button>
                                </div>

                            </div>

                            <br />

                            {/* list dari menu yang dipesan */}
                            <div className="row p-2">
                                Detail Pesanan:
                                <ul className="list-group">
                                    {item.detail_transaksi.map((detail) => (
                                        <li className="list-group-item" key={`detailP${detail.id_detail_transaksi}`}>
                                            <div className="row">
                                                {/* tampilkam nama pesanan */}
                                                <div className="col-md-3">
                                                    <small className="text-info">Menu</small><br />
                                                    {detail.menu.nama_menu}
                                                </div>

                                                {/* jumlah pesanan */}
                                                <div className="col-md-3">
                                                    <small className="text-info">Jumlah</small><br />
                                                    Qty: {detail.jumlah}
                                                </div>

                                                {/* harga satuan */}
                                                <div className="col-md-3">
                                                    <small className="text-info">Harga</small><br />
                                                    @{detail.harga}
                                                </div>

                                                {/* total */}
                                                <div className="col-md-3">
                                                    <small className="text-info">Total</small><br />
                                                    Rp {Number(detail.harga) * Number(detail.jumlah)}
                                                </div>


                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* print NOTA */}
            <div ref={targetRef} style={{ display: showNota ? 'block' : 'none' }}>
                <div className="w-100">
                    <h1 className="text-center">WIKU WARUNK</h1>
                    <h6 className="text-center">Jl. Danau Ranau No.1</h6>
                    Date: {selectedItem?.tgl_transaksi}<br></br>
                    Nama Pelanggan: {selectedItem?.nama_pelanggan} <br></br>
                    No. Meja: {selectedItem?.meja.nomor_meja}<br></br>
                    <hr></hr>
                    Menu: <br></br>
                    <ul className="list-group">
                        {selectedItem?.detail_transaksi.map((detail) => (
                            <li className="list-group-item border-0" key={`detail_nota${selectedItem?.id_detail_transaksi}`}>
                                <div className="row">
                                    {/* tampilkam nama pesanan */}
                                    <div className="col-md-3">
                                        {detail.menu.nama_menu}
                                    </div>

                                    {/* jumlah pesanan */}
                                    <div className="col-md-3">
                                        Qty: {detail.jumlah}
                                    </div>

                                    {/* harga satuan */}
                                    <div className="col-md-3">
                                        @{detail.harga}
                                    </div>

                                    {/* total */}
                                    <div className="col-md-3">
                                        Rp {Number(detail.harga) * Number(detail.jumlah)}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="row">
                        <div className="col-md-9"></div>
                        <div className="col-md-3">
                            <small className="text-info fw-bold">
                                Total
                            </small> <br></br>
                            Rp  {selectedItem?.detail_transaksi.reduce((sum, obj) => Number(sum) + (obj["jumlah"] * obj["harga"]), 0)}
                        </div>
                    </div>
                </div>
            </div>

            {/* modal for form add transaksi */}
            <div className="modal fade" id="modal-transaksi">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleSaveTransaksi}>
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    Form Transaksi
                                </h4>
                                <small>Tambahkan pesanan anda</small>
                            </div>

                            <div className="modal-body">
                                {/* customer */}
                                <div className="row">
                                    <div className="col-md-4">
                                        <small className="text-info">Nama Pelanggan</small>
                                        <input type="text" className="form-control mb-2" value={nama_pelanggan} onChange={e => setNamaPelanggan(e.target.value)}></input>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-info">Pilih Meja</small>
                                        <select className="form-control mb-2" value={id_meja} onChange={e => setIdMeja(e.target.value)}>
                                            <option value="">---Pilih Meja---</option>
                                            {meja.map(table => (
                                                <option value={table.id_meja} key={`keyMeja${table.id_meja}`}>
                                                    Nomor Meja {table.nomor_meja}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-info">
                                            Tgl Transaksi
                                        </small>
                                        <input type="date" className="form-control mb-2" value={tgl_transaksi} onChange={e => setTglTransaksi(e.target.value)}></input>
                                    </div>
                                </div>

                                {/* choose menu */}
                                <div className="row">
                                    <div className="col-md-8">
                                        <small className="text-info">
                                            Pilih Menu
                                        </small>
                                        <select className="form-control mb-2" value={id_menu} onChange={e => setIdMenu(e.target.value)}>
                                            <option value="">Pilih Menu</option>
                                            {menu.map((item, index) => (
                                                <option value={item.id_menu} key={`keyMenu${index}`}>
                                                    {item.nama_menu}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <small className="text-info">
                                            Jumlah
                                        </small>
                                        <input type="number" className="form-control mb-2" value={jumlah} onChange={e => setJumlah(e.target.value)}></input>
                                    </div>

                                    <div className="col-md-2">
                                        <small className="text-info">
                                            Action
                                        </small><br />
                                        <button className="btn btn-sm btn-success" type="button" onClick={() => addMenu()}>
                                            ADD
                                        </button>
                                    </div>

                                </div>

                                {/* detail order */}
                                <div className="row">
                                    <h5>Detail Pesanan:</h5>
                                    <ul className="list-group">
                                        {detail_transaksi.map((detail) => (
                                            <li className="list-group-item" key={`detailMenu${detail.id_menu}`}>
                                                <div className="row">
                                                    {/* tampilkam nama pesanan */}
                                                    <div className="col-md-3">
                                                        <small className="text-info">Menu</small><br />
                                                        {detail.nama_menu}
                                                    </div>

                                                    {/* jumlah pesanan */}
                                                    <div className="col-md-3">
                                                        <small className="text-info">Jumlah</small><br />
                                                        Qty: {detail.jumlah}
                                                    </div>

                                                    {/* harga satuan */}
                                                    <div className="col-md-3">
                                                        <small className="text-info">Harga</small><br />
                                                        @{detail.harga}
                                                    </div>

                                                    {/* total */}
                                                    <div className="col-md-3">
                                                        <small className="text-info">Total</small><br />
                                                        Rp {Number(detail.harga) * Number(detail.jumlah)}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button type="submit" className="w-100 btn btn-success my-2">
                                    Simpan
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transaksi