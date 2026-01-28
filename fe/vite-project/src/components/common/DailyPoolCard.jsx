import { useState, useEffect } from "react";
import useCycleStatus from "../../hooks/useCycleStatus";
import useDailyPool from "../../hooks/useDailyPool";

const DailyPoolCard = () => {
    const { cycleStatus, isLoading } = useCycleStatus();
    const { dailyPool } = useDailyPool();
    const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!cycleStatus?.cycle?.timeUntilNextPhase) return;

        let timeRemaining = cycleStatus.cycle.timeUntilNextPhase;

        const timer = setInterval(() => {
            timeRemaining = Math.max(0, timeRemaining - 1);
            
            const hours = Math.floor(timeRemaining / 3600);
            const minutes = Math.floor((timeRemaining % 3600) / 60);
            const seconds = timeRemaining % 60;
            
            setCountdown({ hours, minutes, seconds });
            
            if (timeRemaining <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [cycleStatus?.cycle?.timeUntilNextPhase]);

    if (isLoading) {
        return (
            <div className="right-panel-card p-4 rounded animate-pulse">
                <div className="h-20 bg-clay/30 rounded"></div>
            </div>
        );
    }

    const isFreeze = cycleStatus?.cycle?.isFreezePeriod;
    const pool = dailyPool?.total_pool_coins || cycleStatus?.pool?.total_pool_coins || 0;
    const postsCount = dailyPool?.posts_count || cycleStatus?.pool?.posts_count || 0;

    return (
        <div className="right-panel-card rounded overflow-hidden">
            <div className={`p-3 ${isFreeze ? "bg-rust" : "vintage-header"}`}>
                <div className="flex items-center justify-between">
                    <span className="text-lg">🏆</span>
                    <span className="font-bold text-sm">
                        {isFreeze ? "EVALUATION IN PROGRESS" : "Daily Prize Pool"}
                    </span>
                </div>
            </div>
            
            <div className="p-4 bg-gradient-to-b from-clay/20 to-transparent">
                <div className="text-center">
                    <div className="text-3xl font-bold text-rust mb-1">
                        💰 {pool} coins
                    </div>
                    <div className="text-xs text-soil">
                        from {postsCount} posts today
                    </div>
                </div>
                
                <div className="mt-4 vintage-card-inset p-3 rounded">
                    <div className="text-xs text-soil text-center mb-2">
                        {isFreeze ? "Active period starts in:" : "Evaluation starts in:"}
                    </div>
                    <div className="flex justify-center gap-2">
                        <div className="vintage-btn px-3 py-1 text-center min-w-[50px]">
                            <div className="text-lg font-bold text-bark">{String(countdown.hours).padStart(2, '0')}</div>
                            <div className="text-xs text-soil">hrs</div>
                        </div>
                        <span className="text-xl font-bold text-bark self-center">:</span>
                        <div className="vintage-btn px-3 py-1 text-center min-w-[50px]">
                            <div className="text-lg font-bold text-bark">{String(countdown.minutes).padStart(2, '0')}</div>
                            <div className="text-xs text-soil">min</div>
                        </div>
                        <span className="text-xl font-bold text-bark self-center">:</span>
                        <div className="vintage-btn px-3 py-1 text-center min-w-[50px]">
                            <div className="text-lg font-bold text-bark">{String(countdown.seconds).padStart(2, '0')}</div>
                            <div className="text-xs text-soil">sec</div>
                        </div>
                    </div>
                </div>
                
                {isFreeze && (
                    <div className="mt-3 marquee-style text-center py-2 rounded">
                        ⚠️ Posting disabled during evaluation ⚠️
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyPoolCard;
