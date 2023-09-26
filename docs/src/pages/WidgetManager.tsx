import { useState } from "react";
import WidgetForm from "../containers/WidgetForm";
import { useWidgetContext } from "../providers/WidgetProvider";
import { Table } from "@statflo/ui";
import DeleteWidget from "../containers/DeleteWidget";

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
    cell: (info: any) => info.getValue() ?? "-",
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
    cell: (info: any) => info.getValue()[0].positions[0],
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
    <div className="pt-8 px-8 h-screen w-full flex flex-col gap-4">
      <h1 className="font-bold">Widget Manager</h1>
      <div className="flex justify-end w-full">
        <WidgetForm />
      </div>
      <div className="flex-1">
        <Table
          columns={columns}
          data={widgets ?? []}
          pagination={{
            pageIndex,
            pageSize,
          }}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
};

export default WidgetManager;
