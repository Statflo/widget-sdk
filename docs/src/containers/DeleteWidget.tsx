import { Button, Dialog, IconButton } from "@statflo/ui";
import { useState } from "react";
import { useWidgetContext } from "../providers/WidgetProvider";

const DeleteWidget = ({
  widgetId,
  widgetName,
}: {
  widgetId: string;
  widgetName: string;
}) => {
  const [isOpen, setOpen] = useState(false);
  const { deleteWidget } = useWidgetContext();

  return (
    <Dialog
      isOpen={isOpen}
      setOpen={setOpen}
      closeButton="Close"
      render={({ onClose, labelId, descriptionId }) => (
        <div>
          <p>
            Are you sure you want to delete <span>{widgetName}</span>?
          </p>
          <div>
            <Button onClick={onClose} size="small" variant="tertiary">
              Cancel
            </Button>
            <Button onClick={() => deleteWidget(widgetId)} size="small">
              Confirm
            </Button>
          </div>
        </div>
      )}
    >
      <IconButton
        ariaLabel="Delete Widget"
        // iconClassName="group-hocus-not-disabled:stroke-error-700 dark:group-hocus-not-disabled:stroke-error-400"
        color="error"
        icon="trash"
        plain
      />
    </Dialog>
  );
};

export default DeleteWidget;