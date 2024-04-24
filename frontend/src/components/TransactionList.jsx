export const TransactionsList = ({ transactions }) => {
  // Check if transactions is not an array or is null/undefined
  
  if (!Array.isArray(transactions)) {
    console.log('====================================');
  console.log(transactions);
  console.log('====================================');
      return `<p>No transactions available </p>`
  }
  return (
    <div>
      <h2>Transactions</h2>
    </div>
  );
};

