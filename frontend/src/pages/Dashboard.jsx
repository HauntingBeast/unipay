import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useSearchParams } from 'react-router-dom';
import axios from "axios";

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");

    useEffect(() => {
        console.log("here before");
        axios.get("http://localhost:3000/api/v1/account/balance?userId=" + userId)
            .then(response => {
                console.log(response.data);
                setBalance(response.data.balance)
            })
        console.log("here after");
    }, [])

    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}