import { LeaderboardData } from "../../types";

interface LeaderboardViewProps {
  data: LeaderboardData;
  currentUserId: number;
}

const ANIMAL_EMOJIS = ["🐹", "🦆", "🦊", "🐞", "🐶", "🐵", "🐳", "🦁", "🐰", "🐌", "🐙"];

const ScoreIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="11" cy="11" r="11" fill="#FFD700" />
    <path
      d="M11 5L12.7634 9.27182L17.0557 9.60557L13.75 12.4427L14.7634 16.6382L11 14.3L7.23664 16.6382L8.25 12.4427L4.94427 9.60557L9.23664 9.27182L11 5Z"
      fill="#F0B90B"
    />
  </svg>
);

type LeaderboardEntry = LeaderboardData[number];

const cx = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(" ");

interface AvatarBubbleProps {
  emoji: string;
  sizeClass: string;
  emojiClass: string;
  className?: string;
}

const AvatarBubble = ({ emoji, sizeClass, emojiClass, className }: AvatarBubbleProps) => (
  <div className={cx("rounded-full bg-white flex items-center justify-center", sizeClass, className)}>
    <span className={emojiClass}>{emoji}</span>
  </div>
);

interface ScoreDisplayProps {
  score: number;
  className?: string;
  iconClass?: string;
  textClass?: string;
}

const ScoreDisplay = ({
  score,
  className = "flex items-center gap-1.5",
  iconClass = "w-5 h-5",
  textClass = "font-baloo text-[#87838F] text-lg",
}: ScoreDisplayProps) => (
  <div className={className}>
    <ScoreIcon className={iconClass} />
    <span className={textClass}>{score.toLocaleString()}</span>
  </div>
);

interface ScorePillProps {
  score: number;
  iconClass?: string;
  textClass?: string;
}

const ScorePill = ({
  score,
  iconClass = "w-4 h-4 md:w-5 md:h-5",
  textClass = "text-sm md:text-base",
}: ScorePillProps) => (
  <div className="flex items-center gap-1 bg-[#0E0420]/30 px-3 py-1 rounded-lg backdrop-blur-sm">
    <ScoreIcon className={iconClass} />
    <span className={textClass}>{score.toLocaleString()}</span>
  </div>
);

interface StudentRowProps {
  entry: LeaderboardEntry;
  emoji: string;
  containerClassName?: string;
  showMeTag?: boolean;
  nameClassName?: string;
  scoreTextClassName?: string;
}

const StudentRow = ({
  entry,
  emoji,
  containerClassName = "flex items-center justify-between",
  showMeTag = false,
  nameClassName = "font-baloo text-[#87838F] text-lg leading-none",
  scoreTextClassName = "font-baloo text-[#87838F] text-lg",
}: StudentRowProps) => (
  <div className={containerClassName}>
    <div className="flex items-center gap-3">
      <AvatarBubble
        emoji={emoji}
        sizeClass="w-12 h-12"
        emojiClass="text-2xl"
        className="border-2 border-gray-100 shrink-0 overflow-hidden"
      />
      <div className="flex flex-col">
        <span className={nameClassName}>{entry.student.firstName || "Student"}</span>
        {showMeTag && (
          <span className="bg-[#BE9AFF] text-white text-xs px-2 py-0.5 rounded-md w-fit mt-1">Me!</span>
        )}
      </div>
    </div>
    <ScoreDisplay score={entry.totalSendos} textClass={scoreTextClassName} />
  </div>
);

interface PodiumSlotConfig {
  key: string;
  entry?: LeaderboardEntry;
  wrapperClass: string;
  avatarSize: string;
  emojiSize: string;
  nameClass: string;
  scoreIconClass: string;
  scoreTextClass: string;
  avatarClassName?: string;
}

interface PodiumSpotProps extends Omit<PodiumSlotConfig, "key"> {
  getEmoji: (id: number) => string;
}

const PodiumSpot = ({
  entry,
  wrapperClass,
  avatarSize,
  emojiSize,
  nameClass,
  scoreIconClass,
  scoreTextClass,
  avatarClassName,
  getEmoji,
}: PodiumSpotProps) => (
  <div className="flex justify-center">
    {entry ? (
      <div className={cx("flex flex-col items-center relative", wrapperClass)}>
        <AvatarBubble
          emoji={getEmoji(entry.student.id)}
          sizeClass={avatarSize}
          emojiClass={emojiSize}
          className={cx("mb-2 relative shadow-lg", avatarClassName)}
        />
        <span className={cx("font-baloo text-white mb-1", nameClass)}>{entry.student.firstName || "Student"}</span>
        <ScorePill
          score={entry.totalSendos}
          iconClass={scoreIconClass}
          textClass={cx("font-baloo text-white", scoreTextClass)}
        />
      </div>
    ) : (
      <div className="w-full" />
    )}
  </div>
);

const getOrdinalSuffix = (rank: number) => {
  const remainderTen = rank % 10;
  const remainderHundred = rank % 100;

  if (remainderTen === 1 && remainderHundred !== 11) return "st";
  if (remainderTen === 2 && remainderHundred !== 12) return "nd";
  if (remainderTen === 3 && remainderHundred !== 13) return "rd";

  return "th";
};

export default function LeaderboardView({ data, currentUserId }: LeaderboardViewProps) {
  // Sort data by rank just in case
  const sortedData = [...data].sort((a, b) => a.rank - b.rank);

  const topThree = sortedData.filter(entry => entry.rank <= 3);
  const otherStudents = sortedData.filter(entry => entry.rank > 3);
  const currentUserEntry = sortedData.find(entry => entry.student.id === currentUserId);

  // Find specific ranks for podium
  const rank1 = topThree.find(e => e.rank === 1);
  const rank2 = topThree.find(e => e.rank === 2);
  const rank3 = topThree.find(e => e.rank === 3);

  const getEmoji = (id: number) => ANIMAL_EMOJIS[id % ANIMAL_EMOJIS.length];

  const podiumSlots: PodiumSlotConfig[] = [
    {
      key: "rank-2",
      entry: rank2,
      wrapperClass: "mb-8 z-10",
      avatarSize: "w-16 h-16 md:w-20 md:h-20",
      emojiSize: "text-3xl md:text-4xl",
      nameClass: "text-lg md:text-xl",
      scoreIconClass: "w-4 h-4 md:w-5 md:h-5",
      scoreTextClass: "text-sm md:text-base",
    },
    {
      key: "rank-1",
      entry: rank1,
      wrapperClass: "z-20 mb-16",
      avatarSize: "w-20 h-20 md:w-24 md:h-24",
      emojiSize: "text-4xl md:text-5xl",
      nameClass: "text-xl md:text-2xl font-medium",
      scoreIconClass: "w-5 h-5 md:w-6 md:h-6",
      scoreTextClass: "text-base md:text-lg",
      avatarClassName: "border-4 border-[#FFD700]/30 shadow-xl",
    },
    {
      key: "rank-3",
      entry: rank3,
      wrapperClass: "mb-4 z-10",
      avatarSize: "w-16 h-16 md:w-20 md:h-20",
      emojiSize: "text-3xl md:text-4xl",
      nameClass: "text-lg md:text-xl",
      scoreIconClass: "w-4 h-4 md:w-5 md:h-5",
      scoreTextClass: "text-sm md:text-base",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-linear-to-b from-[#7345C2] to-[#BE9AFF] flex flex-col items-center relative overflow-hidden p-4 md:p-6">
      {/* Toggle - Visual only for now */}
      <div className="relative z-10 flex items-center bg-white/20 backdrop-blur-sm rounded-full p-1 mb-8 mt-4">
        <div className="flex flex-col items-center justify-center px-4 py-1 bg-[#EAE2F8] rounded-full cursor-pointer min-w-[100px]">
          <span className="font-baloo font-semibold text-[#474250] text-sm md:text-base">Individual</span>
        </div>
        <div className="flex flex-col items-center justify-center px-4 py-1 cursor-pointer min-w-[100px]">
          <span className="font-baloo font-semibold text-white text-sm md:text-base">Team</span>
        </div>
      </div>

      {/* Podium */}
      <div className="relative w-full max-w-lg h-64 mb-8 grid grid-cols-3 items-end gap-2 md:gap-8 mx-auto">
        {podiumSlots.map(({ key, ...slotConfig }) => (
          <PodiumSpot key={key} {...slotConfig} getEmoji={getEmoji} />
        ))}
      </div>

      {/* List Container */}
      <div className="w-full max-w-md bg-white rounded-[20px] p-4 pb-24 flex flex-col relative z-0 shadow-xl flex-1 overflow-hidden">
        {/* Header inside card */}
        <div className="flex items-center justify-between mb-4 px-2">
           {/* Pagination Placeholders */}
           <div className="w-8 h-8 bg-[#7345C2]/10 rounded-full flex items-center justify-center text-[#7345C2] cursor-not-allowed opacity-50">
             <span className="sr-only">Previous</span>
             &lt;
           </div>

           <h2 className="font-baloo text-[#7345C2] text-lg md:text-xl">Class Leaderboard</h2>

           <div className="w-8 h-8 bg-[#7345C2]/10 rounded-full flex items-center justify-center text-[#7345C2] cursor-not-allowed opacity-50">
             <span className="sr-only">Next</span>
             &gt;
           </div>
        </div>

        <div className="h-px w-full bg-gray-100 mb-4" />

        {/* Scrollable List */}
        <div className="overflow-y-auto flex-1 -mx-2 px-2 space-y-3">
          {otherStudents.map(entry => (
            <StudentRow
              key={entry.id}
              entry={entry}
              emoji={getEmoji(entry.student.id)}
              showMeTag={entry.student.id === currentUserId}
              containerClassName="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
            />
          ))}
          {otherStudents.length === 0 && (
            <div className="text-center py-8 text-gray-400 font-baloo">
              No other students yet!
            </div>
          )}
        </div>
      </div>

      {/* My Rank */}
      {currentUserEntry && (
        <div className="w-full max-w-md mt-6">
          <div className="bg-white rounded-[20px] shadow-2xl p-4">
            <div className="text-center text-[#7345C2] font-baloo mb-2">
               My Rank: {currentUserEntry.rank}{getOrdinalSuffix(currentUserEntry.rank)}
            </div>

            <StudentRow
              entry={currentUserEntry}
              emoji={getEmoji(currentUserEntry.student.id)}
              containerClassName="flex items-center justify-between"
            />
          </div>
        </div>
      )}
    </div>
  );
}
