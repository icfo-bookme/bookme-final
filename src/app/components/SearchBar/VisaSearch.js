"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchButton from "../../../utils/SearchButton";
import getCountries from "@/services/visa/getCountries";
import { LuMapPin } from "react-icons/lu";

const VisaSearch = () => {
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCountries();
        if (res?.data?.length) {
          setDestinations(res.data);
          setSearchQuery(res.data[0].name);
          setSelectedLocationId(res.data[0].id);
        } else {
          setError("No destinations available");
        }
      } catch {
        setError("Failed to load destinations");
      }
    })();
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const coachLeven = (a, b) => {
    const m = a.length, n = b.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
      }
    }
    return dp[m][n];
  };

  const score = (dest, query) => {
    const q = query.toLowerCase().replace(/[^a-z]/g, "");
    const d = dest.name.toLowerCase().replace(/[^a-z]/g, "");
    if (!q) return 0;
    if (d.startsWith(q)) return 100;
    const dist = coachLeven(q, d);
    const ratio = dist / Math.max(d.length, q.length);
    const levenScore = Math.max(0, 100 - ratio * 100);

    let overlap = 0;
    const df = d.split("").reduce((a, c) => ({ ...a, [c]: (a[c] || 0) + 1 }), {});
    const qf = q.split("").reduce((a, c) => ({ ...a, [c]: (a[c] || 0) + 1 }), {});
    let total = 0;
    for (const ch in df) {
      const m = Math.min(df[ch], qf[ch] || 0);
      overlap += m;
      total += df[ch];
    }
    const overlapScore = total ? (overlap / total) * 100 : 0;

    return Math.round(0.7 * levenScore + 0.3 * overlapScore);
  };

  const highlight = (text, query) => {
    if (!query) return text;
    const q = query.toLowerCase();
    const t = text;
    const res = [];
    let last = 0;
    for (let i = 0; i < t.length; i++) {
      const ch = t[i].toLowerCase();
      if (q.includes(ch)) {
        if (i > last) res.push(t.substring(last, i));
        res.push(<span key={i} className="font-bold text-blue-600">{t[i]}</span>);
        last = i + 1;
      }
    }
    if (last < t.length) res.push(t.substring(last));
    return res.length ? res : text;
  };

  const update = (q) => {
    setSearchQuery(q);
    if (!q) {
      setSuggestions(destinations);
      return;
    }
    const scored = destinations.map(d => ({ ...d, scoreValue: score(d, q) }));
    const filtered = scored.filter(d => d.scoreValue > 0);
    const sorted = filtered.sort((a, b) => b.scoreValue - a.scoreValue).slice(0, 8);
    setSuggestions(sorted);
  };

  const onChange = (e) => {
    update(e.target.value);
    setSelectedLocationId("");
  };

  const onFocus = () => {
    if (isFirst) {
      setIsFirst(false);
      setSuggestions(destinations);
      setSearchQuery("");
      setSelectedLocationId("");
    } else {
      update(searchQuery);
    }
    setShowSuggestions(true);
  };

  const select = (d) => {
    setSearchQuery(d.name);
    setSelectedLocationId(d.id);
    setShowSuggestions(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!selectedLocationId) {
      alert("Please select a valid destination");
    } else {
      router.push(`/visa/${selectedLocationId}`);
    }
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto pb-6  relative" ref={ref}>
      <form onSubmit={onSubmit}>
        <div className="space-y-1">
          <label className="block text-sm text-blue-950">Destination Country</label>
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LuMapPin className="h-5 w-5 text-blue-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={onChange}
              onFocus={onFocus}
              placeholder="Search visa destinations..."
              className="p-2 h-12 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors w-full font-bold text-blue-950 text-lg pl-10"
              aria-autocomplete="list"
              aria-controls="visa-suggestions"
            />
          {showSuggestions && suggestions.length > 0 && (
            <div
              id="visa-suggestions"
              className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-auto z-30"
              role="listbox"
            >
              {suggestions.map((d, idx) => (
                <div
                  key={d.id}
                  role="option"
                  aria-selected={d.id === selectedLocationId}
                  className={`p-2 hover:bg-blue-50 cursor-pointer flex justify-between ${idx === 0 ? "font-semibold" : ""
                    }`}
                  onClick={() => select(d)}
                >
                  <div>{highlight(d.name, searchQuery)}</div>
                  {idx === 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Best match</span>}
                </div>
              ))}
            </div>
          )}
          </div>
          <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
            <SearchButton type="submit">Search Visa</SearchButton>
          </div>
      </form>
    </div>
  );
};

export default VisaSearch;
