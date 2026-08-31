import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../api/profiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRss, faUtensils, faGlobe, faStopwatch, faFire } from "@fortawesome/free-solid-svg-icons";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export default function FeedPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeed()
      .then((res) => setRecipes(res.data.recipes))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <p className="text-gray-400">Chargement...</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
<FontAwesomeIcon icon={faRss} /> Fil d'actualité
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        Les dernières recettes des cuisiniers que vous suivez
      </p>

      {recipes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <p className="text-4xl mb-3"><FontAwesomeIcon icon={faRss} /></p>
          <p className="text-gray-400 mb-2">Votre fil est vide pour l'instant</p>
          <p className="text-gray-300 dark:text-gray-600 text-sm mb-4">
            Suivez des cuisiniers pour voir leurs nouvelles recettes ici
          </p>
          <Link
            to="/search"
            className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            <FontAwesomeIcon icon={faGlobe} /> Découvrir des cuisiniers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {recipe.imageUrl ? (
                <img
                  src={API_URL + recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-4xl">
                  <FontAwesomeIcon icon={faUtensils} />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">{recipe.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Par{" "}
                  <span
                    className="text-red-600 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/profile/${recipe.user?.id}`;
                    }}
                  >
                    {recipe.user?.name}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  {recipe.prepTime ? <span><FontAwesomeIcon icon={faStopwatch} /> {recipe.prepTime} min</span> : null}
                  {recipe.cookTime ? <span><FontAwesomeIcon icon={faFire} /> {recipe.cookTime} min</span> : null}
                </p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {recipe.tags?.slice(0, 3).map((rt) => (
                    <span
                      key={rt.tag?.name}
                      className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full"
                    >
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
  );
}
