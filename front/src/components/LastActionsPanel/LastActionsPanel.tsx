import "./LastActionsPanel.css";
import useGetLastActions from "../../hooks/useGetLastActions.ts";
import EventCard from "../EventCard/EventCard.tsx";
import { FaSpinner } from "react-icons/fa";

export default function LastActionsPanel() {
  const { data: lastActionsLogs } = useGetLastActions(true);
  const { data: lastUserActionsLogs } = useGetLastActions(false);

  return (
    <div className="last-actions-panels" id="manage-actions">
      <div className="panel">
        <h3>Last actions</h3>
        <ul>
          {lastActionsLogs ? (
            lastActionsLogs.map((log) => (
              <li key={log.logIndex}>
                <EventCard
                  eventName={log.eventName as `0x${string}`}
                  transactionHash={log.transactionHash as `0x${string}`}
                  timestamp={log.timestamp}
                  args={log.args}
                />
              </li>
            ))
          ) : (
            <li className="approval-card">
              <FaSpinner className="spinner" />
              <p>No action found, search in progress...</p>
            </li>
          )}
        </ul>
      </div>
      <div className="panel">
        <h3>Last actions from you</h3>
        <ul>
          {lastUserActionsLogs ? (
            lastUserActionsLogs.map((log) => (
              <li key={log.logIndex}>
                <EventCard
                  eventName={log.eventName as `0x${string}`}
                  transactionHash={log.transactionHash as `0x${string}`}
                  timestamp={log.timestamp}
                  args={log.args}
                />
              </li>
            ))
          ) : (
            <li className="approval-card">
              <FaSpinner className="spinner" />
              <p>No user action found, search in progress...</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
