import { useEffect, useState } from "react";
import axios from "axios";

export const Profile = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [s,sets]=useState(null);
  const [firstName, setFirstName] = useState(""); // Changed from name to firstName
  const [lastName, setLastName] = useState(""); // Changed from email to lastName
  const [email, setEmail] = useState("");
  //   const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch profile details
    axios
      .get("http://localhost:3000/api/v1/user/about/" + userId)
      .then((response) => {
        setUser(response.data.user);
      });
    // Fetch user balance
    axios
      .get("http://localhost:3000/api/v1/account/balance?userId=" + userId)
      .then((response) => {
        setBalance(response.data.balance);
      });
    axios
      .get("http://localhost:3000/api/v1/user/transactions/" + userId)
      .then((response) => {
        // console.log("Transactions:", response.data);
        if(response.data!=null){
        // sets(response.data[0]);
        setTransactions(response.data.transactions);
        console.log(response.data.transactions[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
    const checkLoggedIn = async () => {
      try {
        // Example: Check if there's a valid authentication token in local storage
        const token = localStorage.getItem("token");
        if (!token) {
          console.log(token);
          window.location.href = "/signin";
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkLoggedIn();
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        "http://localhost:3000/api/v1/user/update",
        {
          firstName: firstName,
          lastName: lastName,
          username: email,
        },
        config
      );
      console.log(response.data);
      setUser(response.data); // Update user details in state with updated data
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <div>
          <h3>User Details</h3>
          <p>Name: {user.firstName + " " + user.lastName}</p>
          <p>Email: {user.username}</p>
          {/* Add more user details as needed */}
        </div>
      )}
      {balance && (
        <div>
          <h3>Balance: {balance}</h3>
        </div>
      )}
      <form onSubmit={handleUpdateProfile}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
          }}
        >
          Update Profile
        </button>
      </form>
      {/* <div>
        {transactions &&
          transactions.map((t) => (
            <Transaction
              receiver={t.receiver.firstName}
              amount={t.amount}
              time={t.timestamp}
            />
          ))}
      </div> */}
      <div>
          <div>
            {transactions.map((t,index) => (
              <Transaction
                key={index} // Make sure each Transaction component has a unique key
                sender={t.sender}
                receiver={t.receiver.firstName}
                amount={t.amount}
                time={t.timestamp}
              />
            ))}
          </div>
        {/* {transactions[0].sender} */}
      </div>
    </div>
  );
};
// function Transaction({ sender, receiver, amount, timestamp }) {
//   return (
//     <div className="flex justify-center"> {/* Centering container */}
//       <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
//         <div className="flex flex-col justify-center h-full text-xl">
//           <p>Sender: {sender}</p>
//           <p>Receiver: {receiver}</p>
//           <p>Amount: {amount}</p>
//           <p>Timestamp: {timestamp}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

function Transaction({ sender, receiver, amount, time }) {
  // Parse timestamp to Date object
  const date = new Date(time);

  // Format date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Format time
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const apnaTime = day + "-" + month + "-" + year + " " +hours + ":" +minutes;
  console.log('====================================');
  console.log(apnaTime);
  console.log('====================================');
  return (
    <div className="flex justify-center mb-4">
      <div className="bg-gray-200 rounded-lg p-4 shadow-md w-64">
        <p className="text-lg font-semibold">Transaction Details</p>
        <hr className="my-2" />
        <p><span className="font-semibold">Sender:</span> {sender}</p>
        <p><span className="font-semibold">Receiver:</span> {receiver}</p>
        <p><span className="font-semibold">Amount:</span> {amount}</p>
        <p><span className="font-semibold">Time:</span> {apnaTime}</p>
      </div>
    </div>
  );
}


