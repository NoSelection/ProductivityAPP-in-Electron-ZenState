import { FocusCard } from "./FocusCard";
import { Timer } from "./Timer";
import { BrainDump } from "./BrainDump";
import { MediaDeck } from "./MediaDeck";
import { QuestLog } from "./QuestLog";

export const Dashboard: React.FC = () => {
    return (
        <>
            {/* Top Left - Focus */}
            <FocusCard />

            {/* Top Right (Middle Column Top) - Timer */}
            <Timer />

            {/* Sidebar - Spans 2 Rows (Rightmost column) */}
            <QuestLog />

            {/* Bottom Left - Brain Dump */}
            <BrainDump />

            {/* Bottom Right (Middle Column Bottom) - LoFi */}
            <MediaDeck />
        </>
    );
};
