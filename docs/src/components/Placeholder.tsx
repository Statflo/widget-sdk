import { Icon } from "@statflo/ui";
import { useNavigate } from "react-router-dom";

type PlaceholderProps = {
  location: string;
};

const Placeholder = ({ location }: PlaceholderProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-8 rounded-lg border border-dashed border-blue-200 bg-blue-200/15 text-blue-400 dark:text-blue-200 flex flex-col items-center justify-center text-center">
      <p>{location} Widgets will appear here.</p>
      <p>
        Go to the{" "}
        <button
          className="text-blue-500 hocus-not-disabled:text-blue-700 dark:text-blue-300 font-semibold dark:hocus-not-disabled:text-blue-400"
          onClick={() => navigate("/widget-manager")}
        >
          Widget Manager{" "}
          <Icon
            className="inline mb-1"
            color="current"
            icon="application-setting"
          />
        </button>{" "}
        to add a new widget.
      </p>
    </div>
  );
};

export default Placeholder;
