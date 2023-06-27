import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ModalCreate(props) {
  const [show, setShow] = useState(false);
  const [deskripsi, setDeskripsi] = useState("");
  const [nominal, setNominal] = useState(0);
  const [tanggal, setTanggal] = useState("");
  const [category, setCategory] = useState("");

  const handleClose = () => setShow(false, props.category);
  const handleShow = () => setShow(true, props.category);

  const resetForm = () => {
    setDeskripsi("");
    setNominal("");
    setTanggal("");
  };

  

  const tambahItem = (e) => {
    e.preventDefault();

    const data = {
      deskripsi: deskripsi,
      nominal: parseInt(nominal),
      tanggal: tanggal,
      category: props.category,
    };

    props.action(data);
    setShow(false, props.category);
    resetForm();
  };

  return (
    <>
      <button className={props.variant} onClick={handleShow}>
        {props.text} <i className={props.icon}></i>
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.modalHeading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan Deskripsi"
              name="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Nominal</Form.Label>
            <Form.Control
              type="number"
              placeholder="Masukkan Jumlah Uang Anda"
              name="nominal"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Tanggal</Form.Label>
            <Form.Control
              type="date"
              placeholder="Masukkan Tanggal"
              name="tanggal"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </Form.Group>
          <Form.Control
            type="hidden"
            placeholder={props.category}
            name="tanggal"
            value={category}
            onChange={handleShow}
          />
        </Modal.Body>
        <Modal.Footer>
          <button className={props.variant} onClick={tambahItem}>
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCreate;
