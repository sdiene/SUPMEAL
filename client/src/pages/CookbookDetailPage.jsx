import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCookbook,
  deleteCookbook,
  inviteMember,
  updateMemberRole,
  removeMember,
  getMessages,
  postMessage,
  deleteMessage,
  addRecipeToCookbook,
} from "../api/cookbooks";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import RecipeCard from "../components/RecipeCard";
import { toggleFavorite } from "../api/recipes";
const ROLES = ["OWNER", "EDITOR", "READER", "COMMENTER"];
export default function CookbookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cookbook, setCookbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recipes");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("READER");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [myRecipes, setMyRecipes] = useState([]);
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msgContent, setMsgContent] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    getCookbook(id)
      .then((res) => setCookbook(res.data.cookbook))
      .catch(() => navigate("/cookbooks"))
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    if (showAddRecipe) {
      apiClient.get("/api/recipes").then((res) => setMyRecipes(res.data.recipes));
    }
  }, [showAddRecipe]);

  useEffect(() => {
    if (activeTab === "messages") {
      getMessages(id).then((res) => setMessages(res.data.messages));
      const interval = setInterval(() => {
        getMessages(id).then((res) => setMessages(res.data.messages));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, id]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const myRole = cookbook?.members.find((m) => m.userId === user?.id)?.role;
  const isOwner = myRole === "OWNER";
  async function handleAddRecipe(recipeId) {
    setAddingRecipe(true);
    try {
      const res = await addRecipeToCookbook(id, recipeId);
      setCookbook((prev) => ({
        ...prev,
        recipes: [...prev.recipes, res.data.recipe],
      }));
      setShowAddRecipe(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingRecipe(false);
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    setInviting(true);
    setInviteError("");
    try {
      const res = await inviteMember(id, inviteEmail, inviteRole);
      setCookbook((prev) => ({
        ...prev,
        members: [...prev.members, res.data.member],
      }));
      setInviteEmail("");
    } catch (err) {
      setInviteError(err.response?.data?.error || "Erreur");
    } finally {
      setInviting(false);
    }
  }
  async function handleRoleChange(userId, role) {
    try {
      await updateMemberRole(id, userId, role);
      setCookbook((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.userId === userId ? { ...m, role } : m
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  }
  async function handleRemoveMember(userId) {
    if (!confirm("Retirer ce membre ?")) return;
    try {
      await removeMember(id, userId);
      setCookbook((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.userId !== userId),
      }));
    } catch (err) {
      console.error(err);
    }
  }
  async function handleDeleteCookbook() {
    if (!confirm("Supprimer ce cookbook définitivement ?")) return;
    try {
      await deleteCookbook(id);
      navigate("/cookbooks");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!msgContent.trim()) return;
    setSendingMsg(true);
    try {
      const res = await postMessage(id, msgContent);
      setMessages((prev) => [...prev, res.data.message]);
      setMsgContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  }
  async function handleDeleteMessage(messageId) {
    try {
      await deleteMessage(id, messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      console.error(err);
    }
  }
  async function handleFavoriteToggle(recipeId) {
    try {
      const res = await toggleFavorite(recipeId);
      setCookbook((prev) => ({
        ...prev,
        recipes: prev.recipes.map((r) =>
          r.id === recipeId ? { ...r, isFavorite: res.data.recipe.isFavorite } : r
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  }
  if (loading) return <p className="text-gray-400">Chargement...</p>;
  if (!cookbook) return null;
  const tabs = ["recipes", "members", "messages"];
  const tabLabels = { recipes: "🍽️ Recettes", members: "👥 Membres", messages: "💬 Messages" };
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-sm mb-2 block">
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📚 {cookbook.name}</h1>
          {cookbook.description && (
            <p className="text-gray-400 dark:text-gray-400 mt-1">{cookbook.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">Mon rôle : <span className="font-medium text-blue-600">{myRole}</span></p>
        </div>
        {isOwner && (
          <button
            onClick={handleDeleteCookbook}
            className="text-sm bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            🗑️ Supprimer
          </button>
        )}
      </div>
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>
      {/* Recettes */}
      {activeTab === "recipes" && (
        <div>
          {(myRole === "OWNER" || myRole === "EDITOR") && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setShowAddRecipe(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                + Ajouter une recette existante
              </button>
              
              <a
                href={"/recipes/new?cookbookId=" + id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                + Créer une nouvelle recette
              </a>
            </div>
          )}

          {showAddRecipe && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800 dark:text-white">Ajouter une recette</h2>
                  <button onClick={() => setShowAddRecipe(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                </div>
                {myRecipes.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Aucune recette personnelle disponible</p>
                ) : (
                  <div className="space-y-2">
                    {myRecipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white text-sm">{recipe.title}</p>
                          <p className="text-xs text-gray-400">
                            {recipe.prepTime ? recipe.prepTime + " min prep" : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddRecipe(recipe.id)}
                          disabled={addingRecipe}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                          Ajouter
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {cookbook.recipes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
              <p className="text-gray-400">Aucune recette dans ce cookbook</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {cookbook.recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {/* Membres */}
      {activeTab === "members" && (
        <div className="space-y-4">
          {/* Invitation (OWNER uniquement) */}
          {isOwner && (
            <form onSubmit={handleInvite} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200">Inviter un membre</h2>
              {inviteError && <p className="text-red-500 text-sm">{inviteError}</p>}
              <div className="flex gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email de l'utilisateur"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={inviting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {inviting ? "..." : "Inviter"}
                </button>
              </div>
            </form>
          )}
          {/* Liste membres */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {cookbook.members.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {member.user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{member.user?.name}</p>
                  <p className="text-xs text-gray-400">{member.user?.email}</p>
                </div>
                {isOwner && member.userId !== user?.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                    {member.role}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Messages */}
      {activeTab === "messages" && (
        <div className="flex flex-col h-[60vh] dark:text-white">
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 mb-4">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucun message pour l'instant</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.userId === user?.id ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                    {msg.user?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className={`max-w-xs ${msg.userId === user?.id ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <p className="text-xs text-gray-400">{msg.user?.name}</p>
                    <div className={`px-3 py-2 rounded-xl text-sm ${msg.userId === user?.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                      {msg.content}
                    </div>
                    {msg.userId === user?.id && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={msgContent}
              onChange={(e) => setMsgContent(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={sendingMsg || !msgContent.trim()}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
