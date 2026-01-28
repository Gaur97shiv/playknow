import { REWARD_CONFIG } from "../../config/rewardConfig.js";

export const getCurrentHour = () => {
    return new Date().getHours();
};

export const isFreezePeriod = () => {
    const currentHour = getCurrentHour();
    const freezeStart = REWARD_CONFIG.FREEZE_START_HOUR;
    const activeStart = REWARD_CONFIG.ACTIVE_START_HOUR;
    
    return currentHour >= freezeStart && currentHour < activeStart;
};

export const getTimeUntilActiveStart = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    const activeStart = REWARD_CONFIG.ACTIVE_START_HOUR;
    
    if (currentHour >= activeStart) {
        return 0;
    }
    
    const hoursRemaining = activeStart - currentHour - 1;
    const minutesRemaining = 60 - currentMinutes;
    const secondsRemaining = 60 - currentSeconds;
    
    return (hoursRemaining * 3600) + (minutesRemaining * 60) + secondsRemaining;
};

export const getTimeUntilFreeze = () => {
    const now = new Date();
    const freezeStart = REWARD_CONFIG.FREEZE_START_HOUR;
    const activeStart = REWARD_CONFIG.ACTIVE_START_HOUR;
    
    let targetTime = new Date(now);
    
    if (now.getHours() >= activeStart) {
        targetTime.setDate(targetTime.getDate() + 1);
    }
    
    targetTime.setHours(freezeStart, 0, 0, 0);
    
    const timeDiff = targetTime - now;
    return Math.max(0, Math.floor(timeDiff / 1000));
};

export const getCurrentFreezePeriod = () => {
    const now = new Date();
    const freezeStart = REWARD_CONFIG.FREEZE_START_HOUR;
    
    if (now.getHours() < freezeStart) {
        return now.toISOString().split('T')[0];
    }
    
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
};

export const getActiveWindowStart = () => {
    const now = new Date();
    const activeStart = REWARD_CONFIG.ACTIVE_START_HOUR;
    const freezeStart = REWARD_CONFIG.FREEZE_START_HOUR;
    
    const windowStart = new Date(now);
    
    if (now.getHours() < freezeStart) {
        windowStart.setDate(windowStart.getDate() - 1);
    }
    
    windowStart.setHours(activeStart, 0, 0, 0);
    return windowStart;
};

export const getActiveWindowEnd = () => {
    const now = new Date();
    const freezeStart = REWARD_CONFIG.FREEZE_START_HOUR;
    
    const windowEnd = new Date(now);
    
    if (now.getHours() >= freezeStart) {
        windowEnd.setDate(windowEnd.getDate() + 1);
    }
    
    windowEnd.setHours(freezeStart, 0, 0, 0);
    return windowEnd;
};

export const formatTimeRemaining = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
        hours,
        minutes,
        seconds: secs,
        formatted: `${hours}h ${minutes}m ${secs}s`
    };
};

export const getCycleInfo = () => {
    const isFrozen = isFreezePeriod();
    const timeUntilFreeze = getTimeUntilFreeze();
    const timeUntilActive = getTimeUntilActiveStart();
    const freezePeriod = getCurrentFreezePeriod();
    
    return {
        isFreezePeriod: isFrozen,
        currentPhase: isFrozen ? "freeze" : "active",
        timeUntilNextPhase: isFrozen ? timeUntilActive : timeUntilFreeze,
        timeUntilNextPhaseFormatted: formatTimeRemaining(isFrozen ? timeUntilActive : timeUntilFreeze),
        freezePeriod,
        activeWindowStart: getActiveWindowStart(),
        activeWindowEnd: getActiveWindowEnd()
    };
};
