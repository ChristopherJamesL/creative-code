import { useState } from "react";
import { useAdminUsers, useInviteUser, useUpdateUserRole } from "../features/admin/hooks/useAdmin";
import type { UserRole } from "../features/auth/types";
import type { AdminUser } from "../features/admin/types";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Dropdown from "../components/ui/Dropdown";
import Spinner from "../components/ui/Spinner";

const ROLE_OPTIONS = [
  { value: "staff",    label: "Staff" },
  { value: "attorney", label: "Attorney" },
  { value: "admin",    label: "Admin" },
];

function InviteForm() {
  const [email, setEmail]       = useState("");
  const [fullName, setFullName] = useState("");
  const invite = useInviteUser();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    invite.mutate({ email, fullName }, {
      onSuccess: () => { setEmail(""); setFullName(""); },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <Input
        label="Email"
        id="invite-email"
        type="email"
        placeholder="colleague@firm.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-56"
      />
      <Input
        label="Full name"
        id="invite-name"
        type="text"
        placeholder="Jane Smith"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-44"
      />
      <Button type="submit" variant="secondary" size="md" disabled={invite.isPending}>
        {invite.isPending ? "Sending…" : "Send invite"}
      </Button>
      {invite.isSuccess && (
        <span className="text-xs text-success self-end pb-1.5">Invite sent.</span>
      )}
      {invite.isError && (
        <span className="text-xs text-destructive self-end pb-1.5">Failed to send invite.</span>
      )}
    </form>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const updateRole = useUpdateUserRole();

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/40 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate">
          {user.full_name || <span className="text-muted-foreground italic">No name</span>}
        </p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>

      <Dropdown
        options={ROLE_OPTIONS}
        value={user.role}
        onChange={(role) => updateRole.mutate({ userId: user.id, role: role as UserRole })}
        className="w-32 shrink-0"
      />

      <span className="text-xs text-muted-foreground w-24 shrink-0 text-right hidden sm:block">
        {new Date(user.created_at).toLocaleDateString()}
      </span>
    </div>
  );
}

export default function AdminPage() {
  const { data: users, isLoading, isError } = useAdminUsers();

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-base font-semibold text-foreground">Team</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Manage users and roles for your legal workspace.
        </p>
      </div>

      {/* Invite */}
      <div>
        <h2 className="text-sm font-medium text-foreground mb-3">Invite a team member</h2>
        <InviteForm />
      </div>

      {/* User list */}
      <div>
        <h2 className="text-sm font-medium text-foreground mb-3">
          Team members {users ? `· ${users.length}` : ""}
        </h2>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Column headers */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-2 bg-muted/60">
            <span className="flex-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Member</span>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-32 shrink-0">Role</span>
            <span className="hidden sm:block text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-24 shrink-0 text-right">Joined</span>
          </div>

          {isLoading && (
            <div className="flex justify-center py-10">
              <Spinner size="sm" />
            </div>
          )}

          {isError && (
            <p className="px-4 py-6 text-xs text-destructive">Failed to load users.</p>
          )}

          {users && (
            <div className="divide-y divide-border">
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
