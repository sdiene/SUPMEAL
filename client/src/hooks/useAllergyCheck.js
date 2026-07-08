import { useAuth } from "../context/AuthContext";
export function useAllergyCheck() {
  const { user } = useAuth();

  const allergies = (user?.allergies || "")
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);

  function checkIngredients(ingredients = []) {
    if (!allergies.length) return [];
    return ingredients.filter((ing) =>
      allergies.some((allergy) =>
        ing.name.toLowerCase().includes(allergy)
      )
    );
  }
  function isDietCompatible(tags = []) {
    if (!user?.diet) return true;
    const diet = user.diet.toLowerCase();
    const tagNames = tags.map((rt) => (rt.tag?.name || rt).toLowerCase());

    const incompatible = {
      végétarien: ["viande", "boeuf", "poulet", "porc", "agneau", "veau", "canard"],
      vegan: ["viande", "boeuf", "poulet", "porc", "agneau", "veau", "canard", "oeuf", "lait", "fromage", "beurre", "crème"],
      "sans gluten": ["blé", "gluten", "farine", "pain", "pâtes"],
      halal: ["porc", "alcool", "vin", "bière"],
    };
    const rules = Object.entries(incompatible).find(([key]) =>
      diet.includes(key)
    );
    if (!rules) return true;
    return !rules[1].some((forbidden) =>
      tagNames.some((tag) => tag.includes(forbidden))
    );
  }
  return { allergies, checkIngredients, isDietCompatible };
}
