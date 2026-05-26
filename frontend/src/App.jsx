import { useEffect } from "react";
import api from "./services/api";

function App() {

  useEffect(() => {
    api.get("/test")
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Universidad</h1>
    </div>
  );
}

export default App;