import {useEffect, useState} from "react";
import API from "./api/axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const helloKey = import.meta.env.VITE_HELLO_KEYS;

    API.get("/hello", {params: {hello: helloKey}})
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
