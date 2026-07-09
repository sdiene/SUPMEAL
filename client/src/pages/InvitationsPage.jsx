import { useEffect, useState } from "react";
import { getMyInvitations, respondToInvitation } from "../api/invitations";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState({});

  useEffect(() => {
    getMyInvitations()
      .then((res) => setInvitations(res.data.invitations))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleRespond(invitationId, accept) {
    setResponding((prev) => ({ ...prev, [invitationId]: true }));
    try {
      await respondToInvitation(invitationId, accept);
      setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
    } catch (err) {
      console.error(err);
    } finally {
      setResponding((prev) => ({ ...prev, [invitationId]: false }));
    }
  }

  if (loading) return <p className="text-gray-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        🔔 Invitations
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        {invitations.length} invitation{invitations.length > 1 ? "s" : ""} en attente
      </p>

      {invitations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-gray-400">Aucune invitation en attente</p>
          <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">
            Vous serez notifié ici quand quelqu'un vous invite dans un cookbook
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">📚</span>
                    <h2 className="font-semibold text-gray-800 dark:text-white text-lg">
                      {inv.cookbook.name}
                    </h2>
                  </div>
                  {inv.cookbook.description && (
                    <p className="text-sm text-gray-400 mb-2">{inv.cookbook.description}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {inv.invitedBy.name}
                    </span>{" "}
                    vous invite à rejoindre ce cookbook en tant que{" "}
                    <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                      {inv.role}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(inv.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRespond(inv.id, true)}
                    disabled={responding[inv.id]}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {responding[inv.id] ? "..." : "✅ Accepter"}
                  </button>
                  <button
                    onClick={() => handleRespond(inv.id, false)}
                    disabled={responding[inv.id]}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    {responding[inv.id] ? "..." : "❌ Refuser"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
