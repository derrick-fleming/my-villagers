const $villagerView: HTMLDivElement = document.querySelector('#villager-view');
const $loadMoreLink: HTMLAnchorElement = document.querySelector('.load-link');
const $instructionsContainer: HTMLDivElement = document.querySelector('.container.instructions-section.row.justify-center');
const $modalContainer: HTMLDivElement = document.querySelector('.hidden.modal-villager-container');
const $overlay: HTMLDivElement = document.querySelector('.hidden.overlay');
const $overlayTwo: HTMLDivElement = document.querySelector('.hidden.overlay-two');
const $modalPhotoContainer: HTMLDivElement = document.querySelector('#modal-photo-container');
const $leftArrow: HTMLButtonElement = document.querySelector('#left');
const $rightArrow: HTMLButtonElement = document.querySelector('#right');
const $modalTextContainer: HTMLDivElement = document.querySelector('.modal-text-margin.column-ten-twelfths.center');
const $modalTextRows: NodeListOf<HTMLDivElement> = $modalTextContainer.querySelectorAll('.row');
const $emptyHeartIcon: HTMLButtonElement = document.querySelector('#favorite-icon');
const $addedFavorites: HTMLParagraphElement = document.querySelector('.added-favorites.fade-out');
const $navFavoritesPageIcon: HTMLAnchorElement = document.querySelector('.fa-solid.fa-heart.nav-icon');
const $navHomePageIcon: HTMLAnchorElement = document.querySelector('.fa-solid.fa-house.nav-icon');
const $navHomeText: HTMLAnchorElement = document.querySelector('.nav-link-text.home-page-link');
const $navFavoriteText: HTMLAnchorElement = document.querySelector('.nav-link-text.favorites-page-link');
const $navBar: HTMLElement = document.querySelector('nav');
const $ul: HTMLUListElement = document.querySelector('ul');
const $noFavoritesContainer: HTMLDivElement = document.querySelector('.no-favorites-container');
const $favoritesList: HTMLDivElement = document.querySelector('#favorites-list');
const $addInformationScreen: HTMLDivElement = document.querySelector('#add-information');
const $placeholderImage: HTMLImageElement = document.querySelector('#placeholder');
const loadingIcon: HTMLDivElement = document.querySelector('.lds-ring.hidden');
const $addEditForm: HTMLFormElement = document.querySelector('#add-edit-form');
const $viewSwapping: NodeListOf<HTMLDivElement> = document.querySelectorAll('.hidden');
const $deleteModal: HTMLDivElement = document.querySelector('.hidden.container.delete-modal');
const $villagerSearch: HTMLFormElement = document.querySelector('#villager-search');
const $villagerTitle: HTMLHeadingElement = document.querySelector('.villager-title');
const $clearResultsContainer: HTMLDivElement = document.querySelector('.clear-results.container.hidden')

const $deletedFavorites: HTMLHeadingElement = document.querySelector('.deleted-favorites.fade-out');

const changeNavClassToFavorites: [HTMLAnchorElement, string][] = [[$navFavoritesPageIcon, 'fa-solid fa-heart nav-icon currently-island'], [$navFavoriteText, 'nav-link-text favorites-page-link currently-island'],
  [$navHomePageIcon, 'fa-solid fa-house nav-icon house-outline'], [$navHomeText, 'nav-link-text home-page-link']];

const changeNavClassToHome: [HTMLAnchorElement, string][] = [[$navFavoritesPageIcon, 'fa-solid fa-heart nav-icon house-outline'], [$navHomePageIcon, 'fa solid fa-house nav-icon currently-island'],
  [$navFavoriteText, 'nav-link-text favorites-page-link'], [$navHomeText, 'nav-link-text home-page-link currently-island']];

let speciesList: string[] = [];
let villagerList: null | villagerList[] = null;
let speciesNumber = 0;
let timerId = null;
let modalVillagerNumber: string | null = null;

type DomAttributes = {
  class?: string,
  id ?: string,
  textContent ?: string,
  href ?: string,
  'data-id' ?: number | string,
  'data-view' ?: string,
  src ?: string,
  alt ?: string
}

type villagerList = {
  birthday: string,
  'birthday-string': string,
  'catch-phrase': string,
  gender: string,
  hobby: string,
  'icon_uri': string,
  id: number,
  'image_uri': string,
  name: {
    'name-USen': string
  },
  personality: string,
  saying: string,
  species: string
}

type favoriteVillager = {
  favoriteOrder: number,
  villagerId: string,
  villagerPicture: string,
  villagerName: string,
  formValues: {
    islandStatus: string,
    notes: string,
    photoCollected: boolean
  },
}

interface AnimalForm extends HTMLFormControlsCollection {
  island: HTMLInputElement,
  photo: HTMLInputElement,
  notes: HTMLInputElement
}

interface SearchForm extends HTMLFormControlsCollection {
  search: HTMLInputElement
}

getAnimalCrossingData('https://acnhapi.com/v1a/villagers');
$loadMoreLink.addEventListener('click', renderMoreVillagersToHomePage);
document.addEventListener('readystatechange', loadingCursor);
document.addEventListener('DOMContentLoaded', appendFavoriteVillagersToFavoritesPage);
$instructionsContainer.addEventListener('click', aidDisappear);
$villagerView.addEventListener('click', openModalWindow);
$modalContainer.addEventListener('click', modalClickActions);
$navBar.addEventListener('click', changeNavIconAndPage);
$favoritesList.addEventListener('click', changeScreenToAddEditForm);
$addEditForm.addEventListener('submit', saveInformation);
$addInformationScreen.addEventListener('click', cancelEntries);
$deleteModal.addEventListener('click', deleteOrExitOutFavoriteVillager);
$ul.addEventListener('click', openDeleteModal);
$villagerSearch.addEventListener('submit', searchVillager);
$villagerSearch.addEventListener('input', searchVillager);
$clearResultsContainer.addEventListener('click', clearResults);

function getAnimalCrossingData(request: string) {
  loadingIcon.className = 'lds-ring';
  const xhr = new XMLHttpRequest();
  xhr.open('GET', request);
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('error', displayErrorMessage);
  xhr.addEventListener('load', generateList);
  return xhr;
}

function displayErrorMessage() {
  data.view = 'error-message';
  switchViews('error-message');
}

function generateList(event: ProgressEvent) {
  switchViews(data.view);
  if (data.informationTracker.length > 0) {
    const $instructionAids = $instructionsContainer.querySelectorAll('.column-quarter');
    for (let i = 0; i < $instructionAids.length; i++) {
        if (data.informationTracker.includes($instructionAids[i].getAttribute('data-id'))) {
          $instructionAids[i].className = 'hidden';
        }
      }
    }
  villagerList = (event.target as XMLHttpRequest).response.sort(function (a: {species: string}, b: {species: string}) { return a.species.localeCompare(b.species); });
  renderVillagersList();
  timerId = setInterval(loadingImageIcon, 0);
}

function renderMoreVillagersToHomePage() {
  renderVillagersList();
  timerId = setInterval(loadingImageIcon, 0);
  if (speciesNumber > 300) {
    $loadMoreLink.className = 'load-link hidden';
  }
}

function generateDomTree(tagName: string, attributes: DomAttributes, children?: HTMLElement[]): HTMLElement {
  if (!children) {
    children = [];
  }

  const $element: HTMLElement = document.createElement(tagName);
  for (let key in attributes) {
    if (key === 'textContent') {
      $element.textContent = attributes.textContent;
    } else {
      $element.setAttribute(key, attributes[key]);
    }
  }

  for (let i = 0; i < children.length; i++) {
    $element.append(children[i]);
  }
  return $element;
}

function renderVillagersList(): HTMLElement {
  let $villagerContainerSpeciesList: HTMLElement;
  let $villagerSection: HTMLElement;

  for (let i = speciesNumber; i < speciesNumber + 100; i++) {
    const villagerSpecies = villagerList[i].species;
    const villagerIcon = villagerList[i].icon_uri;
    const villagerName = villagerList[i].name['name-USen'];
    if (!speciesList.includes(villagerSpecies)) {
      speciesList.push(villagerSpecies);
      $villagerSection =
      generateDomTree('div', { class: 'species-list', id: villagerSpecies }, [
        generateDomTree('div', { class: 'container row' }, [
          generateDomTree('div', { class: 'header-species-container' }, [
            generateDomTree('h1', { textContent: villagerSpecies })]),
          generateDomTree('a', { class: 'top-page-link', href: '#villager-view', textContent: 'Back to Top' })
        ])
      ]);
      $villagerView.appendChild($villagerSection);
      if (villagerSpecies === 'Alligator') {
        const removeLink = document.querySelector('.top-page-link');
        removeLink.remove();
      }

      $villagerContainerSpeciesList = generateDomTree('div', { class: 'container row', id: 'section-' + villagerSpecies.toLowerCase() });
    }

    const $villagerColumn =
    generateDomTree('div', { class: 'column-one-third center', 'data-id': i }, [
      generateDomTree('a', {}, [
        generateDomTree('img', { src: villagerIcon, class: 'villager-icon', alt: villagerName, 'data-id': 'click-villager' })
      ]),
      generateDomTree('a', {}, [
        generateDomTree('h4', { class: 'villager-name', textContent: villagerName, 'data-id': 'click-villager' })
      ])
    ]);

    if (speciesNumber > 100 && villagerList[speciesNumber - 1].species === villagerSpecies) {
      const $villagerSectionUpdate: HTMLDivElement = document.querySelector('#' + 'section-' + villagerSpecies.toLowerCase());
      $villagerSectionUpdate.appendChild($villagerColumn);
      continue;
    }

    $villagerContainerSpeciesList.appendChild($villagerColumn);

    if (i === 390) {
      $villagerSection.appendChild($villagerContainerSpeciesList);
      speciesNumber = 390;
      return $villagerContainerSpeciesList;
    }
    if (villagerSpecies !== villagerList[i + 1].species || i === speciesNumber + 99) {
      $villagerSection.appendChild($villagerContainerSpeciesList);
    }
  }
  speciesNumber += 100;
  return $villagerContainerSpeciesList;
}

function loadingCursor() {
  if (document.readyState === 'loading' || document.readyState === 'interactive') {
    loadingIcon.className = 'lds-ring';
  } else {
    loadingIcon.className = 'lds-ring hidden';
  }
}

function appendFavoriteVillagersToFavoritesPage() {
  data.editing = false;
  for (let i = 0; i < data.favoritesList.length; i++) {
    const favorite = data.favoritesList[i];
    const $listItem = createFavoritesList(favorite);
    $ul.appendChild($listItem);
    if (favorite.formValues !== null) {
      const $liUpdate = document.getElementById(favorite.villagerName);
      const $row = addFavoritesInformationToDom(favorite);
      $liUpdate.appendChild($row);
    }
  }

  if (data.favoritesList.length > 0) {
    $noFavoritesContainer.className = 'hidden';
  }
}

function aidDisappear(event: MouseEvent) {
  if ((event.target as HTMLElement).tagName === 'I') {
    const $hideElement = (event.target as HTMLElement).closest('.column-quarter');
    $hideElement.className = 'hidden';
    const dataStorage = $hideElement.getAttribute('data-id');
    data.informationTracker.push(dataStorage);
  }
}

function openModalWindow(event: MouseEvent) {
  if ((event.target as HTMLElement).getAttribute('data-id') !== 'click-villager') {
    return;
  }

  const $modalPopUp = (event.target as HTMLElement).closest('div');
  modalVillagerNumber = $modalPopUp.getAttribute('data-id');

  const addedModalInfo: villagerList = villagerList[modalVillagerNumber];
  renderModalInfo(addedModalInfo);

  for (let i = 0; i < data.favoritesList.length; i++) {
    const checkFavorite = data.favoritesList[i];
    if (addedModalInfo.name['name-USen'] === checkFavorite.villagerName) {
      $emptyHeartIcon.className = 'fa-solid fa-heart liked-heart';
    }
  }

  for (let x = 0; x < $modalTextRows.length; x++) {
    if ($modalTextRows[x].getAttribute('data-id') === 'left') {
      $modalTextRows[x].className = 'row';
    } else {
      $modalTextRows[x].className = 'hidden-text-box';
    }
  }

  $overlay.className = 'overlay';
  $modalContainer.className = 'modal-villager-container';
  timerId = setInterval(loadingImageIcon, 0);
}

function loadingImageIcon() {
  let image: HTMLImageElement = document.querySelector('.modal-villager-photo');
  if (image === null) {
    const lastSpecies = speciesList[speciesList.length - 1];
    const $speciesList = document.querySelector('#' + lastSpecies);
    image = $speciesList.querySelector('img');
  }
  loadingIcon.className = 'lds-ring';
  if (image.complete === true) {
    loadingIcon.className = 'lds-ring hidden';
    clearInterval(timerId);
  }
  return timerId;
}

function renderModalInfo(info: villagerList) {
  const $villagerInfoPhoto = generateDomTree('img', { src: info.image_uri, alt: 'Image of ' + info.name['name-USen'], class: 'modal-villager-photo' }, []);
  $modalPhotoContainer.appendChild($villagerInfoPhoto);

  const birthday = info.birthday.split('/').reverse();

  const capitalizeCatch = info['catch-phrase'];
  const firstLetter = capitalizeCatch[0].toUpperCase();
  const wordOutput = firstLetter + capitalizeCatch.slice(1);
  const $span = document.querySelectorAll('span');

  const infoCardArray = [info.name['name-USen'], info.species, info.gender, info.personality, birthday.join('/'), info.hobby, '"' + wordOutput + '"', '"' + info.saying + '"'];
  for (let i = 0; i < infoCardArray.length; i++) {
    $span[i].textContent = infoCardArray[i];
  }
}

function modalClickActions(event: MouseEvent) {
  let modalId = (event.target as HTMLElement).getAttribute('id');
  if (modalId === 'exit-modal') {
    const $imageDelete = document.querySelector('.modal-villager-photo');
    $imageDelete.remove();
    $overlay.className = 'hidden overlay';
    $modalContainer.className = 'hidden modal-villager-container';
    $emptyHeartIcon.className = 'fa-solid fa-heart empty-heart';
    $addedFavorites.className = 'added-favorites fade-out';
    $deletedFavorites.className = 'deleted-favorites fade-out-delete';
    modalId = 'left';
  }

  if ((modalId === 'left') || (modalId === 'right')) {
    for (let i = 0; i < $modalTextRows.length; i++) {
      if ($modalTextRows[i].getAttribute('data-id') === modalId) {
        $modalTextRows[i].className = 'row';
      } else {
        $modalTextRows[i].className = 'hidden-text-box';
      }
    }
  }

  if (modalId === 'left') {
    $rightArrow.className = 'fa-solid fa-chevron-right arrow';
    $leftArrow.className = 'hidden';
  } else if (modalId === 'right') {
    $rightArrow.className = 'hidden';
    $leftArrow.className = 'fa-solid fa-chevron-left arrow';
  }

  if (modalId === 'favorite-icon') {
    if ($emptyHeartIcon.className === 'fa-solid fa-heart empty-heart') {
      $emptyHeartIcon.className = 'fa-solid fa-heart liked-heart';
      $addedFavorites.className = 'added-favorites';
      setTimeout(displayAddedToFavoritesText, 1500);
      const favoriteInfo = saveFavoriteVillager();
      const $listItem = createFavoritesList(favoriteInfo);
      $ul.appendChild($listItem);
      $noFavoritesContainer.className = 'hidden';
    } else {
      data.deleteFavorite = modalVillagerNumber;
      $deleteModal.className = 'container delete-modal';
      $overlayTwo.className = 'overlay-two';
    }
  }
}

function displayAddedToFavoritesText() {
  $addedFavorites.className = 'fade-out added-favorites';
  return $addedFavorites;
}

function saveFavoriteVillager() {
  const villagerData: villagerList = villagerList[modalVillagerNumber];

  const favoriteVillagerInformation = {
    favoriteOrder: data.nextFavorite,
    villagerId: modalVillagerNumber,
    villagerPicture: villagerData.image_uri,
    villagerName: villagerData.name['name-USen'],
    formValues: null
  };
  data.nextFavorite++;
  data.favoritesList.push(favoriteVillagerInformation);
  return favoriteVillagerInformation;

}

function changeNavIconAndPage(event: MouseEvent) {
  const navCheck = (event.target as HTMLElement).className;
  if (navCheck === 'fa-solid fa-heart nav-icon house-outline' || navCheck === 'nav-link-text favorites-page-link' || navCheck === 'favorites-page-link') {
    data.view = 'favorites-view';
    switchViews(data.view);
  }

  if (navCheck === 'fa-solid fa-house nav-icon house-outline' || navCheck === 'nav-link-text home-page-link' || navCheck === 'home-page-link') {
    data.view = 'home-view';
    switchViews(data.view);
  }

}

function switchViews(view: string) {
  $viewSwapping.forEach(element => {
    if (element.getAttribute('data-view') === view) {
      element.className = 'page'
    } else {
      element.className = 'hidden';
    }
  })

  if (data.view === 'favorites-view' || data.view === 'add-info') {
    for (let y = 0; y < changeNavClassToFavorites.length; y++) {
      changeNavClassToFavorites[y][0].className = changeNavClassToFavorites[y][1];
    }
  } else {
    for (let x = 0; x < changeNavClassToHome.length; x++) {
      changeNavClassToHome[x][0].className = changeNavClassToHome[x][1];
    }
  }
}

function createFavoritesList(favorite: favoriteVillager) {
  const $li = generateDomTree('li', { class: 'row', id: favorite.villagerId, 'data-id': 'id-' + favorite.villagerId },
    [generateDomTree('div', { class: 'column-full text-right' }, [
      generateDomTree('a', {}, [
        generateDomTree('i', { id: 'favorite-icon', class: 'fa-solid fa-heart favorited-heart' }, [])
      ])
    ]),
    generateDomTree('div', { class: 'column-third' }, [
      generateDomTree('div', { class: 'row justify-center' }, [
        generateDomTree('img', { class: 'favorite-image', alt: favorite.villagerName + ' Photo', src: favorite.villagerPicture, 'data-id': 'click-villager' }, [])])
    ]),
    generateDomTree('div', { class: 'column-two-third', id: favorite.villagerName }, [
      generateDomTree('h1', { class: 'no-top-margin', textContent: favorite.villagerName }),
      generateDomTree('div', { class: 'add-edit', 'data-view': 'add-info' }, [
        generateDomTree('a', { class: 'flex-align-center' }, [
          generateDomTree('div', { class: 'pencil-icon-container flex-align-center justify-center nav-link' }, [
            generateDomTree('img', { class: 'edit-icon', src: 'images/pencil-icon.webp', alt: 'Edit Icon' })]),
          generateDomTree('p', { class: 'light-weight no-margin', textContent: 'Add/Edit Information' })
        ])
      ])
    ])
    ]
  );
  return $li;
}

function changeScreenToAddEditForm(event: MouseEvent) {

  const screenEvent = event.target as HTMLElement;
  if (screenEvent.className === 'edit-icon' || screenEvent.className === 'light-weight no-margin' || screenEvent.className === 'flex-align-center') {
    data.view = 'add-info';
    switchViews(data.view);
    const $closestVillager = screenEvent.closest('li');
    const $villagerId = $closestVillager.getAttribute('id');
    const index = data.favoritesList.findIndex(element => element.villagerId === $villagerId);
    const $villagerGet = data.favoritesList[index];
    data.editingNumber = index;
    $placeholderImage.setAttribute('src', $villagerGet.villagerPicture);
    $placeholderImage.setAttribute('alt', $villagerGet.villagerName + "'s Photo.");
    if ($villagerGet.formValues !== null) {
      data.editing = true;
      ($addEditForm.elements as AnimalForm).island.value = $villagerGet.formValues.islandStatus;
      ($addEditForm.elements as AnimalForm).photo.checked = $villagerGet.formValues.photoCollected;
      ($addEditForm.elements as AnimalForm).notes.value = $villagerGet.formValues.notes;
    }

    $addInformationScreen.className = 'container padding-top';
  }
}

function saveInformation(event: SubmitEvent) {
  event.preventDefault();

  const villagerNumber: number = data.editingNumber;
  const formInputValues = {
    islandStatus: ($addEditForm.elements as AnimalForm).island.value as string,
    photoCollected: ($addEditForm.elements as AnimalForm).photo.checked as boolean,
    notes: ($addEditForm.elements as AnimalForm).notes.value as string
  };
  const favoriteVillager: favoriteVillager = data.favoritesList[villagerNumber];
  data.favoritesList[villagerNumber].formValues = formInputValues;
  $addEditForm.reset();
  data.view = 'favorites-view';
  switchViews(data.view);
  const $row = addFavoritesInformationToDom(favoriteVillager);
  const $liUpdate = document.getElementById(favoriteVillager.villagerName);

  if (data.editing === false) {
    $liUpdate.appendChild($row);
    $addInformationScreen.className = 'hidden';
    return;
  }
  data.editing = false;
  const $replaceRow = document.querySelector('#id-' + favoriteVillager.favoriteOrder);
  $addInformationScreen.className = 'hidden';
  $replaceRow.replaceWith($row);
}

function addFavoritesInformationToDom(favorite: favoriteVillager) {
  const islandValue = favorite.formValues.islandStatus;
  let islandText: string;
  let islandClass: string;
  const photoValue = favorite.formValues.photoCollected;
  const notesValue = favorite.formValues.notes;
  let boxClass: string;

  if (islandValue === 'formerly') {
    islandClass = 'formerly-island';
    islandText = 'Formerly on island';
  } else if (islandValue === 'currently') {
    islandClass = 'currently-island';
    islandText = 'Currently on island';
  } else {
    islandClass = 'wish-island';
    islandText = 'Wish on island';
  }

  if (photoValue === true) {
    boxClass = 'checked fa-solid fa-circle-check';
  } else {
    boxClass = 'unchecked fa-regular fa-circle-xmark';
  }

  const $responseRow =
    generateDomTree('div', { id: 'id-' + favorite.favoriteOrder, class: 'row shrink-indicator' }, [
      generateDomTree('div', { class: 'column-one-half' }, [
        generateDomTree('p', { class: islandClass, textContent: islandText })]),
      generateDomTree('div', { class: 'column-one-half' }, [
        generateDomTree('p', { class: 'photo-response inline-block', textContent: 'Photo Collected: ' }),
        generateDomTree('i', { class: boxClass })
      ]),
      generateDomTree('p', { textContent: notesValue })]);

  return $responseRow;
}

function cancelEntries(event: MouseEvent) {
  if ((event.target as HTMLElement).tagName === 'A') {
    $addEditForm.reset();
    data.view = 'favorites-view';
    switchViews(data.view);
    $placeholderImage.setAttribute('src', 'images/placeholder-image-square-1.jpg');
    $placeholderImage.setAttribute('alt', 'Placeholder Image');
  }
}

function openDeleteModal(event: MouseEvent) {
  if ((event.target as HTMLElement).getAttribute('id') === 'favorite-icon') {
    $deleteModal.className = 'container delete-modal';
    $overlayTwo.className = 'overlay';
  }

  const $modalPopUp = (event.target as HTMLElement).closest('li');
  data.deleteFavorite = $modalPopUp.getAttribute('id');
}

function displayDeletedFavorites() {
  $deletedFavorites.className = 'fade-out-delete deleted-favorites';
  return $deletedFavorites;
}

function deleteOrExitOutFavoriteVillager(event: MouseEvent) {
  if ((event.target as HTMLElement).getAttribute('id') === 'go-back') {
    $deleteModal.className = 'hidden container delete-modal';
    $overlayTwo.className = 'hidden overlay-two';
    return;
  }

  if ((event.target as HTMLElement).getAttribute('id') === 'delete') {
    const $liDelete = $ul.querySelectorAll('li');
    for (let index = 0; index < $liDelete.length; index++) {

      if ($liDelete[index].getAttribute('id') === data.deleteFavorite) {
        $liDelete[index].remove();
        data.favoritesList.splice(index, 1);
        if (data.view === 'home-view') {
          $emptyHeartIcon.className = 'fa-solid fa-heart empty-heart';
          $deletedFavorites.className = 'deleted-favorites';
          setTimeout(displayDeletedFavorites, 1500);
        }
        break;
      }
    }
    $deleteModal.className = 'hidden container delete-modal';
    $overlayTwo.className = 'hidden overlay-two';
  }

  if (data.favoritesList.length === 0) {
    $noFavoritesContainer.className = 'no-favorites-container';
  }
}

function searchVillager(event: SubmitEvent | KeyboardEvent) {
  if (event.type === 'submit') event.preventDefault();
  const searchTerm = event.type === 'submit'
        ? ($villagerSearch.elements as SearchForm).search.value.toLowerCase()
        : (event.target as HTMLFormElement).value;

  if (searchTerm === '') {
    const $previousSearchContainer = document.querySelector('#search-results');
    $previousSearchContainer.remove();

    const $speciesContainerList = document.querySelectorAll('.species-list.hidden');
    $speciesContainerList.forEach(element => element.className = 'species-list');
    $loadMoreLink.className = 'load-link';
    $clearResultsContainer.className = 'clear-results container hidden';
    $villagerTitle.textContent = 'Villager List';

    return;
  }

  const $previousSearchContainer = document.querySelector('#search-results');
  if($previousSearchContainer) {
    $previousSearchContainer.remove();
  }

  const $speciesContainerList = document.querySelectorAll('.species-list');
  $speciesContainerList.forEach(element => element.className = 'species-list hidden');
  $loadMoreLink.className = 'hidden';
  $clearResultsContainer.className = 'clear-results container';

  $villagerTitle.textContent = 'Search Results';
  const $villagerResultsContainer = generateDomTree('div', { class: 'container row', id: 'search-results' });

  villagerList.forEach((villager, index) => {
    if (!villager.name["name-USen"].toLowerCase().includes(searchTerm)) {
      return
    }
    const villagerIcon = villager.icon_uri;
    const villagerName = villager.name['name-USen'];

    const $villagerColumn =
      generateDomTree('div', { class: 'column-one-third center', 'data-id': index }, [
        generateDomTree('a', {}, [
          generateDomTree('img', { src: villagerIcon, class: 'villager-icon', alt: villagerName, 'data-id': 'click-villager' })
        ]),
        generateDomTree('a', {}, [
          generateDomTree('h4', { class: 'villager-name', textContent: villagerName, 'data-id': 'click-villager' })
        ])
      ]);
    $villagerResultsContainer.appendChild($villagerColumn);
    })

    $villagerView.appendChild($villagerResultsContainer);

}

function clearResults(event: MouseEvent) {
  if ((event.target as HTMLElement).tagName !== 'BUTTON') {
    return;
  }
  const $previousSearchContainer = document.querySelector('#search-results');
  $previousSearchContainer.remove();

  const $speciesContainerList = document.querySelectorAll('.species-list.hidden');
  $speciesContainerList.forEach(element => element.className = 'species-list');
  $loadMoreLink.className = 'load-link';
  $clearResultsContainer.className = 'clear-results container hidden';
  $villagerTitle.textContent = 'Villager List';
}
