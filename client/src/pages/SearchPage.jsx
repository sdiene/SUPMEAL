import { useState } from "react";
import { Link } from "react-router-dom";
import { getPublicRecipes, toggleFavorite } from "../api/recipes";
import { searchProfiles } from "../api/profiles";
import { getPublicCookbooks, copyRecipeToMyRecipes } from "../api/cookbooks";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("public-recipes");
  const [chefQ, setChefQ] = useState("");
  const [chefs, setChefs] = useState([]);
  const [chefsLoading, setChefsLoading] = useState(false);
  const [chefsSearched, setChefsSearched] = useState(false);
  const [rq, setRq] = useState("");
  const [rtags, setRtags] = useState("");
  const [ringredient, setRingredient] = useState("");
  const [rmaxPrep, setRmaxPrep] = useState("");
  const [rmaxCook, setRmaxCook] = useState("");
  const [publicRecipes, setPublicRecipes] = useState([]);
  const [rLoading, setRLoading] = useState(false);
  const [rSearched, setRSearched] = useState(false);
  const [cq, setCq] = useState("");
  const [publicCookbooks, setPublicCookbooks] = useState([]);
  const [cLoading, setCLoading] = useState(false);
  const [cSearched, setCSearched] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  async function handleRecipeSearch(e) {
    e?.preventDefault();
    setRLoading(true);
    setRSearched(true);
    try {
      const params = {};
      if (rq) params.q = rq;
      if (rtags) params.tags = rtags;
      if (ringredient) params.ingredient = ringredient;
      if (rmaxPrep) params.maxPrepTime = rmaxPrep;
      if (rmaxCook) params.maxCookTime = rmaxCook;
      const res = await getPublicRecipes(params);
      setPublicRecipes(res.data.recipes);
    } catch (err) {
      console.error(err);
    } finally {
      setRLoading(false);
    }
  }
  async function handleChefsSearch(e) {
    e?.preventDefault();
    setChefsLoading(true);
    setChefsSearched(true);
    try {
      const res = await searchProfiles(chefQ);
      setChefs(res.data.profiles);
    } catch (err) {
      console.error(err);
    } finally {
      setChefsLoading(false);
    }
  }

  async function handleCookbookSearch(e) {
    e?.preventDefault();
    setCLoading(true);
    setCSearched(true);
    try {
      const params = {};
      if (cq) params.q = cq;
      const res = await getPublicCookbooks(params);
      setPublicCookbooks(res.data.cookbooks);
    } catch (err) {
      console.error(err);
    } finally {
      setCLoading(false);
    }
  }
  async function handleCopy(recipeId) {
    try {
      await copyRecipeToMyRecipes(recipeId);
      setCopySuccess(recipeId);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        🌍 Découverte
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        Explorez les recettes et cookbooks partagés par la communauté
      </p>

      {/* Onglets */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
        {[
          { id: "public-recipes", label: "��️ Recettes publiques" },
          { id: "public-cookbooks", label: "📚 Cookbooks publics" },
          { id: "chefs", label: "👨‍🍳 Cuisiniers" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== Recettes publiques ===== */}
      {activeTab === "public-recipes" && (
        <div>
          <form onSubmit={handleRecipeSearch} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 space-y-3">
            <div>
              <input
                type="text"
                value={rq}
                onChange={(e) => setRq(e.target.value)}
                placeholder="Rechercher par titre..."
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">🛒 Ingrédient</label>
                <input
                  type="text"
                  value={ringredient}
                  onChange={(e) => setRingredient(e.target.value)}
                  placeholder="Ex : poulet..."
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">🏷️ Tags</label>
                <input
                  type="text"
                  value={rtags}
                  onChange={(e) => setRtags(e.target.value)}
                  placeholder="Ex : Dessert, Facile..."
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">⏱ Prépa max (min)</label>
                <input
                  type="number"
                  value={rmaxPrep}
                  onChange={(e) => setRmaxPrep(e.target.value)}
                  placeholder="Ex : 30"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">🔥 Cuisson max (min)</label>
                <input
                  type="number"
                  value={rmaxCook}
                  onChange={(e) => setRmaxCook(e.target.value)}
                  placeholder="Ex : 45"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={rLoading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {rLoading ? "Recherche..." : "🔍 Rechercher"}
            </button>
          </form>

          {rSearched && publicRecipes.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
              <p className="text-gray-400">Aucune recette publique trouvée</p>
            </div>
          )}

          {publicRecipes.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-4">
                {publicRecipes.length} recette{publicRecipes.length > 1 ? "s" : ""} trouvée{publicRecipes.length > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-3 gap-4">
                {publicRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {recipe.imageUrl ? (
                      <img src={API_URL + recipe.imageUrl} alt={recipe.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-4xl">🍽️</div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{recipe.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">Par {recipe.user?.name || "Anonyme"}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {recipe.prepTime ? `⏱ ${recipe.prepTime} min` : ""}
                        {recipe.cookTime ? ` · 🔥 ${recipe.cookTime} min` : ""}
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {recipe.tags?.slice(0, 3).map((rt) => (
                          <span key={rt.tagId || rt.tag?.name} className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                            {rt.tag?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!rSearched && (
            <div className="text-center py-12 text-gray-300 dark:text-gray-600">
              <p className="text-5xl mb-3">🌍</p>
              <p>Recherchez parmi les recettes partagées par la communauté</p>
            </div>
          )}
        </div>
      )}

      {/* ===== Cuisiniers ===== */}
      {activeTab === "chefs" && (
        <div>
          <form onSubmit={handleChefsSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              value={chefQ}
              onChange={(e) => setChefQ(e.target.value)}
              placeholder="Rechercher un cuisinier par nom..."
              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={chefsLoading}
              className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {chefsLoading ? "..." : "🔍 Rechercher"}
            </button>
          </form>

          {chefsSearched && chefs.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
              <p className="text-gray-400">Aucun cuisinier trouvé</p>
            </div>
          )}

          {chefs.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {chefs.map((chef) => (
                <Link
                  key={chef.id}
                  to={`/profile/${chef.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xl flex-shrink-0">
                    {chef.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{chef.name}</h3>
                    <div className="flex gap-3 text-xs text-gray-400 mt-1">
                      <span>🍽️ {chef._count.recipes} recettes</span>
                      <span>👥 {chef._count.followers} abonnés</span>
                    </div>
                  </div>
                  <span className="text-red-600 dark:text-red-400 text-sm">→</span>
                </Link>
              ))}
            </div>
          )}

          {!chefsSearched && (
            <div className="text-center py-12 text-gray-300 dark:text-gray-600">
              <p className="text-5xl mb-3">👨‍🍳</p>
              <p>Recherchez des cuisiniers par nom pour découvrir leurs recettes</p>
            </div>
          )}
        </div>
      )}

      {/* ===== Cookbooks publics ===== */}
      {activeTab === "public-cookbooks" && (
        <div>
          <form onSubmit={handleCookbookSearch} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={cq}
                onChange={(e) => setCq(e.target.value)}
                placeholder="Rechercher un cookbook public..."
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                disabled={cLoading}
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {cLoading ? "..." : "🔍 Rechercher"}
              </button>
            </div>
          </form>

          {cSearched && publicCookbooks.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
              <p className="text-gray-400">Aucun cookbook public trouvé</p>
            </div>
          )}

          {publicCookbooks.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                {publicCookbooks.length} cookbook{publicCookbooks.length > 1 ? "s" : ""} trouvé{publicCookbooks.length > 1 ? "s" : ""}
              </p>
              {publicCookbooks.map((cb) => (
                <div key={cb.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-lg">📚 {cb.name}</h3>
                      {cb.description && <p className="text-sm text-gray-400 mt-1">{cb.description}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        Par {cb.members[0]?.user?.name || "Anonyme"} · {cb.recipes.length} recette{cb.recipes.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">🌍 Public</span>
                  </div>

                  {cb.recipes.length === 0 ? (
                    <p className="text-sm text-gray-400">Aucune recette dans ce cookbook</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {cb.recipes.map((recipe) => (
                        <div key={recipe.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg gap-3">
                          <Link
                            to={`/recipes/${recipe.id}`}
                            className="flex-1 min-w-0 hover:text-red-600 transition-colors"
                          >
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{recipe.title}</p>
                            <p className="text-xs text-gray-400">
                              {recipe.prepTime ? `⏱ ${recipe.prepTime} min` : ""}
                              {recipe.cookTime ? ` · 🔥 ${recipe.cookTime} min` : ""}
                            </p>
                          </Link>
                          <button
                            onClick={() => handleCopy(recipe.id)}
                            disabled={copySuccess === recipe.id}
                            className={`text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors ${
                              copySuccess === recipe.id
                                ? "bg-green-100 text-green-600"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            {copySuccess === recipe.id ? "✅ Copié" : "📋 Copier"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {!cSearched && (
            <div className="text-center py-12 text-gray-300 dark:text-gray-600">
              <p className="text-5xl mb-3">📚</p>
              <p>Recherchez parmi les cookbooks partagés par la communauté</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
