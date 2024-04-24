import { useEffect, useState } from "react";
import { AboutPage } from "../components/AboutPage";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export const About = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/about/" + userId)
      .then((response) => {
        setUser(response.data.user);
      });
  }, []);
  return (
    <div>
      <AboutPage user={user}/>
    </div>
  );
};
