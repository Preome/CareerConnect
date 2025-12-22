import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [q, setQ] = useState(initial);
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [companyJobs, setCompanyJobs] = useState({});
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // debounce
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!q) {
      setResults([]);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      fetchResults(q);
    }, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [q]);

  const fetchResults = async (term) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/company/search?search=${encodeURIComponent(term)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const openCompanyProfile = (company) => {
    try {
      const toStore = { ...company, id: company._id || company.id };
      localStorage.setItem("profile", JSON.stringify(toStore));
    } catch (e) {
      console.error(e);
    }
    navigate("/company-profile");
  };

  const toggleExpand = async (company) => {
    const id = company._id || company.id;
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);

    // fetch jobs for this company (uses new companyId filter)
    if (!companyJobs[id]) {
      try {
        const res = await fetch(`${API_BASE_URL}/jobs?companyId=${encodeURIComponent(id)}`);
        const data = await res.json();
        setCompanyJobs((s) => ({ ...s, [id]: Array.isArray(data) ? data : [] }));
      } catch (err) {
        console.error("Failed to fetch company jobs", err);
        setCompanyJobs((s) => ({ ...s, [id]: [] }));
      }
    }
  };

  const applyToJob = (job, company) => {
    const jobId = job._id || job.id;
    navigate(`/apply-job/${jobId}`, {
      state: {
        companyName: company.companyName || company.name,
        companyId: company._id || company.id,
        jobTitle: job.title || job.jobTitle || "",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-4">
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search companies..."
            className="w-full px-3 py-2 border rounded"
          />
          <button onClick={() => setQ("")} className="px-3 py-2 bg-gray-200 rounded">Clear</button>
        </div>

        <div className="mt-4">
          {loading && <div className="text-sm text-gray-500">Searching...</div>}

          {!loading && results.length === 0 && q && (
            <div className="text-sm text-gray-500">No results</div>
          )}

          <ul className="mt-2">
            {results.map((c) => {
              const id = c._id || c.id;
              return (
                <li key={id} className="p-2 border-b">
                  <div className="flex items-center gap-3">
                    <img src={c.imageUrl || ""} alt="logo" className="w-10 h-10 rounded object-cover bg-gray-200" />
                    <div className="flex-1">
                      <div className="font-semibold">{c.companyName || c.name || "Company"}</div>
                      <div className="text-xs text-gray-500">{c.industryType || c.tagline || ""}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openCompanyProfile(c)} className="px-3 py-1 bg-gray-100 rounded text-sm">Profile</button>
                      <button onClick={() => toggleExpand(c)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Jobs</button>
                    </div>
                  </div>

                  {expanded === id && (
                    <div className="mt-2 ml-12">
                      <h4 className="text-sm font-medium mb-2">Jobs</h4>
                      <ul>
                        {(companyJobs[id] || []).length === 0 && (
                          <li className="text-xs text-gray-500">No jobs found for this company.</li>
                        )}
                        {(companyJobs[id] || []).map((job) => (
                          <li key={job._id || job.id} className="flex items-center justify-between py-2">
                            <div>
                              <div className="font-medium">{job.title}</div>
                              <div className="text-xs text-gray-500">{new Date(job.deadline || job.createdAt || "").toLocaleDateString()}</div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => applyToJob(job, c)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Apply</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
