import { useEffect, useState } from "react";
import { AboutPage } from "../components/AboutPage";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export const About = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [apnaQr,setApnaQr]=useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/about/" + userId)
      .then((response) => {
        setUser(response.data.user);
      });
      axios
      .get("http://localhost:3000/api/v1/user/qr/" + userId)
      .then((response) => {
        if(response.data!=null){
        console.log('====================================');
        console.log(response.data);
        setApnaQr(response.data);
        console.log('====================================');
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, []);
  return (
    <div>
      <AboutPage user={user}/>
      <img src={apnaQr} alt="QR Code"></img>
    </div>
  );
};
