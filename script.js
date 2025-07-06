
function createEventCard(eventName, dateTime) {
  let eventTime = new Date(dateTime).getTime();

  let card = document.createElement("div");
  card.className = "eventcard";
  card.innerHTML = `
        <div class="event-first-line">
        <h3 class="event-title">${eventName}</h3>
        <button class="delete-btn" style="background: none; border:none; cursor: pointer;">
            <img src="trash-bin.png" alt="Delete" class="delete-icon" style="width: 30px;">
        </button>
        </div>
        <div class="countdown-timer">
        <p class="days"></p>
        <p class="hours"></p>
        <p class="minutes"></p>
        <p class="seconds"></p>
        </div>
        `;

  document.querySelector(".card-container").appendChild(card);

  // let countdownElement = card.querySelector(".countdown")
  let countdown_days = card.querySelector(".days");
  let countdown_hours = card.querySelector(".hours");
  let countdown_minutes = card.querySelector(".minutes");
  let countdown_seconds = card.querySelector(".seconds");

  let timer = setInterval(() => {
    let now = new Date().getTime();
    let distance = eventTime - now;

    if (distance < 0) {
      clearInterval(timer);
      card.querySelector(".countdown-timer").innerHTML = "🎉 Event Started!";
      return;
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // countdownElement.innerHTML = `⏳  ${days}days ${hours}hours ${minutes}minutes ${seconds}seconds`

    countdown_days.innerHTML = `${days} <br> days`;
    countdown_hours.innerHTML = `${hours} <br> Hours`;
    countdown_minutes.innerHTML = `${minutes} <br> Minutes`;
    countdown_seconds.innerHTML = `${seconds} <br> seconds`;
  }, 1000);

  eventNameInput.value = "";
  dateTimeInput.value = "";

  const deleteButton = card.querySelector(".delete-btn");
  deleteButton.addEventListener("click", function () {
    card.classList.add("fade-out");
    setTimeout(() => {
      card.remove();

      // ✅ Remove from localStorage too
      let events = JSON.parse(localStorage.getItem("events")) || [];
      events = events.filter(
        (e) => !(e.name === eventName && e.dateTime === dateTime)
      );

       localStorage.setItem("events", JSON.stringify(events));

      if (document.querySelectorAll(".eventcard").length === 0) {
        document.getElementById("no-events").style.display = "block";
      }
    }, 500);
  });
}

window.addEventListener("load", function () {
  let events = JSON.parse(localStorage.getItem("events")) || [];

  if (events.length === 0) {
    document.getElementById("no-events").style.display = "block";
  } else {
    document.getElementById("no-events").style.display = "none";
  }
  events.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  events.forEach((event) => {
    createEventCard(event.name, event.dateTime);
  });
});

const button = document.getElementById("add-event");
const eventNameInput = document.getElementById("event-name");
const dateTimeInput = document.getElementById("event-date");

button.addEventListener("click", function () {
  const eventName = eventNameInput.value;
  const dateTime = dateTimeInput.value;

  let eventTime = new Date(dateTime).getTime();
  let now = new Date().getTime();
  let year = new Date(dateTime).getFullYear();

  if (eventName == "" || dateTime == "") {
    alert("Please fill all fields");
    return;
  }

  if (year < 1000 || year > 9999) {
    alert("Please enter a valid 4-digit year");
    return;
  }

  if (eventTime <= now) {
    alert("Enter a future date and time");
    return;
  }

  document.getElementById("no-events").style.display = "none";

  // save to localstorage
  let events = JSON.parse(localStorage.getItem("events")) || [];
  events.push({ name: eventName, dateTime: dateTime });

  events.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  localStorage.setItem("events", JSON.stringify(events));

  createEventCard(eventName, dateTime);
});
