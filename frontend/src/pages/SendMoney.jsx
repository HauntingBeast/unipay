import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SendMoney = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const userId = localStorage.getItem("userId");
  const [userName, setUserName] = useState(null);
  const [amount, setAmount] = useState(0);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/about/" + id)
      .then((response) => {
        setUserName(
          response.data.user.firstName + " " + response.data.user.lastName
        );
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  const handleTransfer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(
      "http://localhost:3000/api/v1/account/transfer",
      {
        to: id,
        amount: amount,
        password: password,
      },
      config
    );
    toast(res.data.message);
    setTimeout(()=>{navigate(-1)},3000)
  };

  return (
    <div class="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div class="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div class="flex flex-col space-y-1.5 p-6">
            <h2 class="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div class="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                {userName ? (
                  <span className="text-2xl text-white">{userName[0]}</span>
                ) : null}
              </div>
              <h3 className="text-2xl font-semibold">{userName}</h3>
            </div>
            <div class="space-y-4">
              <div class="space-y-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  type="number"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                />
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="password"
                  placeholder="Enter password"
                />
              </div>
              <button
                onClick={handleTransfer}
                class="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
              >
                Initiate Transfer
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
