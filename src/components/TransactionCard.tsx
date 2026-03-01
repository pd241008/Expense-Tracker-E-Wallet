// Assuming this is your TransactionCard component structure
interface Transaction {
  _id: string;
  amount: number;
  description: string;
  // ... other properties
}

interface TransactionCardProps {
  tx: Transaction;
  // 💡 NEW PROP
  onDelete: (txId: string) => void;
}

export function TransactionCard({ tx, onDelete }: TransactionCardProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
      <div>
        <p className="font-semibold text-lg">{tx.description}</p>
        <p className="text-gray-400">${tx.amount.toFixed(2)}</p>
      </div>

      {/* 💡 NEW DELETE BUTTON */}
      <button
        onClick={() => onDelete(tx._id)}
        className="text-red-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-700"
        aria-label="Delete transaction">
        {/* Replace with a proper icon (e.g., trash icon) */}
        🗑️
      </button>
    </div>
  );
}
