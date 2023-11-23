import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "100px",
        height: "100px",
        margin: "25px auto",
        display: "block",
        textAlign: "center",
        color: "white",
      }}
    ></Spinner>
  );
};

export default Loader;