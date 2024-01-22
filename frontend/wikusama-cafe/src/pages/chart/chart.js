import axios from "axios"
import { useState, useEffect } from "react"
import { ArcElement, Tooltip, Legend, Chart } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
const baseURL = "http://localhost:8000"
const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const Charts = () => {
    const [summary, setSummary] = useState([])
    Chart.register(ArcElement, Legend, Tooltip)

    async function getSummary() {
        let url = `${baseURL}/transaksi/chart`

        axios.get(url, header)
            .then(response => {
                setSummary(response.data.data)
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        getSummary()
    }, [])

    return (
        <div className="w-100 d-flex justify-content-center">
            <div className="my-5" style={{ height: '400px' }} >
                <h3 className="text-center">Top 5 Menu</h3>
                <Pie options={
                    {
                        maintainAspectRatio: false,
                        plugins: { legend: { display: true, position: "bottom" } }
                    }
                }
                    data={{
                        labels: summary.map(item => item.nama_menu),
                        datasets: [
                            {
                                data: summary.map(item => item.jumlah_beli),
                                backgroundColor: ['#FF8787', '#FEBE8C', '#B1B2FF', '#B6E2A1', '#AF7AB3']
                            }
                        ]
                    }}
                >

                </Pie>
            </div>
        </div>
    )
}
export default Charts