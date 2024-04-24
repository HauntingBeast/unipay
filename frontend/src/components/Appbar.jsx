import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";
export const Appbar = ({ name, initial, userId }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };
  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">
        <b>UniPay</b>
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">{name}</div>
        <Link to={`/profile`}>
          <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
            <div className="flex flex-col justify-center h-full text-xl">
              {initial}
            </div>
          </div>
        </Link>
        {/* <Button onClick={handleLogout}>Logout</Button> */}
        <Button
          onClick={
            handleLogout
          }
          label={"Logout"}
        />
      </div>
    </div>
  );
};
