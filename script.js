const pokemonContainer = document.getElementById("pokemon-container");
const pokemonList = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search");

window.addEventListener('load', getPokemon);
searchInput.addEventListener('input', search);

// Function to get pokemon and their details
function getPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
    .then(response => response.json())
    .then(data => {
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                .then(response => response.json())
                .then(pokemonData => {
                    //Error checking
                    console.log(pokemonData);
                    fetch(pokemonData.species.url)
                    .then(response => response.json())
                    .then(speciesData => {
                        fetch(speciesData.evolution_chain.url)
                        .then(response => response.json())
                        .then(evolutionData => {
                            console.log('Evolution Data:', evolutionData);
                            const evolvesTo = evolutionData.chain.evolves_to.map(evolution => evolution.species.name).join(', ');
                            const newPokemon = {
                                picture: pokemonData.sprites.front_default,
                                url: pokemonData.species.url,
                                name: pokemonData.name,
                                abilities: pokemonData.abilities.map(skill => ({
                                    name: skill.ability.name,
                                    url: skill.ability.url
                                })),
                                species: pokemonData.species.name,
                                evolution: evolvesTo,
                            }
                            displayPokemon(newPokemon);
                        })
                    })

                })
                .catch(error => {
                    console.log('Error:', error);
                })
            })

    })
    .catch(error => {
        console.log('Error:', error);
    })
}

// Function to display the ability effect of a pokemon in a modal
function displayEffect(effect) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    const span = document.getElementsByClassName('close')[0];
    modalText.textContent = effect;
    modal.style.display = 'block';
    span.onclick = function() {
        modal.style.display = 'none';
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Function to display the pokemon
function displayPokemon(pokemon) {
    const ablitiesString = pokemon.abilities.map(ability =>
        `<a href="${ability.url}" class="ability-link" target="_blank">${ability.name}</a>`
    ).join(', ');

    // Create the div where the pokemon details will show up
    const div = document.createElement('div');
    div.classList.add('pokemon');
    div.innerHTML = `
        <img src="${pokemon.picture}" alt="${pokemon.name}" width="320" height="250">
        <h3>Name: ${pokemon.name.toUpperCase()}</h3>
        <p><strong>Abilities:</strong> ${ablitiesString}</p>
        <p><strong>Species:</strong> ${pokemon.species}</p>
        <p><strong>Evolution:</strong> ${pokemon.evolution}</p>
        <br>
        `
    pokemonContainer.appendChild(div);

    const abilityLinks = div.querySelectorAll('.ability-link');
    abilityLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const url = event.target.href;
            fetch(url)
            .then(response => response.json())
            .then(abilityData => {
                const effect = abilityData.effect_entries.find(entry => entry.language.name === 'en').effect;
                // function call to display effect
                displayEffect(effect);
            })
        })
    })
}

// Function for searching for a specific pokemon
function search() {
    let searchValue = searchInput.value.toLowerCase();
    let cards = document.querySelectorAll(".pokemon");
    cards.forEach(card => {
        let cardText = card.textContent.toLowerCase();
        if (cardText.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
};
