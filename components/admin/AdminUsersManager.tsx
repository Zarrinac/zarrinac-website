'use client';

import { useState, useTransition } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import type { AdminRole } from '@/lib/admin/access';
import { ADMIN_ROLES } from '@/lib/admin/access';
import {
  formatAdminDate,
  formatAdminDateTime,
  getAdminDirection,
  type AdminLocale,
  type getAdminDictionary,
} from '@/lib/admin/i18n';
import type { AdminUserRecord } from '@/lib/admin/users';
import {
  createAdminUserAction,
  deleteAdminUserAction,
  resetPasswordAction,
  toggleActiveAction,
  updateRoleAction,
  type ActionResult,
} from '@/app/admin/users/actions';

type UsersDictionary = ReturnType<typeof getAdminDictionary>['users'];

type AdminUsersManagerProps = {
  users: AdminUserRecord[];
  currentUserId: string;
  locale: AdminLocale;
  dictionary: UsersDictionary;
};

type Feedback = { type: 'success' | 'error'; text: string } | null;

export default function AdminUsersManager({
  users,
  currentUserId,
  locale,
  dictionary,
}: AdminUsersManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('ADMIN');

  const [resetTarget, setResetTarget] = useState<AdminUserRecord | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  const dir = getAdminDirection(locale);
  const messages = dictionary.messages;

  const resolveError = (code: string) =>
    (messages as Record<string, string>)[code] ?? messages.error;

  const run = (action: () => Promise<ActionResult>, successText: string, onDone?: () => void) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setFeedback({ type: 'success', text: successText });
        onDone?.();
      } else {
        setFeedback({ type: 'error', text: resolveError(result.error) });
      }
    });
  };

  const handleCreate = () => {
    run(
      () =>
        createAdminUserAction({
          username: newUsername,
          password: newPassword,
          role: newRole,
        }),
      messages.created,
      () => {
        setNewUsername('');
        setNewPassword('');
        setNewRole('ADMIN');
      },
    );
  };

  const handleRoleChange = (user: AdminUserRecord, role: AdminRole) => {
    if (role === user.role) return;
    run(() => updateRoleAction({ id: user.id, role }), messages.updated);
  };

  const handleToggleActive = (user: AdminUserRecord) => {
    run(() => toggleActiveAction({ id: user.id, isActive: !user.isActive }), messages.updated);
  };

  const handleResetSubmit = () => {
    if (!resetTarget) return;
    run(
      () => resetPasswordAction({ id: resetTarget.id, password: resetPassword }),
      messages.passwordReset,
      () => {
        setResetTarget(null);
        setResetPassword('');
      },
    );
  };

  const handleDelete = (user: AdminUserRecord) => {
    if (!window.confirm(dictionary.confirmDelete.replace('{username}', user.username))) return;
    run(() => deleteAdminUserAction({ id: user.id }), messages.deleted);
  };

  const roleLabel = (role: AdminRole) => dictionary.roles[role];

  return (
    <div dir={dir} className="space-y-6">
      {feedback ? (
        <div
          role="status"
          className={[
            'rounded-md border px-4 py-3 text-sm font-medium',
            feedback.type === 'success'
              ? 'border-[#9fe7d8] bg-[#e5fbf8] text-[#007f7b]'
              : 'border-[#f4b8ba] bg-[#fdeced] text-[#c0282d]',
          ].join(' ')}
        >
          {feedback.text}
        </div>
      ) : null}

      {/* Add user */}
      <section className="rounded-lg border border-[#dbe3e8] bg-white p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#172026]">
          <PersonAddAltOutlinedIcon fontSize="small" />
          {dictionary.addUser}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_12rem_auto] lg:items-end">
          <TextField
            label={dictionary.form.username}
            value={newUsername}
            onChange={(event) => setNewUsername(event.target.value)}
            size="small"
            fullWidth
            disabled={isPending}
          />
          <TextField
            label={dictionary.form.password}
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            size="small"
            fullWidth
            disabled={isPending}
          />
          <TextField
            label={dictionary.form.role}
            select
            value={newRole}
            onChange={(event) => setNewRole(event.target.value as AdminRole)}
            size="small"
            fullWidth
            disabled={isPending}
          >
            {ADMIN_ROLES.map((role) => (
              <MenuItem key={role} value={role}>
                {roleLabel(role)}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={isPending || !newUsername || !newPassword}
            sx={{ height: 40, whiteSpace: 'nowrap' }}
          >
            {dictionary.form.submit}
          </Button>
        </div>
      </section>

      {/* Users table */}
      <section className="overflow-x-auto rounded-lg border border-[#dbe3e8] bg-white">
        <table className="w-full min-w-176 border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#dbe3e8] bg-[#f8fafb] text-start text-xs font-semibold uppercase tracking-wide text-[#667782]">
              <th className="px-4 py-3 text-start">{dictionary.table.username}</th>
              <th className="px-4 py-3 text-start">{dictionary.table.role}</th>
              <th className="px-4 py-3 text-start">{dictionary.table.status}</th>
              <th className="px-4 py-3 text-start">{dictionary.table.lastLogin}</th>
              <th className="px-4 py-3 text-start">{dictionary.table.created}</th>
              <th className="px-4 py-3 text-end">{dictionary.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;

              return (
                <tr key={user.id} className="border-b border-[#eef2f4] last:border-b-0">
                  <td className="px-4 py-3 font-medium text-[#172026]">
                    {user.username}
                    {isSelf ? (
                      <span className="ms-2 text-xs font-normal text-[#667782]">
                        {dictionary.you}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      select
                      value={user.role}
                      onChange={(event) => handleRoleChange(user, event.target.value as AdminRole)}
                      size="small"
                      disabled={isPending}
                      sx={{ minWidth: 150 }}
                    >
                      {ADMIN_ROLES.map((role) => (
                        <MenuItem key={role} value={role}>
                          {roleLabel(role)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2">
                      <Switch
                        checked={user.isActive}
                        onChange={() => handleToggleActive(user)}
                        disabled={isPending}
                        size="small"
                      />
                      <span className={user.isActive ? 'text-[#007f7b]' : 'text-[#a0adb5]'}>
                        {user.isActive ? dictionary.status.active : dictionary.status.inactive}
                      </span>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-[#52636f]">
                    {user.lastLoginAt
                      ? formatAdminDateTime(user.lastLoginAt, locale)
                      : dictionary.never}
                  </td>
                  <td className="px-4 py-3 text-[#52636f]">
                    {formatAdminDate(user.createdAt, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        aria-label={dictionary.actions.resetPassword}
                        title={dictionary.actions.resetPassword}
                        onClick={() => {
                          setResetTarget(user);
                          setResetPassword('');
                        }}
                        disabled={isPending}
                        size="small"
                      >
                        <KeyOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label={dictionary.actions.delete}
                        title={dictionary.actions.delete}
                        onClick={() => handleDelete(user)}
                        disabled={isPending || isSelf}
                        size="small"
                        color="error"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Reset password dialog */}
      <Dialog open={Boolean(resetTarget)} onClose={() => setResetTarget(null)} dir={dir}>
        <DialogTitle>
          {dictionary.resetPasswordTitle.replace('{username}', resetTarget?.username ?? '')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label={dictionary.newPassword}
            type="password"
            value={resetPassword}
            onChange={(event) => setResetPassword(event.target.value)}
            size="small"
            fullWidth
            sx={{ mt: 1, minWidth: 320 }}
            disabled={isPending}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetTarget(null)} disabled={isPending} color="inherit">
            {dictionary.actions.cancel}
          </Button>
          <Button
            onClick={handleResetSubmit}
            disabled={isPending || resetPassword.length < 8}
            variant="contained"
          >
            {dictionary.actions.save}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
