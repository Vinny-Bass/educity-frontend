import type { Activity } from "@/features/student/dashboard/types";
import { ActivityIcon } from "./ActivityIcon";
import { CoinIcon } from "./CoinIcon";

interface ActivityItemProps {
  activity: Activity;
  onClick?: () => void;
  hideRewards?: boolean;
}

export function ActivityItem({ activity, onClick, hideRewards = false }: ActivityItemProps) {
  const isCompleted = activity.completed;
  
  // Determine the icon type based on activity type
  const iconType = activity.type === "standard" 
    ? activity.standardActivityType 
    : activity.type === "team"
    ? activity.teamActivityType
    : activity.type;

  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center p-4 h-[80px] rounded-[20px] transition-colors bg-[#FFFFFF] cursor-pointer hover:bg-[#9056F5] hover:text-white group"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white group-hover:bg-[#DCDBDE] transition-colors">
          <ActivityIcon type={iconType} className="w-6 h-6 text-[#9056F5] group-hover:text-[#0E0420] transition-colors" />
        </div>
        <span className="font-baloo text-[18px] leading-[20px]">{activity.title}</span>
      </div>
      {!hideRewards && (
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <div className="flex justify-center items-center w-16 px-[10px] py-[6px] bg-[#DCDBDE] rounded-[10px]">
              <span className="font-baloo text-[15px] text-[#87838F]">Done</span>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-1 w-16 px-[10px] py-[6px] bg-[#FFF4E3] rounded-[10px] group-hover:bg-[#9b67f6] transition-colors">
              <CoinIcon className="w-5 h-5" />
              <span className="font-baloo text-[15px] leading-[18px]">{activity.sendosReward}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
