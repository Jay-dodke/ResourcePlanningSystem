import {useEffect, useState} from "react";
import API from "./api/axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/hello")
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>Client Connected to Server</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;
