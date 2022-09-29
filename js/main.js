var $villagerView = document.querySelector('#villager-view');
var $loadMoreLink = document.querySelector('.load-link');
var $scrollPopUp = document.querySelector('#scroll-info');
var $viewInfoPopUp = document.querySelector('#view-info');
var $homePopUp = document.querySelector('#home-info');
var $favScrollPopUp = document.querySelector('#scroll-fav-info');
var $favViewInfoPopUp = document.querySelector('#view-fav-info');
var $favFavoritesPopUp = document.querySelector('#favorite-fav-info');
var $favoritesPopUp = document.querySelector('#favorite-info');
var $modalInformation = document.querySelector('.hidden.villager-info');
var $overlay = document.querySelector('.hidden.overlay');
var $infoPhotoContainer = document.querySelector('#info-photo-container');
var $speciesHeading = document.querySelector('#species');
var $genderHeading = document.querySelector('#gender');
var $personalityHeading = document.querySelector('#personality');
var $birthdayHeading = document.querySelector('#birthday');
var $hobbyHeading = document.querySelector('#hobby');
var $catchphraseHeading = document.querySelector('#catchphrase');
var $sayingHeading = document.querySelector('#saying');
var $leftArrow = document.querySelector('#left-arrow');
var $rightArrow = document.querySelector('#right-arrow');
var $emptyHeartIcon = document.querySelector('#favorite-icon');
var $addedFavorites = document.querySelector('.added-favorites.hidden');
var $favoritesPageIcon = document.querySelector('.fa-regular.fa-heart.nav-icon');
var $homePageIcon = document.querySelector('.fa-solid.fa-house.nav-icon');
var $navBar = document.querySelector('nav');
var $ul = document.querySelector('ul');
var $defaultContainer = document.querySelector('.default-container');
var $villagerViewLinks = document.querySelector('#villager-view-links');
var $favoritesList = document.querySelector('#favorites-list');

var $timeInterval = null;
var countdown = 300;

var speciesList = [];
var villagerList = null;
var speciesNumber = 0;

$scrollPopUp.addEventListener('click', function () {
  if (event.target.tagName === 'I') {
    $scrollPopUp.className = 'hidden';
    var $hideScrollDiv = $scrollPopUp.closest('.column-quarter');
    $hideScrollDiv.className = 'hidden';
  }
});

$viewInfoPopUp.addEventListener('click', function () {
  if (event.target.tagName === 'I') {
    $viewInfoPopUp.className = 'hidden';
    var $hideViewInfoDiv = $viewInfoPopUp.closest('.column-quarter');
    $hideViewInfoDiv.className = 'hidden';
  }
});

$favoritesPopUp.addEventListener('click', function () {
  if (event.target.tagName === 'I') {
    $favoritesPopUp.className = 'hidden';
    var $hideFavoritesDiv = $favoritesPopUp.closest('.column-quarter');
    $hideFavoritesDiv.className = 'hidden';
  }
});

$homePopUp.addEventListener('click', function () {
  if (event.target.tagName === 'I') {
    $homePopUp.className = 'hidden';
    var $hideHomeDiv = $homePopUp.closest('.column-half.end');
    $hideHomeDiv.className = 'hidden';
  }
});

$favScrollPopUp.addEventListener('click', function () {
  if (event.target.tagName === 'I') {
    $favScrollPopUp.className = 'hidden';
    var $hidefavScrollDiv = $favScrollPopUp.closest('.column-half');
    $hidefavScrollDiv.className = 'hidden';
  }
});

$favViewInfoPopUp.addEventListener('click', function () {
  if (event.target.tagName === 'I') {
    $favViewInfoPopUp.className = 'hidden';
    var $hidefavViewDiv = $favViewInfoPopUp.closest('.column-half.end');
    $hidefavViewDiv.className = 'hidden';
  }
});

$favFavoritesPopUp.addEventListener('click', function () {
  if (event.target.tagName === 'I') {
    $favFavoritesPopUp.className = 'hidden';
    var $hidefavFavoritesDiv = $favFavoritesPopUp.closest('.column-half');
    $hidefavFavoritesDiv.className = 'hidden';
  }
});

function checkFavoriteVillager(info) {
  for (var i = 0; i < data.favoritesList.length; i++) {
    var checkFavorite = data.favoritesList[i];
    if (info.name['name-USen'] === checkFavorite.villagerName) {
      $emptyHeartIcon.className = 'fa-solid fa-heart liked-heart';
      return;
    }
  }
}

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://acnhapi.com/v1a/villagers');
xhr.responseType = 'json';

xhr.addEventListener('load', generateList);
xhr.send();

function generateList(event) {
  villagerList = xhr.response.sort(function (a, b) { return a.species.localeCompare(b.species); });
  generateDomVillagersList();
  return villagerList;
}

$loadMoreLink.addEventListener('click', function () {
  generateDomVillagersList();
  if (speciesNumber > 300) {
    $loadMoreLink.className = 'load-link hidden';
  }
});

function generateDomVillagersList() {

  for (var i = speciesNumber; i < speciesNumber + 100; i++) {

    var villagerSpecies = villagerList[i].species;

    var villagerIcon = villagerList[i].icon_uri;
    var villagerName = villagerList[i].name['name-USen'];
    if (!speciesList.includes(villagerSpecies)) {
      speciesList.push(villagerSpecies);

      var $villagerSection = document.createElement('div');
      $villagerSection.setAttribute('id', villagerSpecies);
      $villagerSection.className = 'villager-section';

      var $villagerContainerHeader = document.createElement('div');
      $villagerContainerHeader.className = 'container species-header row';

      var $headerContainer = document.createElement('div');
      $headerContainer.className = 'header-container';

      var $h1 = document.createElement('h1');
      $h1.textContent = villagerSpecies;
      $h1.className = 'species-header';

      $headerContainer.appendChild($h1);
      $villagerContainerHeader.appendChild($headerContainer);
      $villagerContainerHeader.appendChild(generateLink());
      $villagerSection.appendChild($villagerContainerHeader);
      $villagerView.appendChild($villagerSection);

      var $villagerContainerSpeciesList = document.createElement('div');
      $villagerContainerSpeciesList.className = 'container species-list row';
      $villagerContainerSpeciesList.setAttribute('id', villagerSpecies.toLowerCase());

    }

    var $villagerColumn = document.createElement('div');
    $villagerColumn.setAttribute('data-id', i);
    $villagerColumn.className = 'column-one-third center';

    var $anchorVillager = document.createElement('a');

    var $villagerIcon = document.createElement('img');
    $villagerIcon.setAttribute('src', villagerIcon);
    $villagerIcon.className = 'villager-icon';
    $villagerIcon.setAttribute('alt', villagerName);

    var $villagerName = document.createElement('h2');
    $villagerName.className = 'villager-name';
    $villagerName.textContent = villagerName;

    $anchorVillager.appendChild($villagerIcon);
    $anchorVillager.appendChild($villagerName);
    $villagerColumn.appendChild($anchorVillager);

    if (speciesNumber > 100 && villagerList[speciesNumber - 1].species === villagerSpecies) {
      var $villagerSectionUpdate = document.querySelector('#' + villagerSpecies.toLowerCase());
      $villagerSectionUpdate.appendChild($villagerColumn);
      continue;
    }

    $villagerContainerSpeciesList.appendChild($villagerColumn);

    if (i === 390) {
      $villagerSection.appendChild($villagerContainerSpeciesList);
      speciesNumber = 390;
      return;
    }

    if (villagerSpecies !== villagerList[i + 1].species || i === speciesNumber + 99) {
      $villagerSection.appendChild($villagerContainerSpeciesList);
    }

  }
  speciesNumber += 100;
  return speciesNumber;
}

function generateLink() {
  var $topLink = document.createElement('a');
  $topLink.textContent = 'Back to top';
  $topLink.className = 'top-link';
  $topLink.setAttribute('href', '#villager-view');
  return $topLink;
}

$villagerView.addEventListener('click', openModalWindow);
function openModalWindow(event) {
  if (event.target.className !== 'villager-icon') {
    return;
  }
  var $modalPopUp = event.target.closest('div');
  var villagerNumber = $modalPopUp.getAttribute('data-id');
  var villagerInfo = villagerList[villagerNumber];
  createInfoCard(villagerInfo);

  $overlay.className = 'overlay';
  $modalInformation.className = 'villager-info';
  if (event.target.className === 'villager-icon') {
    event.target.className = 'hidden villager-icon';
  }
  checkFavoriteVillager(villagerInfo);
}

function createInfoCard(info) {
  var $villagerInfoPhoto = document.createElement('img');
  $villagerInfoPhoto.setAttribute('src', info.image_uri);
  $villagerInfoPhoto.setAttribute('alt', 'Image of ' + info.name['name-USen']);
  $villagerInfoPhoto.className = 'villager-info-photo';

  $infoPhotoContainer.appendChild($villagerInfoPhoto);

  var $titleInfo = document.querySelector('.villager-info-title');
  $titleInfo.textContent = info.name['name-USen'];

  var $speciesInfo = document.querySelector('#species-card');
  $speciesInfo.textContent = info.species;

  var $genderInfo = document.querySelector('#gender-card');
  $genderInfo.textContent = info.gender;

  var $personalityInfo = document.querySelector('#personality-card');
  $personalityInfo.textContent = info.personality;

  var $birthdayInfo = document.querySelector('#birthday-card');
  var birthday = info.birthday.split('/');
  var birthdayReverse = birthday.reverse();
  $birthdayInfo.textContent = birthdayReverse.join('/');

  var $hobbyInfo = document.querySelector('#hobby-card');
  $hobbyInfo.textContent = info.hobby;

  var $catchphraseInfo = document.querySelector('#catchphrase-card');
  var capitalizeCatch = info['catch-phrase'];
  var firstLetter = capitalizeCatch[0].toUpperCase();
  var wordOutput = firstLetter + capitalizeCatch.slice(1);
  $catchphraseInfo.textContent = '"' + wordOutput + '"';

  var $sayingInfo = document.querySelector('#saying-card');
  $sayingInfo.textContent = '"' + info.saying + '"';

}

$modalInformation.addEventListener('click', function () {
  var modalId = event.target.getAttribute('id');
  if (modalId === 'cancel') {
    $overlay.className = 'hidden overlay';
    $modalInformation.className = 'hidden villager-info';
    var $imageDelete = document.querySelector('.villager-info-photo');
    resetRightArrowTextContainer();
    $imageDelete.remove();
    countdown = 300;
    $emptyHeartIcon.className = 'fa-regular fa-heart empty-heart';
    clearInterval($timeInterval);
    $addedFavorites.className = 'added-favorites hidden';

    var $unhidePhoto = document.querySelector('.villager-icon.hidden');
    $unhidePhoto.className = 'villager-icon';
  }

  if (modalId === 'left-arrow') {
    resetRightArrowTextContainer();
  }

  if (modalId === 'right-arrow') {
    resetLeftArrowTextContainer();
  }

  if (modalId === 'favorite-icon') {
    if ($emptyHeartIcon.className === 'fa-regular fa-heart empty-heart') {
      $emptyHeartIcon.className = 'fa-solid fa-heart liked-heart';
      $timeInterval = setInterval(displayText, 0);
      saveFavoriteVillager();
    }

  }
});

function displayText(interval) {
  countdown--;

  $addedFavorites.className = 'added-favorites';

  if (countdown < 1) {
    clearInterval($timeInterval);
    $addedFavorites.className = 'added-favorites hidden';
  }
}

function resetRightArrowTextContainer() {
  $leftArrow.className = 'hidden';
  $rightArrow.className = 'fa-solid fa-chevron-right arrow';

  $speciesHeading.className = 'less-margin';
  $genderHeading.className = 'less-margin';
  $personalityHeading.className = 'less-margin';
  $birthdayHeading.className = 'less-margin';

  $hobbyHeading.className = 'less-margin hidden-text-box';
  $catchphraseHeading.className = 'less-margin hidden-text-box';
  $sayingHeading.className = 'less-margin hidden-text-box';
}

function resetLeftArrowTextContainer() {
  $rightArrow.className = 'hidden';
  $leftArrow.className = 'fa-solid fa-chevron-left arrow';
  $speciesHeading.className = 'less-margin hidden-text-box';
  $genderHeading.className = 'less-margin hidden-text-box';
  $personalityHeading.className = 'less-margin hidden-text-box';
  $birthdayHeading.className = 'less-margin hidden-text-box';

  $hobbyHeading.className = 'less-margin';
  $catchphraseHeading.className = 'less-margin';
  $sayingHeading.className = 'less-margin';
}

function saveFavoriteVillager() {
  var $hiddenIcon = document.querySelector('.hidden.villager-icon');
  var $saveFavoriteContainer = $hiddenIcon.closest('div');
  var getDataInfo = $saveFavoriteContainer.getAttribute('data-id');
  var villagerData = villagerList[getDataInfo];

  var favoriteVillagerInformation = {
    favoriteOrder: data.nextFavorite,
    villagerId: getDataInfo,
    villagerPicture: villagerData.image_uri,
    villagerName: villagerData.name['name-USen'],
    islandStatus: null,
    photoCollected: null,
    notes: null
  };

  data.nextFavorite++;
  data.favoritesList.push(favoriteVillagerInformation);

  createFavoritesList(favoriteVillagerInformation);
  $defaultContainer.className = 'hidden';

}

$navBar.addEventListener('click', changeNavIconAndPage);

function changeNavIconAndPage(event) {
  var navCheck = event.target.className;
  if (navCheck === 'fa-regular fa-heart nav-icon' || navCheck === 'nav-home favorites-page-link') {
    $favoritesPageIcon.className = 'fa-solid fa-heart nav-icon';
    $homePageIcon.className = 'fa-solid fa-house nav-icon house-outline';
    $villagerView.className = 'hidden';
    $villagerViewLinks.className = 'hidden';
    $favoritesList.className = '';

  }

  if (navCheck === 'fa-solid fa-house nav-icon house-outline' || navCheck === 'nav-home home-page-link') {
    $favoritesPageIcon.className = 'fa-regular fa-heart nav-icon';
    $homePageIcon.className = 'fa solid fa-house nav-icon';
    $villagerView.className = '';
    $villagerViewLinks.className = 'container';
    $favoritesList.className = 'hidden';
  }
}

function createFavoritesList(favorite) {
  var $li = document.createElement('li');
  $li.className = 'row wrap';
  $li.setAttribute('id', favorite.favoriteOrder);

  var $imageContainer = document.createElement('div');
  $imageContainer.className = 'column-one-third';

  var $favoriteVillagerImage = document.createElement('img');
  $favoriteVillagerImage.className = 'favorite-image';
  $favoriteVillagerImage.setAttribute('alt', favorite.villagerName + ' Photo');
  $favoriteVillagerImage.setAttribute('src', favorite.villagerPicture);

  $imageContainer.appendChild($favoriteVillagerImage);
  $li.appendChild($imageContainer);

  var $textContainer = document.createElement('div');
  $textContainer.className = 'column-half';
  $textContainer.setAttribute('id', favorite.villagerName);

  var $header = document.createElement('h1');
  $header.className = 'favorites-header no-top-margin';
  $header.textContent = favorite.villagerName;

  $textContainer.appendChild($header);
  $li.appendChild($textContainer);

  $ul.appendChild($li);
}

document.addEventListener('DOMContentLoaded', appendFavorites);
function appendFavorites(event) {
  for (var i = 0; i < data.favoritesList.length; i++) {
    var favorite = data.favoritesList[i];
    createFavoritesList(favorite);
  }

  if (data.favoritesList.length > 0) {
    $defaultContainer.className = 'hidden';
  }
}
