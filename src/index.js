import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from "./js/fetch-countries"

const DEBOUNCE_DELAY = 300; 
const countryName = document.querySelector('#search-box')
const countryList = document.querySelector('.country-list')
const countryInfo = document.querySelector('.country-info')

countryName.addEventListener("input", debounce(onInputQuery, DEBOUNCE_DELAY))

function onInputQuery(e) {
    e.preventDefault();

    const name = e.target.value.trim()
    if (name === "") {
        return clearMarkup();
    }

    fetchCountries(name)
        .then((data) => searchCountry(data) )
        .catch(error => {Notiflix.Notify.failure('Oops, there is no country with that name')});
}

const createMarkup = ({ flags, name }) =>
    `<li class="country-list-item"> 
    <img src="${flags.svg}" alt="${name.official}" width=30, height=30 > 
    <p>${name.official}</p> 
    </li>`;


const generateContent = (array) =>
    array.reduce((acc, item) => acc + createMarkup(item), "");


const incertContent = (array) => {
    const result = generateContent(array);

    countryList.insertAdjacentHTML('beforeend', result)
}


const createCountryMarkup = ({ flags, name, capital, population, languages }) =>
    `<div class="wrapper">
        <img src="${flags.svg}" alt="${name.official}" width=70, height=40 />
        <h2>${name.official}</h2>
      </div>
      <ul class="country-info-list">
        <li class="country-info-item">
          <span class="country-property">Capital:</span>
          <p class="property-value">${capital}</p>
        </li>
        <li class="country-info-item">
          <span class="country-property">Population:</span>
          <p class="property-value">${population}</p>
        </li>
        <li class="country-info-item">
          <span class="country-property">Languages:</span>
          <p class="property-value">${Object.values(languages)}</p>
        </li>
      </ul>`;

const generateCountryCard = (array) =>
    array.reduce((acc, item) => acc + createCountryMarkup(item), "");
    

const incertCountryContent = (array) => {
    
    const result = generateCountryCard(array);
    countryInfo.insertAdjacentHTML('beforeend', result)
}

const clearMarkup = () => {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
}


const searchCountry = (data) => {
   

            if (data.length >= 10) {
                clearMarkup();
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            }
            if (data.length === 1) {
                clearMarkup();
                incertCountryContent(data);
                return;
            }            

            clearMarkup();
            incertContent(data);
    return;
}