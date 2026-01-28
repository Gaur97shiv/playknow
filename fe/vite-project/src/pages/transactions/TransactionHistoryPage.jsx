import { useState } from "react";
import useTransactions, { useTransactionSummary } from "../../hooks/useTransactions";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const TransactionHistoryPage = () => {
    const [filter, setFilter] = useState(null);
    const { transactions, isLoading, total } = useTransactions({ type: filter });
    const { summary, isLoading: summaryLoading } = useTransactionSummary();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "post": return "📝";
            case "comment": return "💬";
            case "like": return "❤️";
            case "reward": return "🏆";
            case "refund": return "↩️";
            case "penalty": return "⚠️";
            case "signup_bonus": return "🎁";
            default: return "💰";
        }
    };

    const getDirectionColor = (direction) => {
        return direction === "credit" ? "text-moss" : "text-rust";
    };

    return (
        <div className="flex-[4_4_0] border-r-4 border-soil min-h-screen bg-sand">
            <div className="vintage-header p-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h1 className="font-bold text-lg">Transaction History</h1>
                </div>
            </div>

            {!summaryLoading && summary && (
                <div className="p-4 border-b-4 border-soil bg-wheat">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="vintage-card-raised p-3 rounded">
                            <div className="text-xs text-soil font-bold mb-1">Total Earned</div>
                            <div className="text-lg font-bold text-moss">+{summary.totalCredits || 0} coins</div>
                        </div>
                        <div className="vintage-card-raised p-3 rounded">
                            <div className="text-xs text-soil font-bold mb-1">Total Spent</div>
                            <div className="text-lg font-bold text-rust">-{summary.totalDebits || 0} coins</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 border-b-4 border-soil bg-wheat">
                <div className="flex gap-2 flex-wrap">
                    <button
                        className={`vintage-btn text-xs px-3 py-1 rounded ${filter === null ? "vintage-btn-primary" : ""}`}
                        onClick={() => setFilter(null)}
                    >
                        All
                    </button>
                    <button
                        className={`vintage-btn text-xs px-3 py-1 rounded ${filter === "post" ? "vintage-btn-primary" : ""}`}
                        onClick={() => setFilter("post")}
                    >
                        Posts
                    </button>
                    <button
                        className={`vintage-btn text-xs px-3 py-1 rounded ${filter === "comment" ? "vintage-btn-primary" : ""}`}
                        onClick={() => setFilter("comment")}
                    >
                        Comments
                    </button>
                    <button
                        className={`vintage-btn text-xs px-3 py-1 rounded ${filter === "like" ? "vintage-btn-primary" : ""}`}
                        onClick={() => setFilter("like")}
                    >
                        Likes
                    </button>
                    <button
                        className={`vintage-btn text-xs px-3 py-1 rounded ${filter === "reward" ? "vintage-btn-primary" : ""}`}
                        onClick={() => setFilter("reward")}
                    >
                        Rewards
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center p-8 vintage-card-inset m-4 rounded">
                    <span className="text-4xl mb-4 block">📭</span>
                    <p className="text-bark font-bold">No transactions yet</p>
                    <p className="text-soil text-sm mt-1">Start posting to see your activity!</p>
                </div>
            ) : (
                <div className="divide-y-2 divide-soil">
                    {transactions.map((tx) => (
                        <div key={tx._id} className="p-4 hover:bg-wheat/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getTypeIcon(tx.type)}</span>
                                    <div>
                                        <div className="font-bold text-bark capitalize">{tx.type}</div>
                                        <div className="text-xs text-soil">{tx.description || `${tx.type} transaction`}</div>
                                        <div className="text-xs text-soil mt-1">{formatDate(tx.createdAt)}</div>
                                    </div>
                                </div>
                                <div className={`text-lg font-bold ${getDirectionColor(tx.direction)}`}>
                                    {tx.direction === "credit" ? "+" : "-"}{tx.amount} coins
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-4 text-center border-t-4 border-soil bg-wheat">
                <p className="text-xs text-soil">
                    Showing {transactions.length} of {total} transactions
                </p>
            </div>
        </div>
    );
};

export default TransactionHistoryPage;
