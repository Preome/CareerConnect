// src/pages/QueryForumPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/query-forum";

const QueryForumPage = () => {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const token = localStorage.getItem("token");

  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);

  const avatarUrl = profile?.imageUrl || null;
  const authorId = profile._id || "guest-user";
  const authorName = profile.name || "User";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data || []);
      } catch (err) {
        console.error("GET /query-forum error", err);
        alert(err.response?.data?.error || "Failed to load queries");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    try {
      const res = await axios.post(
        API,
        {
          title: title.trim(),
          body: body.trim(),
          authorId,
          authorName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions((prev) => [res.data, ...prev]);
      setTitle("");
      setBody("");
    } catch (err) {
      console.error("POST /query-forum error", err);
      alert(err.response?.data?.error || "Failed to post query");
    }
  };

  const handleReply = async (qId) => {
    const text = replyText[qId]?.trim();
    if (!text) return;

    try {
      const res = await axios.post(
        `${API}/${qId}/replies`,
        {
          text,
          authorId,
          authorName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions((prev) =>
        prev.map((q) => (q._id === qId ? res.data : q))
      );
      setReplyText((prev) => ({ ...prev, [qId]: "" }));
    } catch (err) {
      console.error("POST /query-forum/:id/replies error", err);
      alert(err.response?.data?.error || "Failed to send reply");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <header className="w-full flex items-center justify-between px-8 py-3 bg-slate-900 text-white relative">
        <h1 className="text-2xl font-semibold">CareerConnect</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-full px-3 py-1">
            <span className="text-gray-500 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm text-gray-700"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-52 bg-slate-900 text-white pt-6 sticky top-0 self-start h-screen">
          <div className="flex flex-col items-center mb-6">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-14 h-14 rounded bg-slate-700 mb-2 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded bg-slate-700 mb-2" />
            )}
            <span className="text-xs text-gray-300">
              {profile?.name || "User"}
            </span>
          </div>

          <nav className="flex flex-col text-sm">
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/user-dashboard")}
            >
              Home
            </button>
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/applied-jobs")}
            >
              Applied Jobs
            </button>
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/followed-jobs")}
            >
              Followed Jobs
            </button>
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/messages")}
            >
              Messages
            </button>
            <button className="text-left px-4 py-2 bg-indigo-600">
              Query Forum
            </button>
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/user-profile")}
            >
              Profile
            </button>
          </nav>
        </aside>

        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 py-8 px-4 md:px-8">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#4b2bb3]">
                Query Forum
              </h2>
            </div>

            <form
              onSubmit={handleCreate}
              className="border rounded-lg p-4 mb-6 bg-slate-50 space-y-3"
            >
              <h3 className="font-semibold text-sm text-slate-800">
                Post a new query
              </h3>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Title of your query"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full border rounded px-3 py-2 text-sm"
                rows={3}
                placeholder="Describe your question..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#6c3cf0] hover:bg-[#5a32c7] text-white px-4 py-2 rounded text-sm"
              >
                Post query
              </button>
            </form>

            {loading ? (
              <p className="text-sm text-gray-600">Loading queries...</p>
            ) : questions.length === 0 ? (
              <p className="text-sm text-gray-600">
                No queries yet. Be the first to ask something.
              </p>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <div
                    key={q._id}
                    className="border rounded-lg p-4 bg-slate-50 space-y-3"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {q.title}
                      </h4>
                      <p className="text-sm mt-1 whitespace-pre-line">
                        {q.body}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        by {q.authorName || "User"} •{" "}
                        {new Date(q.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {q.replies && q.replies.length > 0 ? (
                        q.replies.map((r) => (
                          <div
                            key={r._id}
                            className="bg-white rounded px-3 py-2 text-sm border"
                          >
                            <p>{r.text}</p>
                            <p className="text-[10px] text-slate-500 mt-1">
                              {r.authorName || "User"} •{" "}
                              {new Date(r.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[12px] text-slate-400">
                          No replies yet. Start the discussion.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t mt-2">
                      <input
                        className="flex-1 border rounded px-3 py-2 text-sm"
                        placeholder="Write a reply..."
                        value={replyText[q._id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [q._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleReply(q._id)}
                        className="bg-[#6c3cf0] hover:bg-[#5a32c7] text-white px-4 py-2 rounded text-sm"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QueryForumPage;
