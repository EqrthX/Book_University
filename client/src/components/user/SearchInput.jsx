import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, BookOpen } from "lucide-react";
import axios, { SERVER_URL } from "../../util/axios.js";

function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch live search results with debounce
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await axios.get(`/search-books?book=${query}`, { withCredentials: true });
        setResults(res.data.books || []);
      } catch (err) {
        console.error("Error fetching live search results:", err);
      }
    }, 250); // 250ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/user/search?book=${query}`);
      setIsOpen(false);
    }
  };

  const handleSelectResult = (bookId) => {
    navigate(`/user/DetailsPage/${bookId}`);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full sm:w-[320px] ml-4 md:ml-20">
      {/* Search Bar Form */}
      <form 
        onSubmit={handleSearchSubmit} 
        className="bg-white/10 backdrop-blur-sm border border-white/15 focus-within:bg-white focus-within:border-white focus-within:shadow-md focus-within:text-slate-800 text-white px-4 py-2.5 flex items-center space-x-3 rounded-xl transition-all duration-300"
      >
        <button type="submit" className="text-current opacity-70 hover:opacity-100 transition-opacity">
          <Search className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
        </button>
        <input
          type="text"
          className="outline-none flex-1 bg-transparent text-sm font-medium placeholder-white/60 focus:placeholder-slate-400"
          placeholder="ค้นหาชื่อหนังสือ วิชา..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button 
            type="button" 
            onClick={() => {
              setQuery("");
              setResults([]);
            }} 
            className="text-current opacity-50 hover:opacity-100"
          >
            <X className="w-4 h-4 cursor-pointer" />
          </button>
        )}
      </form>

      {/* Floating suggestion list */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white text-slate-800 shadow-2xl rounded-2xl border border-slate-100 z-[150] overflow-hidden max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="p-2 flex flex-col gap-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-3.5 py-1.5 border-b border-slate-50">
                📚 หนังสือเรียนที่ค้นพบ ({results.length})
              </p>
              {results.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectResult(book.id)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-10 h-12 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <img 
                      src={book.bookPic ? `${SERVER_URL}/${book.bookPic.replace(/\\/g, "/")}` : "https://via.placeholder.com/40x50"} 
                      className="h-full object-contain"
                      alt={book.titleBook} 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{book.titleBook}</p>
                    <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                      วิชา: {book.subjectCode || "ไม่มีรหัสวิชา"} • {book.price} ฿
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2 animate-bounce-subtle" />
              <p className="text-xs font-bold">ไม่พบหนังสือเรียนที่ค้นหา</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchInput;
