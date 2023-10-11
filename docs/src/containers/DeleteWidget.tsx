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
        <div className="flex flex-col gap-4 w-80">
          <h2 className="text-24 font-bold" id={labelId}>
            Delete Widget
          </h2>
          <p id={descriptionId}>
            Are you sure you want to delete
            <br />
            <span className="font-bold">{widgetName}</span>?
          </p>
          <div className="flex justify-between pt-4 pb-2">
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
      <IconButton ariaLabel="Delete Widget" color="error" icon="trash" plain />
    </Dialog>
  );
};

export default DeleteWidget;
