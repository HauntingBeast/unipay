export const AboutPage = ({ user }) => {
    // Check if user object exists
    if (!user) {
      return <div>Loading...</div>;
    }
  
    // Destructure user object to access its properties
    const { firstName, lastName, username } = user;
  
    return (
      <div>
        <div className="shadow h-14 flex justify-between">
          <div className="flex flex-col justify-center h-full ml-4">
            <b>UniPay</b>
          </div>
          {/* Add logo or other elements as needed */}
        </div>
        <div>
          <strong>Name:</strong> {firstName} {lastName}
        </div>
        <div>
          <strong>Email:</strong> {username}
        </div>
      </div>
    );
  };
  