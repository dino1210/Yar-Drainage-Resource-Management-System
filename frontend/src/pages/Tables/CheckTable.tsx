import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

// Define the expected structure
interface Tool {
  id: number;
  name: string;
  tag: string;
  category: string;
  description: string;
  remarks: string;
  totalQuantity: number;
  itemDescription: string;
  dateModified: string;
  status: string;
}

// Placeholder for actual data fetching
const fetchTools = async (): Promise<Tool[]> => {
  return [
    {
      id: 1,
      name: "Angle Grinder",
      tag: "AG-001",
      category: "Power Tools",
      description: "Used for grinding and cutting",
      remarks: "In good condition",
      totalQuantity: 5,
      itemDescription: "Heavy-duty angle grinder",
      dateModified: "2025-03-25",
      status: "Active",
    },
    {
      id: 1,
      name: "Angle Grinder",
      tag: "AG-001",
      category: "Power Tools",
      description: "Used for grinding and cutting",
      remarks: "In good condition",
      totalQuantity: 5,
      itemDescription: "Heavy-duty angle grinder",
      dateModified: "2025-03-25",
      status: "Active",
    },
    {
      id: 1,
      name: "Angle Grinder",
      tag: "AG-001",
      category: "Power Tools",
      description: "Used for grinding and cutting",
      remarks: "In good condition",
      totalQuantity: 5,
      itemDescription: "Heavy-duty angle grinder",
      dateModified: "2025-03-25",
      status: "Active",
    },
    {
      id: 1,
      name: "Angle Grinder",
      tag: "AG-001",
      category: "Power Tools",
      description: "Used for grinding and cutting",
      remarks: "In good condition",
      totalQuantity: 5,
      itemDescription: "Heavy-duty angle grinder",
      dateModified: "2025-03-25",
      status: "Active",
    },
    {
      id: 1,
      name: "Angle Grinder",
      tag: "AG-001",
      category: "Power Tools",
      description: "Used for grinding and cutting",
      remarks: "In good condition",
      totalQuantity: 5,
      itemDescription: "Heavy-duty angle grinder",
      dateModified: "2025-03-25",
      status: "Active",
    },
  ];
};

export default function CheckTable() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    fetchTools().then(setTools).catch(console.error);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {[
                "Tools/Equipments",
                "Tag/Code",
                "Category",
                "Description",
                "Remarks",
                "Total Quantity",
                "Item Description",
                "Date Modified",
                "Status",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {tool.name}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400">
                  {tool.tag}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400">
                  {tool.category}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400">
                  {tool.description}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400">
                  {tool.remarks}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400">
                  {tool.totalQuantity}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400">
                  {tool.itemDescription}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400">
                  {tool.dateModified}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      tool.status === "Active"
                        ? "success"
                        : tool.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {tool.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
