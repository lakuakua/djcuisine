'use client';

export default function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="rounded border border-stone-600 px-3 py-1 text-stone-300 hover:bg-stone-800"
      onClick={() =>
        fetch('/api/admin/logout', { method: 'POST' }).then(() => {
          window.location.href = '/admin/login';
        })
      }
    >
      Log out
    </button>
  );
}
