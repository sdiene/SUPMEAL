import { useEffect, useState, useRef } from "react";
import { getComments, postComment, deleteComment } from "../api/comments";
import { useAuth } from "../context/AuthContext";

export default function CommentsSection({ recipeId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    getComments(recipeId)
      .then((res) => setComments(res.data.comments))
      .catch(() => setError("Impossible de charger les commentaires"))
      .finally(() => setLoading(false));
  }, [recipeId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await postComment(recipeId, content);
      setComments((prev) => [...prev, res.data.comment]);
      setContent("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(commentId) {
    try {
      await deleteComment(recipeId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-4">
      <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
        💬 Commentaires ({comments.length})
      </h2>

      {loading ? (
        <p className="text-gray-400 text-sm">Chargement...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm mb-4">
          Aucun commentaire pour l'instant. Soyez le premier !
        </p>
      ) : (
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm flex-shrink-0">
                {comment.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {comment.user?.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {comment.content}
                </p>
              </div>
              {comment.userId === user?.id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs self-start mt-1"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {sending ? "..." : "Envoyer"}
          </button>
        </div>
      </form>
    </div>
  );
}
