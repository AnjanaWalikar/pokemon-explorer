import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await res.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );

        setAllPokemons(pokemonDetails);
        setFilteredPokemons(pokemonDetails);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon data.');
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  // Search handler
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterPokemons(term, selectedType);
  };

  // Type filter handler
  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    filterPokemons(searchTerm, type);
  };

  // Filter by name and type
  const filterPokemons = (name, type) => {
    let filtered = allPokemons;

    if (name) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(name)
      );
    }

    if (type) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((t) => t.type.name === type)
      );
    }

    setFilteredPokemons(filtered);
  };

  return (
    <div className="App">
      <header className="header">Pokémon Explorer</header>

      <div className="filters">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={searchTerm}
          onChange={handleSearch}
        />

        <select value={selectedType} onChange={handleTypeChange}>
          <option value="">Filter by Type</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="electric">Electric</option>
          <option value="bug">Bug</option>
          <option value="normal">Normal</option>
          <option value="poison">Poison</option>
          <option value="ground">Ground</option>
          <option value="fairy">Fairy</option>
          <option value="fighting">Fighting</option>
          <option value="psychic">Psychic</option>
          <option value="rock">Rock</option>
          <option value="ghost">Ghost</option>
          <option value="ice">Ice</option>
          <option value="dragon">Dragon</option>
        </select>
      </div>

      {loading && <div className="status">Loading...</div>}
      {error && <div className="status error">{error}</div>}
      {!loading && !error && filteredPokemons.length === 0 && (
        <div className="status">No Pokémon found.</div>
      )}

      <div className="pokemon-container">
        {filteredPokemons.map((pokemon) => (
          <div className="pokemon-card" key={pokemon.id}>
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="pokemon-image"
            />
            <h3>{pokemon.name}</h3>
            <p>ID: #{pokemon.id}</p>
            <p>Type(s): {pokemon.types.map((t) => t.type.name).join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
