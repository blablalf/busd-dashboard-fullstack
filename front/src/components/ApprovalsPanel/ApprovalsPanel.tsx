import { FaSpinner } from "react-icons/fa";

import "./ApprovalsPanel.css";
import useGetApprovalsApi from "../../hooks/useGetApprovalsApi";

const ApprovalsPanel = () => {
  const { data: approvals } = useGetApprovalsApi();

  return (
    <div className="approvals-panel" id="manage-allowances">
      <h3>Approvals</h3>
      <ul>
        {approvals ? (
          Array.from(approvals).map(([spender, value]) => (
            <li key={spender} className="approval-card-populated">
              <div className="approval-panel-info">
                <h4>Spender:</h4>
                <p>{spender}</p>
              </div>
              <div className="approval-panel-info">
                <h4>Value:</h4>
                <p>{value.toString()}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="approval-card-none">
            <FaSpinner className="spinner" />
            <p>No approval found, search in progress...</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ApprovalsPanel;
