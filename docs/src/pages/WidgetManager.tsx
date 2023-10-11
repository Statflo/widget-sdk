import { useState } from "react";
import WidgetForm from "../containers/WidgetForm";
import { useWidgetContext } from "../providers/WidgetProvider";
import { Table } from "@statflo/ui";
import DeleteWidget from "../containers/DeleteWidget";

const positions = {
  sendable: "Sendable",
  right_panel: "Right Panel",
};

const columns = [
  {
    id: "id",
    header: "ID",
    accessorKey: "id",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "label",
    header: "Label",
    accessorKey: "label",
    cell: (info: any) => (info.getValue().length !== 0 ? info.getValue() : "-"),
  },
  {
    id: "url",
    header: "URL",
    accessorKey: "url",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "position",
    header: "Position",
    accessorKey: "scopes",
    cell: (info: any) =>
      positions[info.getValue()[0].positions[0] as keyof typeof positions],
  },
  {
    id: "priority",
    header: "Priority",
    accessorKey: "priority",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "edit",
    header: "",
    accessorKey: "edit",
    cell: ({ row }: any) => <WidgetForm isEdit widget={row.original} />,
    size: 68,
  },
  {
    id: "delete",
    header: "",
    accessorKey: "delete",
    cell: ({ row }: any) => (
      <DeleteWidget widgetId={row.original.id} widgetName={row.original.name} />
    ),
    size: 68,
  },
];

const WidgetManager = () => {
  const { widgets } = useWidgetContext();

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  return (
    <div className="pt-6 px-6 h-screen w-full flex flex-col gap-4 bg-blueGrey-50 dark:bg-darkMode-800">
      <h1 className="font-bold">Widget Manager</h1>
      <div className="flex justify-end w-full">
        <WidgetForm />
      </div>
      <div className="flex-1">
        <Table
          columns={columns}
          data={widgets ?? []}
          emptyMessage={
            <>
              <p className="text-28 font-semibold text-blueGrey-600 dark:text-blueGrey-300">
                Whoops! No Results Found
              </p>
              <p className="text-20 text-blueGrey-600 dark:text-blueGrey-300 mb-8">
                Add a new widget to get started
              </p>
            </>
          }
          pagination={{
            pageIndex,
            pageSize,
          }}
          setPagination={setPagination}
          totalItems={widgets?.length}
        />
      </div>
    </div>
  );
};

export default WidgetManager;
