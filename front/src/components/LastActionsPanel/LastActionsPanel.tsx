import "./LastActionsPanel.css";
import EventCard from "../EventCard/EventCard.tsx";
import { FaSpinner } from "react-icons/fa";
import useGetLastActionsApi from "../../hooks/useGetLastActionsApi.ts";

export default function LastActionsPanel() {
  const { data: lastActionsLogs } = useGetLastActionsApi(true, 10);
  const { data: lastUserActionsLogs } = useGetLastActionsApi(false, 10);

  return (
    <div className="last-actions-panels" id="manage-actions">
      <div className="panel">
        <h3>Last actions</h3>
        <ul>
          {lastActionsLogs ? (
            lastActionsLogs.map((log) => (
              <li key={log.id}>
                <EventCard
                  eventName={log.eventName as `0x${string}`}
                  transactionHash={log.txHash as `0x${string}`}
                  timestamp={log.timestamp}
                  args={{
                    owner: log.owner as `0x${string}`,
                    spender: log.spender as `0x${string}`,
                    from: log.from as `0x${string}`,
                    to: log.to as `0x${string}`,
                    value: BigInt(log.value),
                  }}
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
              <li key={log.id}>
                <EventCard
                  eventName={log.eventName as `0x${string}`}
                  transactionHash={log.txHash as `0x${string}`}
                  timestamp={log.timestamp}
                  args={{
                    owner: log.owner as `0x${string}`,
                    spender: log.spender as `0x${string}`,
                    from: log.from as `0x${string}`,
                    to: log.to as `0x${string}`,
                    value: BigInt(log.value),
                  }}
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
