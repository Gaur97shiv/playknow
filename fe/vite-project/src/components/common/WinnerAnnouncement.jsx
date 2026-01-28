import { Link } from "react-router-dom";
import useWinners from "../../hooks/useWinners";

const WinnerAnnouncement = () => {
    const { winners, isLoading } = useWinners(3);

    if (isLoading) {
        return (
            <div className="right-panel-card p-4 rounded animate-pulse">
                <div className="h-32 bg-clay/30 rounded"></div>
            </div>
        );
    }

    if (!winners || winners.length === 0) {
        return null;
    }

    const latestWinner = winners[0];

    return (
        <div className="right-panel-card rounded overflow-hidden mt-4">
            <div className="vintage-header p-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <span className="font-bold text-sm">Recent Winners</span>
                </div>
            </div>
            
            <div className="p-4">
                {latestWinner?.topPost && (
                    <div className="vintage-card-raised p-3 rounded mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🥇</span>
                            <span className="text-xs text-soil">Top Post Winner</span>
                        </div>
                        <Link 
                            to={`/profile/${latestWinner.topPost.user?.name}`}
                            className="flex items-center gap-2"
                        >
                            <div className="avatar">
                                <div className="w-8 rounded-full avatar-vintage overflow-hidden">
                                    <img src={latestWinner.topPost.user?.profileImg || "/avatar-placeholder.png"} />
                                </div>
                            </div>
                            <div>
                                <div className="font-bold text-bark text-sm">
                                    {latestWinner.topPost.user?.name || "Unknown"}
                                </div>
                                <div className="text-xs text-rust font-bold">
                                    Won {latestWinner.topPost.reward} coins!
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
                
                <div className="text-xs text-soil text-center">
                    <div className="font-bold mb-1">Pool Stats</div>
                    <div>Total Distributed: {latestWinner?.totalDistributed || 0} coins</div>
                    <div>Liker Rewards: {latestWinner?.totalLikerRewards || 0} coins</div>
                </div>
                
                {winners.length > 1 && (
                    <div className="mt-3 pt-3 border-t-2 border-clay">
                        <div className="text-xs text-soil font-bold mb-2">Previous Winners</div>
                        {winners.slice(1).map((winner, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1">
                                <span className="text-soil">{winner.freezePeriod}</span>
                                <span className="text-rust font-bold">{winner.totalDistributed} coins</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WinnerAnnouncement;
