import renderCountries from '../templates/countries-list.hbs'
import renderCountry from '../templates/country.hbs';
import debounce from 'lodash.debounce';
import API from './fetchCountries.js';


import { onOutputInfo, onNoCountry, onError } from './notify.js';


const containerCountries = document.querySelector('.js-countries');
const inputNameCountry = document.querySelector('#input-name-country');

inputNameCountry.addEventListener('input', debounce(onSearch, 500));


function onSearch() {
    if (!inputNameCountry.value) {
      onClearCountry();
      return;
    }
    API(inputNameCountry.value).then(countries => onCountrySearch(countries));
  }
  
  function onCountrySearch(countries) {
    if (countries.length === 1) {
      onClearCountry();
      return onAppendCountriesCard(countries);
    } else if (countries.length >= 2 && countries.length <= 10) {
      onClearCountry();
      return onAppendListCountries(countries);
    } else if (countries.length > 10) {
      return onOutputInfo();
    } else if (countries.status === 404) {
      return onNoCountry();
    } else {
      return onError();
    }
  }
  
  function onClearCountry() {
      containerCountries.innerHTML = '';
  }
  
  function onAppendListCountries(countries) {
      containerCountries.insertAdjacentHTML('beforeend', renderCountries(countries));
  
    document.querySelector('.countries-list').addEventListener('click', onTargetValue);
  }
  
  function onAppendCountriesCard(countries) {
    containerCountries.insertAdjacentHTML('beforeend', renderCountry(countries));
  }
  
  function onTargetValue(e) {
    if (e.target.nodeName !== 'LI') {
      return;
    }
    API(e.target.textContent).then(onCountrySearch);
  }