import { BookOpen, Clock3, History } from "lucide-react";
import StatsPanel from "../StatsPanel.jsx";

function LoanStats({ current, dueSoon, overdue, returned }) {
  return (
    <StatsPanel
      title="Loan Stats"
      stats={[
        { icon: BookOpen, value: current, label: "On Loan" },
        { icon: Clock3, value: dueSoon, label: "Due Soon" },
        { icon: Clock3, value: overdue, label: "Overdue", alert: overdue > 0 },
        { icon: History, value: returned, label: "Returned" },
      ]}
    />
  );
}

export default LoanStats;
