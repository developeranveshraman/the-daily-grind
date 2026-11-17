"use strict";

const API_URL = "/api/menu";
const STATIC_MENU_URL = "menu/menu.json";

let menuItems = [];

document.addEventListener("DOMContentLoaded", () => {
  const menuGrid = document.querySelector("#menu-grid");
  const filterButtons = document.querySelectorAll("[data-category]");

  if (!menuGrid) {
    console.error('Required element "#menu-grid" was not found.');
    return;
  }

  function normalizeCategory(category) {
    return String(category ?? "").trim().toLowerCase();
  }

  function formatValue(value, fallback = "N/A") {
    return value === null || value === undefined || value === ""
      ? fallback
      : String(value);
  }

  function createStarRating(rating) {
    const numericRating = Math.max(
      0,
      Math.min(5, Number(rating) || 0)
    );

    const fullStars = Math.round(numericRating);

    return `${"★".repeat(fullStars)}${"☆".repeat(5 - fullStars)}`;
  }

  function createImage(item) {
    const image = document.createElement("img");

    image.className = "menu-card__image";
    image.src = item.image_path || "";
    image.alt = item.name
      ? `${item.name} - The Daily Grind`
      : "The Daily Grind menu item";
    image.loading = "lazy";
    image.decoding = "async";

    image.onerror = () => {
      image.onerror = null;
      image.removeAttribute("src");
      image.classList.add("menu-card__image--unavailable");
      image.alt = "Image unavailable";
    };

    return image;
  }

  function createReviews(reviews) {
    const details = document.createElement("details");
    details.className = "menu-card__reviews";

    const summary = document.createElement("summary");

    const reviewList = Array.isArray(reviews) ? reviews : [];

    summary.textContent =
      reviewList.length > 0
        ? `Customer Reviews (${reviewList.length})`
        : "Customer Reviews";

    details.appendChild(summary);

    if (reviewList.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No reviews available.";
      details.appendChild(emptyMessage);

      return details;
    }

    const list = document.createElement("div");
    list.className = "menu-card__review-list";

    reviewList.forEach((review) => {
      const reviewElement = document.createElement("article");
      reviewElement.className = "menu-card__review";

      const header = document.createElement("div");
      header.className = "menu-card__review-header";

      const customerName = document.createElement("strong");
      customerName.className = "menu-card__review-name";
      customerName.textContent = formatValue(
        review?.customer_name,
        "Anonymous"
      );

      const rating = document.createElement("span");
      rating.className = "menu-card__review-rating";
      rating.textContent = createStarRating(review?.rating);
      rating.setAttribute(
        "aria-label",
        `${Number(review?.rating) || 0} out of 5 stars`
      );

      header.append(customerName, rating);

      const comment = document.createElement("p");
      comment.className = "menu-card__review-comment";
      comment.textContent = formatValue(
        review?.comment,
        "No comment provided."
      );

      reviewElement.append(header, comment);
      list.appendChild(reviewElement);
    });

    details.appendChild(list);

    return details;
  }

  function createMenuCard(item) {
    const card = document.createElement("article");
    card.className = "menu-card";

    const image = createImage(item);

    const content = document.createElement("div");
    content.className = "menu-card__content";

    const category = document.createElement("span");
    category.className = "menu-card__category";
    category.textContent = formatValue(
      item.category,
      "Uncategorized"
    );

    const name = document.createElement("h3");
    name.className = "menu-card__name";
    name.textContent = formatValue(
      item.name,
      "Unnamed Item"
    );

    const description = document.createElement("p");
    description.className = "menu-card__description";
    description.textContent = formatValue(
      item.description,
      "No description available."
    );

    const priceContainer = document.createElement("div");
    priceContainer.className = "menu-card__price-container";

    const price = document.createElement("p");
    price.className = "menu-card__price";

    const totalPrice = Number(item.total_price_inr);

    price.textContent = Number.isFinite(totalPrice)
      ? `₹${Math.round(totalPrice)}`
      : "Price unavailable";

    const priceSubLabel = document.createElement("small");
    priceSubLabel.className = "menu-card__price-meta";
    priceSubLabel.textContent =
      `Incl. 5% GST • FSSAI: ${formatValue(
        item.fssai_food_category_code
      )}`;

    priceContainer.append(price, priceSubLabel);

    const nutrition = item.nutritional_breakdown || {};

    const nutritionSummary = document.createElement("p");
    nutritionSummary.className = "menu-card__nutrition";

    nutritionSummary.textContent =
      `${formatValue(nutrition.total_calories)} kcal | ` +
      `P: ${formatValue(nutrition.protein_g)}g • ` +
      `C: ${formatValue(nutrition.carbs_g)}g • ` +
      `F: ${formatValue(nutrition.fat_g)}g`;

    const reviews = createReviews(item.customer_reviews);

    content.append(
      category,
      name,
      description,
      priceContainer,
      nutritionSummary,
      reviews
    );

    card.append(image, content);

    return card;
  }

  function renderMenu(items) {
    menuGrid.replaceChildren();

    if (!Array.isArray(items) || items.length === 0) {
      const message = document.createElement("p");
      message.className = "menu-grid__message";
      message.textContent = "No menu items found.";

      menuGrid.appendChild(message);
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      if (item && typeof item === "object") {
        fragment.appendChild(createMenuCard(item));
      }
    });

    menuGrid.appendChild(fragment);
  }

  function filterMenu(category) {
    const normalizedCategory = normalizeCategory(category);

    if (normalizedCategory === "all") {
      renderMenu(menuItems);
      return;
    }

    const filteredItems = menuItems.filter(
      (item) =>
        normalizeCategory(item?.category) === normalizedCategory
    );

    renderMenu(filteredItems);
  }

  async function fetchJSON(url) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch "${url}": HTTP ${response.status}`
      );
    }

    return response.json();
  }

  async function fetchMenu() {
    menuGrid.replaceChildren();

    const loadingMessage = document.createElement("p");
    loadingMessage.className = "menu-grid__message";
    loadingMessage.textContent = "Loading menu...";

    menuGrid.appendChild(loadingMessage);

    let data;

    try {
      data = await fetchJSON(API_URL);
    } catch (apiError) {
      console.warn(
        `Menu API unavailable. Falling back to "${STATIC_MENU_URL}".`,
        apiError
      );

      try {
        data = await fetchJSON(STATIC_MENU_URL);
      } catch (fallbackError) {
        console.error(
          "Unable to load menu from API or static fallback.",
          fallbackError
        );

        menuGrid.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.className =
          "menu-grid__message menu-grid__message--error";
        errorMessage.textContent =
          "Sorry, the menu is currently unavailable. Please try again later.";

        menuGrid.appendChild(errorMessage);
        return;
      }
    }

    if (!Array.isArray(data)) {
      console.error(
        "Invalid menu data: expected the menu source to return an array."
      );

      menuItems = [];
      renderMenu(menuItems);
      return;
    }

    menuItems = data.filter(
      (item) => item && typeof item === "object"
    );

    renderMenu(menuItems);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      filterButtons.forEach((filterButton) => {
        filterButton.classList.remove("active");
        filterButton.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      filterMenu(category);
    });
  });

  fetchMenu();
});
