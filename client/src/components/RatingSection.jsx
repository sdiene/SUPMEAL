import { useEffect, useState } from "react";
import { getRating, rateRecipe } from "../api/ratings";
import StarRating from "./StarRating";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
export default function RatingSection({ recipeId }) {
  const { user } = useAuth();
  const [average, setAverage] = useState(null);
  const [count, setCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getRating(recipeId)
      .then((res) => {
        setAverage(res.data.average);
        setCount(res.data.count);
        setUserRating(res.data.userRating || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [recipeId]);
  async function handleRate(value) {
    setSaving(true);
    try {
      const res = await rateRecipe(recipeId, value);
      setUserRating(value);
      setAverage(res.data.average);
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }
  if (loading) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-4">
      <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
<FontAwesomeIcon icon={faStar} /> Notes
      </h2>

      {/* Moyenne */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800 dark:text-white">
            {average ? average.toFixed(1) : "—"}
          </p>
          <StarRating value={Math.round(average || 0)} readonly size="sm" />
          <p className="text-xs text-gray-400 mt-1">
            {count} avis{count > 1 ? "" : ""}
          </p>
        </div>
      </div>

      {/* Note de l'utilisateur */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {userRating ? "Votre note :" : "Notez cette recette :"}
        </p>
        <div className="flex items-center gap-3">
          <StarRating
            value={userRating}
            onChange={handleRate}
            size="lg"
          />
          {saving && <span className="text-xs text-gray-400">Enregistrement...</span>}
          {userRating > 0 && !saving && (
            <span className="text-xs text-gray-400">
              Vous avez noté {userRating}/5
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
