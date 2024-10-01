import { address0 } from "../../adapters/ClientsAdapter";
import "./EventCard.css";

interface EventLogType {
  timestamp: bigint;
  transactionHash: `0x${string}`;
  args: {
    owner?: `0x${string}`;
    spender?: `0x${string}`;
    from?: `0x${string}`;
    to?: `0x${string}`;
    value?: bigint;
  };
  eventName: string;
}

const EventCard = ({
  eventName,
  transactionHash,
  timestamp,
  args,
}: EventLogType) => {
  return (
    <div className="event-card-container">
      <div className="event-card-header">
        <h4>
          {eventName == "Transfer"
            ? args.from == address0
              ? "Mint"
              : args.to == address0
              ? "Burn"
              : eventName
            : eventName}{" "}
          action
        </h4>
        <h4>
          Transaction Hash:
          <a
            href={"https://sepolia.etherscan.io/tx/" + transactionHash}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionHash}
          </a>
        </h4>
        <p>{new Date(Number(timestamp) * 1000).toLocaleString()}</p>
      </div>
      <div className="event-card-args">
        <h4>Args</h4>
        {args.value ? (
          <div className="arg">
            <h5>Value:</h5>
            <p>{args.value.toString()}</p>
          </div>
        ) : (
          <></>
        )}
        {args.owner ? (
          <div className="arg">
            <h5>Owner:</h5>
            <p>{args.owner}</p>
          </div>
        ) : (
          <></>
        )}
        {args.spender ? (
          <div className="arg">
            <h5>Spender:</h5>
            <p>{args.spender}</p>
          </div>
        ) : (
          <></>
        )}
        {args.from ? (
          <div className="arg">
            <h5>From:</h5>
            <p>{args.from}</p>
          </div>
        ) : (
          <></>
        )}
        {args.to ? (
          <div className="arg">
            <h5>To:</h5>
            <p>{args.to}</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default EventCard;
