import Button from "../../../components/ui/Button";
import Dropdown from "../../../components/ui/Dropdown";
import Input from "../../../components/ui/Input";
import { useGroups } from "../../groups/hooks/useGroups";

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc",  label: "Oldest first" },
  { value: "name_asc",  label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
];

const STATUS_OPTIONS = [
  { value: "",         label: "All statuses" },
  { value: "approved", label: "Approved" },
  { value: "pending",  label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

const TYPE_OPTIONS = [
  { value: "",     label: "All types" },
  { value: "pdf",  label: "PDF" },
  { value: "docx", label: "DOCX" },
];

interface DocumentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  groupFilter: string;
  onGroupChange: (value: string) => void;
  onUpload: () => void;
}

export default function DocumentToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sort,
  onSortChange,
  groupFilter,
  onGroupChange,
  onUpload,
}: DocumentToolbarProps) {
  const { data: groups = [] } = useGroups();

  const groupOptions = [
    { value: "", label: "All groups" },
    ...groups.map((g) => ({ value: g.id, label: g.name })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex-1 min-w-48">
        <Input
          placeholder="Search documents…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Dropdown
        options={groupOptions}
        value={groupFilter}
        onChange={onGroupChange}
        placeholder="Group"
        className="w-36"
      />
      <Dropdown
        options={STATUS_OPTIONS}
        value={statusFilter}
        onChange={onStatusChange}
        placeholder="Status"
        className="w-36"
      />
      <Dropdown
        options={TYPE_OPTIONS}
        value={typeFilter}
        onChange={onTypeChange}
        placeholder="Type"
        className="w-28"
      />
      <Dropdown
        options={SORT_OPTIONS}
        value={sort}
        onChange={onSortChange}
        className="w-36"
      />

      <Button variant="secondary" size="md" onClick={onUpload} className="shrink-0">
        Upload
      </Button>
    </div>
  );
}
