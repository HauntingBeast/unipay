import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  // const userId = localStorage.getItem("userId");
  const [userName, setUserName] = useState(null);
  const [ff,setFf]=useState(null);

  // const tmp = localStorage.getItem("userId");
  // console.log('====================================');
  // console.log(tmp);
  // console.log('====================================');
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance?userId=" + userId)
      .then((response) => {
        setBalance(response.data.balance);
      });
    axios
      .get("http://localhost:3000/api/v1/user/about/" + userId)
      .then((response) => {
        var nameOfUser = response.data.user.firstName;
        if (response.data.user.lastName != null)
          nameOfUser = nameOfUser + " " + response.data.user.lastName;
        setUserName(nameOfUser);
        setFf(nameOfUser.charAt(0));
      });
  }, []);
  return (
    <div>
      <Appbar name={userName} initial={ff} userId={userId}/>
      <div className="m-8">
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};
