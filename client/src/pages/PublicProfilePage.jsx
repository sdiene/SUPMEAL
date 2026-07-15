import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfile, toggleFollow } from "../api/profiles";
import { useAuth } from "../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export default function PublicProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  useEffect(() => {
    getProfile(userId)
      .then((res) => {
        setProfile(res.data);
        setFollowing(res.data.isFollowing);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleFollow() {
    setFollowLoading(true);
    try {
      const res = await toggleFollow(userId);
      setFollowing(res.data.following);
      setProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          _count: {
            ...prev.user._count,
            followers: prev.user._count.followers + (res.data.following ? 1 : -1),
          },
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) return <p className="text-gray-400">Chargement...</p>;
  if (!profile) return <p className="text-gray-400">Profil introuvable</p>;

  const { user: chef, recipes, cookbooks } = profile;
  const isOwnProfile = user?.id === chef.id;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header profil */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-2xl">
              {chef.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{chef.name}</h1>
              <p className="text-sm text-gray-400 mt-1">
                Membre depuis {new Date(chef.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          {isOwnProfile ? (
            <Link
              to="/settings"
              className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ⚙️ Modifier le profil
            </Link>
          ) : (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                following
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              } disabled:opacity-50`}
            >
              {followLoading ? "..." : following ? "✓ Suivi" : "+ Suivre"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{chef._count.recipes}</p>
            <p className="text-xs text-gray-400 mt-1">Recettes publiques</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{chef._count.followers}</p>
            <p className="text-xs text-gray-400 mt-1">Abonnés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{chef._count.following}</p>
            <p className="text-xs text-gray-400 mt-1">Abonnements</p>
          </div>
        </div>
      </div>

      {/* Recettes publiques */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          🍽️ Recettes publiques ({recipes.length})
        </h2>
        {recipes.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune recette publique</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                {recipe.imageUrl ? (
                  <img src={API_URL + recipe.imageUrl} alt={recipe.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">🍽️</div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{recipe.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {recipe.prepTime ? `⏱ ${recipe.prepTime} min` : ""}
                    {recipe.cookTime ? ` · 🔥 ${recipe.cookTime} min` : ""}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {recipe.tags?.slice(0, 2).map((rt) => (
                      <span key={rt.tag?.name} className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                        {rt.tag?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Cookbooks publics */}
      {cookbooks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            📚 Cookbooks publics ({cookbooks.length})
          </h2>
          <div className="space-y-3">
            {cookbooks.map((cb) => (
              <div key={cb.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">📚 {cb.name}</h3>
                {cb.description && <p className="text-sm text-gray-400 mt-1">{cb.description}</p>}
                <p className="text-xs text-gray-400 mt-2">{cb.recipes.length} recette{cb.recipes.length > 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
