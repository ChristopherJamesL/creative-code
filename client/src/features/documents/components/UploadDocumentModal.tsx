import { useRef, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Dropdown from "../../../components/ui/Dropdown";
import GroupCombobox from "./GroupCombobox";
import { useUploadDocument } from "../hooks/useUploadDocument";

const TYPE_OPTIONS = [
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function today() {
  return new Date().toISOString().split("T")[0];
}

function stemName(filename: string) {
  return filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
}

function detectType(filename: string): "pdf" | "docx" {
  return filename.toLowerCase().endsWith(".docx") ? "docx" : "pdf";
}

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadDocumentModal({
  open,
  onClose,
}: UploadDocumentModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [type, setType] = useState<"pdf" | "docx">("pdf");
  const [status, setStatus] = useState("pending");
  const [date, setDate] = useState(today);
  const [groupId, setGroupId] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const upload = useUploadDocument();

  function applyFile(f: File) {
    setFile(f);
    setTitle((prev) => prev || stemName(f.name));
    setType(detectType(f.name));
    setError("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) applyFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) applyFile(f);
  }

  function handleClose() {
    setFile(null);
    setTitle("");
    setClient("");
    setType("pdf");
    setStatus("pending");
    setDate(today());
    setGroupId("");
    setError("");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!client.trim()) {
      setError("Client is required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("client", client.trim());
    formData.append("type", type);
    formData.append("status", status);
    formData.append("date", date);
    if (groupId) formData.append("group_id", groupId);

    upload.mutate(formData, {
      onSuccess: handleClose,
      onError: () => setError("Upload failed. Please try again."),
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title="Upload document">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
        className="flex flex-col gap-4"
      >
        {/* File drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={
            "flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-colors select-none " +
            (dragOver
              ? "border-primary bg-secondary/40"
              : file
                ? "border-border bg-secondary/20"
                : "border-border hover:border-primary/50 hover:bg-secondary/20")
          }
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
          {file ? (
            <>
              <svg
                className="h-5 w-5 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-[13px] font-medium text-foreground">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB · click to change
              </p>
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-[13px] font-medium text-foreground">
                Drop file or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PDF or DOCX · max 50 MB
              </p>
            </>
          )}
        </div>

        <Input
          label="Title"
          id="doc-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contract for Sale of Property"
          required
        />

        <Input
          label="Client"
          id="doc-client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Johnson & Partners"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Dropdown
            label="Type"
            id="doc-type"
            options={TYPE_OPTIONS}
            value={type}
            onChange={(v) => setType(v as "pdf" | "docx")}
          />
          <Dropdown
            label="Status"
            id="doc-status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="doc-date"
              className="text-xs font-medium text-foreground"
            >
              Date
            </label>
            <input
              id="doc-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-8 rounded border border-border bg-background px-2.5 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <GroupCombobox
            label="Group"
            value={groupId}
            onChange={setGroupId}
            dropUp
          />
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={upload.isPending}
          >
            {upload.isPending ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
