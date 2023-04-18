import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

Notify.init({
  position: 'center-top',
  cssAnimationStyle: 'zoom',
  fontSize: '18px',
  width: '350px',
  timeout: 1500,
});

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRf = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(enteringInput, DEBOUNCE_DELAY));

function enteringInput(e) {
  e.preventDefault();
  let name = e.target.value.trim();
  if (name === '') {
    clearInnerHTML();
    return;
  }

  fetchCountries(name)
    .then(createOnScreen)
    .catch(error => {
      clearInnerHTML();

      Notify.failure('Oops, there is no country with that name');
    });
}

function createOnScreen(data) {
  if (data.length >= 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    clearInnerHTML();
  } else if (data.length === 1) {
    clearInnerHTML();
    markupListForOne(data);
  } else {
    clearInnerHTML();
    markupListForAll(data);
  }
}

function markupListForOne(data) {
  let markupListForOne = data.reduce(
    (
      acc,
      { flags: { svg }, name: { official }, capital, population, languages }
    ) => {
      acc += `<div class = "country-descr">
        <img src="${svg ? svg : ''}" width = "50" height = "25">
        <p class = "country-name">${official ? official : ''}</p>
        </div>
        <p><span class = "text-descr">Capital: </span>${
          capital ? capital : ''
        }</p>
        <p><span class = "text-descr">Population: </span>${
          population ? population : ''
        }</p>
        <p><span class = "text-descr">Languages: </span>${
          Object.values(languages) ? Object.values(languages) : ''
        }
            </p>`;

      return acc;
    },
    ''
  );

  countryInfoRf.innerHTML = markupListForOne;
}

function markupListForAll(data) {
 let markupList = data.reduce((acc, { flags: { svg }, name: { official } }) => {
    acc += `<li class = "countries">
    <img src="${svg ? svg : ''}" width = "35" height = "25">
    <p class = "text-name">${official ? official : ''}</p>
    </li>`;

    return acc;
  }, '');

  countryListRef.innerHTML = markupList;
}

function clearInnerHTML() {
  countryListRef.innerHTML = '';
  countryInfoRf.innerHTML = '';
}
