import './pages/index.css';

function fetchCards() {
  return fetch('https://nomoreparties.co/v1/frontend-st-cohort-201/cards', {
    headers: {
      authorization: '39fdcd0c-d04b-4c8d-b2ac-1e477ca51a6e'
    }
  })
    .then(res => res.json())
    .then((result) => {
      result.forEach((card) => {
        getUser().then((res) => {
          const userId = res._id;
          const likeActive = (card.likes.some((like) => like._id === userId));
          const deleteActive = (card.owner._id === userId);
          cardsField.append(createCard(card.name, card.link, card.likes.length, card._id, likeActive, deleteActive));
        });
      });
      console.log(result);
    }); 
}
fetchCards();

function getUser() {
  return fetch('https://nomoreparties.co/v1/frontend-st-cohort-201/users/me', {
    headers: {
      authorization: '39fdcd0c-d04b-4c8d-b2ac-1e477ca51a6e'
    }
  })
    .then(res => res.json()); 
}
getUser().then((result) => {
  profileTitle.textContent = result.name;
  profileJob.textContent = result.about;
  avatarImage.style.backgroundImage = `url("${result.avatar}")`;
  console.log(result.avatar);
});

function editProfile(newName, newAbout) {
  return fetch('https://nomoreparties.co/v1/frontend-st-cohort-201/users/me', {
    method: 'PATCH',
    headers: {
      authorization: '39fdcd0c-d04b-4c8d-b2ac-1e477ca51a6e',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: newName,
      about: newAbout
    })
  });
}

function addCard(name, link) {
  return fetch('https://nomoreparties.co/v1/frontend-st-cohort-201/cards', {
    method: 'POST',
    headers: {
      authorization: '39fdcd0c-d04b-4c8d-b2ac-1e477ca51a6e',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      link: link
    })
  })
  .then((res) => res.json())
  .then((res) => {
    cardsField.prepend(createCard(name, link, 0, res._id));
  });
}

function likeCard(cardId) {
  return fetch(`https://nomoreparties.co/v1/frontend-st-cohort-201/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: {
      authorization: '39fdcd0c-d04b-4c8d-b2ac-1e477ca51a6e',
      'Content-Type': 'application/json'
    }
  });
}

function unlikeCard(cardId) {
  return fetch(`https://nomoreparties.co/v1/frontend-st-cohort-201/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: '39fdcd0c-d04b-4c8d-b2ac-1e477ca51a6e',
      'Content-Type': 'application/json'
    }
  });
}

function deleteCard(cardId) {
  return fetch(`https://nomoreparties.co/v1/frontend-st-cohort-201/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: '39fdcd0c-d04b-4c8d-b2ac-1e477ca51a6e',
      'Content-Type': 'application/json'
    }
  });
}

function editAvatar(src) {
  return fetch('https://nomoreparties.co/v1/frontend-st-cohort-201/users/me/avatar', {
    method: 'PATCH',
    headers: {
      authorization: '39fdcd0c-d04b-4c8d-b2ac-1e477ca51a6e',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      avatar: src
    })
  });
}

function renderLoading(isLoading, button) {
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = "Сохранить";
  }
}

// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const profileTitle = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

const cardsField = document.querySelector('.places__list');

const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_avatar'); 

const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editAvatarButton = document.querySelector('.profile__image');

const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');
// const profileError = profileFormElement.querySelector(`.${nameInput.id}-error`);
const profileButton = profileFormElement.querySelector(".popup__button");

const cardFormElement = cardPopup.querySelector('.popup__form');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const sourceInput = cardFormElement.querySelector('.popup__input_type_url');
const cardButton = cardFormElement.querySelector(".popup__button");

const imageImageElement = imagePopup.querySelector('.popup__image');
const imageCaption = imagePopup.querySelector('.popup__caption');

const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarSourceInput = avatarFormElement.querySelector('.popup__input_type_url');
const avatarImage = document.querySelector('.profile__image');
const avatarButton = avatarFormElement.querySelector(".popup__button");



profilePopup.classList.add('popup_is-animated');
cardPopup.classList.add('popup_is-animated');
imagePopup.classList.add('popup_is-animated');
avatarPopup.classList.add('popup_is-animated');

function closeByEsc(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup)
      closeModal(openedPopup);
  } 
}

// @todo: Функция создания карточки
function createCard(title, link, likes, cardId, likeActive=false, deleteActive=true) {
    let card = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = card.querySelector('.card__image');
    const cardTitle = card.querySelector('.card__title');
    const cardLikeButton = card.querySelector('.card__like-button');
    const cardDeleteButton = card.querySelector('.card__delete-button');
    const likeAmount = card.querySelector('.card__like__amount');

    cardImage.src = link;
    cardImage.alt = title;
    cardTitle.textContent = title;
    likeAmount.textContent = likes;
    if (likeActive) cardLikeButton.classList.add("card__like-button_is-active");
    console.log(deleteActive);
    if (!deleteActive) cardDeleteButton.classList.add("card__delete-button_unactive");

    cardLikeButton.addEventListener('click', (evt) => {
      evt.target.classList.toggle('card__like-button_is-active');
      if (evt.target.classList.contains('card__like-button_is-active')) {
        likeCard(cardId);
        likeAmount.textContent = +likeAmount.textContent + 1;
      }
      else {
        unlikeCard(cardId);
        likeAmount.textContent = +likeAmount.textContent - 1;
      }
    });
    cardDeleteButton.addEventListener('click', (evt) => {
      evt.target.closest('.card').remove();
      deleteCard(cardId);
    });
    cardImage.addEventListener('click', function () {
        imageImageElement.src = link;
        imageImageElement.alt = title;
        imageCaption.textContent = title;
        openModal(imagePopup);
    });
    const imageClosePopup = imagePopup.querySelector('.popup__close');
    imageClosePopup.addEventListener('click', () => closeModal(imagePopup));
    imagePopup.addEventListener('mousedown', (event) => {
      const popup = imagePopup.querySelector('.popup__content');
      if (!popup.contains(event.target)) {
        closeModal(imagePopup);
      }
    });

    return card;
}

function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener("keydown", closeByEsc);
}
function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener("keydown", closeByEsc);
}
function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, profileButton);
    profileTitle.textContent = nameInput.value;
    profileJob.textContent = jobInput.value;
    editProfile(nameInput.value, jobInput.value)
    .then((res) => renderLoading(false, profileButton));
    closeModal(profilePopup);
}

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, cardButton);
    addCard(cardNameInput.value, sourceInput.value)
    .then((res) => renderLoading(false, cardButton));
    closeModal(cardPopup);
}

function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, avatarButton);
    avatarImage.style.backgroundImage = `url("${avatarSourceInput.value}")`;
    editAvatar(avatarSourceInput.value)
    .then((res) => renderLoading(false, avatarButton));
    closeModal(avatarPopup);
}

editProfileButton.addEventListener('click', () => openModal(profilePopup));
const profileClosePopup = profilePopup.querySelector('.popup__close');
profileClosePopup.addEventListener('click', () => closeModal(profilePopup));
profilePopup.addEventListener('mousedown', (event) => {
  const popup = profilePopup.querySelector('.popup__content');
  if (!popup.contains(event.target)) {
    closeModal(profilePopup);
  }
});

addCardButton.addEventListener('click', () => openModal(cardPopup));
const cardClosePopup = cardPopup.querySelector('.popup__close');
cardClosePopup.addEventListener('click', () => closeModal(cardPopup));
cardPopup.addEventListener('mousedown', (event) => {
  const popup = cardPopup.querySelector('.popup__content');
  if (!popup.contains(event.target)) {
    closeModal(cardPopup);
  }
});

editAvatarButton.addEventListener('click', () => openModal(avatarPopup));
const avaClosePopup = avatarPopup.querySelector('.popup__close');
avaClosePopup.addEventListener('click', () => closeModal(avatarPopup));
avatarPopup.addEventListener('mousedown', (event) => {
  const popup = avatarPopup.querySelector('.popup__content');
  if (!popup.contains(event.target)) {
    closeModal(avatarPopup);
  }
});

profileFormElement.addEventListener('submit', handleProfileFormSubmit);
cardFormElement.addEventListener('submit', handleCardFormSubmit);
avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);




const showInputError = (formElement, inputElement, errorMessage) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add('form__input_type_error');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('form__input-error_active');
  };
  
  const hideInputError = (formElement, inputElement) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove('form__input_type_error');
    errorElement.classList.remove('form__input-error_active');
    errorElement.textContent = '';
  };
  
  const checkInputValidity = (formElement, inputElement) => {
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
      hideInputError(formElement, inputElement);
    }
  };
  
  const setEventListeners = (formElement) => {
    const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
    const buttonElement = formElement.querySelector(".button");
    toggleButtonState(inputList, buttonElement);
    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', function () {
        toggleButtonState(inputList, buttonElement);
        checkInputValidity(formElement, inputElement);
      });
    });
  };

  const hasInvalidInput = (inputList) => {
    return inputList.some((input) => !input.validity.valid);
  };

  const toggleButtonState = (inputList, buttonElement) => {
    if (hasInvalidInput(inputList)) {
      buttonElement.classList.add("button_unactive");
    } else {
      buttonElement.classList.remove("button_unactive");
    }
  };
  
  const enableValidation = () => {
    const formList = Array.from(document.querySelectorAll(".popup__form"));
    formList.forEach((formElement) => {
      formElement.addEventListener("submit", (evt) => {
        evt.preventDefault();
      });
      setEventListeners(formElement);
    });
  };
  
  enableValidation();


// @todo: Вывести карточки на страницу




//https://avatars.mds.yandex.net/get-altay/10647561/2a0000018c773afab09e63061b49919ef6e2/orig