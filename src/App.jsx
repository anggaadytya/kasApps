import { useEffect, useState } from "react";
import ModalCreate from "./components/Modal";
import Alert from "./components/Alert";
import axios from "axios";

import "./App.css";

function App() {
  const [sisaUang, setSisaUang] = useState(0);
  const [persentaseUang, setPersentaseUang] = useState(0);
  const [pemasukanUang, setPemasukanUang] = useState(0);
  const [pengeluaranUang, setPengeluaranUang] = useState(0);
  const [transaksiIn, setTransaksiIn] = useState(0);
  const [transaksiOut, setTransaksiOut] = useState(0);
  const [summary, setSummary] = useState([]);

  const postData = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/summary",
        data
      );
      const savedSummary = response.data;

      const newData = [...summary, savedSummary];
      setSummary(newData);
      localStorage.setItem("summary", JSON.stringify(newData));
      const dataUangIn = newData.filter((items) => items.category === "IN");
      const nominalUangIn = dataUangIn.map((items) => items.nominal);
      const jumlahUangIn = nominalUangIn.reduce((total, num) => total + num, 0);

      const dataUangOut = newData.filter((items) => items.category === "OUT");
      const nominalUangOut = dataUangOut.map((items) => items.nominal);
      const jumlahUangOut = nominalUangOut.reduce(
        (total, num) => total + num,
        0
      );

      setPemasukanUang(jumlahUangIn);
      setTransaksiIn(nominalUangIn.length);

      setPengeluaranUang(jumlahUangOut);
      setTransaksiOut(nominalUangOut.length);

      setSisaUang(jumlahUangIn - jumlahUangOut);
      setPersentaseUang(((jumlahUangIn - jumlahUangOut) / jumlahUangIn) * 100); // Panggil fungsi hitung setelah menyimpan data baru
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async () => {
    try {
      const storedSummary = localStorage.getItem("summary");
      if (storedSummary) {
        setSummary(JSON.parse(storedSummary));
        hitung();
      } else {
        const response = await axios.get("http://localhost:8000/api/summary");
        const data = response.data;
        if (data.length === 0) {
          localStorage.removeItem("summary"); // Hapus data di penyimpanan lokal
        } else {
          setSummary(data);
          localStorage.setItem("summary", JSON.stringify(data));
          hitung();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const hitung = () => {
    const dataUangIn = summary.filter((items) => items.category === "IN");
    const nominalUangIn = dataUangIn.map((items) => items.nominal);
    const jumlahUangIn = nominalUangIn.reduce((total, num) => total + num, 0);

    const dataUangOut = summary.filter((items) => items.category === "OUT");
    const nominalUangOut = dataUangOut.map((items) => items.nominal);
    const jumlahUangOut = nominalUangOut.reduce((total, num) => total + num, 0);

    setPemasukanUang(jumlahUangIn);
    setTransaksiIn(nominalUangIn.length);

    setPengeluaranUang(jumlahUangOut);
    setTransaksiOut(nominalUangOut.length);

    setSisaUang(jumlahUangIn - jumlahUangOut);
    setPersentaseUang(((jumlahUangIn - jumlahUangOut) / jumlahUangIn) * 100);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    hitung();
  }, [summary]);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1>KAS APPS</h1>
          <hr className="w-60 mx-auto" />
          <h2>Rp. {sisaUang} ,-</h2>
          <span className="title-md">
            Sisa uang kamu tinggal {persentaseUang}% lagi loh
          </span>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-6">
          <div className="card-wrapper p-4">
            <div className="icon-wrapper-in mb-1">
              <i className="bi bi-wallet2"></i>
            </div>
            <span className=" title-sm">Pemasukkan</span>
            <h3>Rp. {pemasukanUang} ,-</h3>
            <div>
              <span className="title-sm text-ungu fw-bold me-2">
                {transaksiIn}
              </span>
              <span className="title-sm">Transaksi</span>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="card-wrapper p-4">
            <div className="icon-wrapper-out mb-1">
              <i className="bi bi-cash-stack"></i>
            </div>
            <span className=" title-sm">Pengeluaran</span>
            <h3>Rp. {pengeluaranUang} ,-</h3>
            <div>
              <span className="title-sm text-ungu fw-bold me-2">
                {transaksiOut}
              </span>
              <span className="title-sm">Transaksi</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h4>Ringkasan Transaksi</h4>
          <div className="wrapper-button d-flex">
            <ModalCreate
              action={postData}
              category="IN"
              variant="button btn-ungu"
              text="Pemasukkan"
              icon="bi bi-plus-circle-fill"
              modalHeading="Tambahkan Pemasukan"
            />
            <ModalCreate
              action={postData}
              category="OUT"
              variant="button btn-pink"
              text="Pengeluaran"
              icon="bi bi-dash-circle-fill"
              modalHeading="Tambahkan Pengeluaran"
            />
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {summary.length < 1 && <Alert />}
        {summary.map((sum, index) => {
          return (
            <div
              key={index}
              className="mb-3 col-12 d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <div
                  className={
                    sum.category === "IN"
                      ? "icon-wrapper-in"
                      : "icon-wrapper-out"
                  }
                >
                  <i
                    className={
                      sum.category === "IN" ? "bi bi-wallet2" : "bi bi-bag-dash"
                    }
                  ></i>
                </div>

                <div className="transaction ms-3 d-flex flex-column">
                  <h6>{sum.deskripsi}</h6>
                  <span className="title-sm">{sum.tanggal}</span>
                </div>
              </div>
              <h5 className={sum.category === "IN" ? "money-in" : "money-out"}>
                Rp. {sum.nominal}
              </h5>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
