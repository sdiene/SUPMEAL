import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWeekPlan, addToMealPlan, removeFromMealPlan, getShoppingList } from "../api/mealplan";
import { getRecipes } from "../api/recipes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faChevronLeft,
  faChevronRight,
  faCartShopping,
  faXmark,
  faPlus,
  faSun,
  faMoon,
  faAppleWhole,
} from "@fortawesome/free-solid-svg-icons";
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MEAL_TYPES = [
  { value: "BREAKFAST", label: <><FontAwesomeIcon icon={faSun} /> Petit-déjeuner</> },
  { value: "LUNCH", label: <><FontAwesomeIcon icon={faSun} /> Déjeuner</> },
  { value: "DINNER", label: <><FontAwesomeIcon icon={faMoon} /> Dîner</> },
  { value: "SNACK", label: <><FontAwesomeIcon icon={faAppleWhole} /> Collation</> },
];
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function formatDate(date) {
  return date.toISOString().split("T")[0];
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
export default function MealPlanPage() {
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRecipes, setMyRecipes] = useState([]);
  const [showModal, setShowModal] = useState(null); // { date, mealType }
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [adding, setAdding] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);
  const [showShopping, setShowShopping] = useState(false);
  const [shoppingLoading, setShoppingLoading] = useState(false);
  useEffect(() => {
    loadWeek();
  }, [weekStart]);
  async function loadWeek() {
    setLoading(true);
    try {
      const [plansRes, recipesRes] = await Promise.all([
        getWeekPlan(formatDate(weekStart)),
        getRecipes(),
      ]);
      setPlans(plansRes.data.plans);
      setMyRecipes(recipesRes.data.recipes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  function getPlanForSlot(dayIndex, mealType) {
    const date = formatDate(addDays(weekStart, dayIndex));
    return plans.filter(
      (p) =>
        formatDate(new Date(p.date)) === date &&
        p.mealType === mealType
    );
  }
  async function handleAdd() {
    if (!selectedRecipe || !showModal) return;
    setAdding(true);
    try {
      const res = await addToMealPlan(
        selectedRecipe,
        showModal.date,
        showModal.mealType
      );
      setPlans((prev) => [...prev, res.data.plan]);
      setShowModal(null);
      setSelectedRecipe("");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  }
  async function handleRemove(id) {
    try {
      await removeFromMealPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  }
  async function handleShoppingList() {
    setShoppingLoading(true);
    setShowShopping(true);
    try {
      const res = await getShoppingList(formatDate(weekStart));
      setShoppingList(res.data.ingredients);
    } catch (err) {
      console.error(err);
    } finally {
      setShoppingLoading(false);
    }
  }
  const weekLabel = `${weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} — ${addDays(weekStart, 6).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white"><FontAwesomeIcon icon={faCalendarDays} /> Planning de repas</h1>
          <p className="text-gray-400 text-sm mt-1">{weekLabel}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
          >
<FontAwesomeIcon icon={faChevronLeft} /> Semaine précédente
          </button>
          <button
            onClick={() => setWeekStart(getMonday(new Date()))}
            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Semaine suivante <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <button
            onClick={handleShoppingList}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            <FontAwesomeIcon icon={faCartShopping} /> Liste de courses
          </button>
        </div>
      </div>
      {/* Grille calendrier */}
      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr>
                <th className="w-32 p-2 border border-gray-200 dark:border-gray-700"></th>
                {DAYS.map((day, i) => (
                  <th key={day} className="p-2 text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{day}</div>
                    <div className="text-xs text-gray-400">
                      {addDays(weekStart, i).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEAL_TYPES.map((meal) => (
                <tr key={meal.value} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    {meal.label}
                  </td>
                  {DAYS.map((day, dayIndex) => {
                    const date = formatDate(addDays(weekStart, dayIndex));
                    const slotPlans = getPlanForSlot(dayIndex, meal.value);
                    return (
                      <td key={day} className="p-1 align-top min-w-[120px] border border-gray-200 dark:border-gray-700">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-1 min-h-[80px]">
                          {slotPlans.map((plan) => (
                            <div
                              key={plan.id}
                              className="bg-white dark:bg-gray-700 rounded-lg p-2 mb-1 group relative"
                            >
                              <Link
                                to={`/recipes/${plan.recipeId}`}
                                className="text-xs font-medium text-gray-800 dark:text-white hover:text-red-600 line-clamp-2"
                              >
                                {plan.recipe.title}
                              </Link>
                              <button
                                onClick={() => handleRemove(plan.id)}
                                className="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                              >
                                <FontAwesomeIcon icon={faXmark} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setShowModal({ date, mealType: meal.value });
                              setSelectedRecipe("");
                            }}
                            className="w-full text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded py-1 transition-colors"
                          >
                            <FontAwesomeIcon icon={faPlus} /> Ajouter
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal ajout recette */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 dark:text-white">
                Ajouter une recette
              </h2>
              <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-gray-600 text-xl"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {MEAL_TYPES.find((m) => m.value === showModal.mealType)?.label} —{" "}
              {new Date(showModal.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Choisir une recette...</option>
              {myRecipes.map((r) => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={!selectedRecipe || adding}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {adding ? "Ajout..." : "Ajouter au planning"}
              </button>
              <button
                onClick={() => setShowModal(null)}
                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal liste de courses */}
      {showShopping && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 dark:text-white">
<FontAwesomeIcon icon={faCartShopping} /> Liste de courses — semaine du {weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
              </h2>
              <button onClick={() => setShowShopping(false)} className="text-gray-400 hover:text-gray-600 text-xl"><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            {shoppingLoading ? (
              <p className="text-gray-400 text-center py-4">Génération...</p>
            ) : shoppingList.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Aucun ingrédient — ajoutez des recettes au planning d'abord</p>
            ) : (
              <ul className="space-y-2">
                {shoppingList.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <input type="checkbox" className="w-4 h-4 accent-red-600" />
                    <span className="text-sm text-gray-800 dark:text-white flex-1">{ing.name}</span>
                    {ing.quantity && (
                      <span className="text-sm text-gray-400">
                        {ing.quantity} {ing.unit || ""}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
