import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState("");

  const API_KEY = "ddd1522f"; // your OMDb API key

  const searchMovies = async () => {
    if (!query) return;

    setMessage(""); // clear old message

    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const data = await res.json();

    if (!data.Search) {
      setMovies([]);
      setMessage("❌ Movie not found");
      return;
    }

    // Get full details (for rating + plot)
    const details = await Promise.all(
      data.Search.map(async (m) => {
        const r = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}&plot=short`
        );
        return r.json();
      })
    );

    setMovies(details);
  };

  return (
    <div className="app">
      <h1>🎬 Movie / TV Search App</h1>

      <div className="search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movie..."
        />
        <button onClick={searchMovies}>Search</button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="results">
        {movies.map((m) => (
          <div key={m.imdbID} className="card">
            {m.Poster !== "N/A" && <img src={m.Poster} alt={m.Title} />}
            <h3>{m.Title}</h3>
            <p><strong>Year:</strong> {m.Year}</p>
            <p><strong>Rating: </strong>{m.imdbRating}</p>
            <p><strong>Description: </strong>{m.Plot}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
