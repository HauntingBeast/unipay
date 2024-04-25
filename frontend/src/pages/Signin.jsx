import { useState } from "react";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { BottomWarning } from "../components/BottomWarning";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
        username,
        password,
      });
      // Assuming the response contains a token for authentication
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user);
      toast.success("Login successful!"); // Add toast for successful login
      setTimeout(()=>{navigate(`/dashboard?userId=${response.data.user}`);},3000)
      
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error signing in:", error);
      // Handle error appropriately (e.g., display error message to user)
    }
  };
  

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            onChange={(e) => setUsername(e.target.value)}
            placeholder="sahil@iiita.ac.in"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            label={"Password"}
            type="password"
          />
          <div className="pt-4">
            <Button onClick={handleSignIn} label={"Sign in"} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};
