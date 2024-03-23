// Nav Bar background appears when scrolling down
$(document).ready(() => {       // If document is ready
    $(window).scroll((event) => {
        let scrollPosition = $(this).scrollTop(); // Vertical scroll position of window
        if (scrollPosition <= 0) {      // 0 represents top of window
            // Currently at top of window
            $(".navbar-background").removeClass("scrolled");
        } else {
            // Currently not at top of window
            $(".navbar-background").addClass("scrolled");
        }
    });
});

// Type Effect on Subheader
let typeText = new TypeIt("#subheader", {
    speed: 50,
    deleteSpeed: 40,
    autoStart: true
})
.type("A Workout Plan That is ")
.type("<u>Accurate</u>")
.pause(1500)
.delete("Accurate".length)
.type("<u>Reliable</u>")
.pause(1500)
.delete("Reliable".length)
.type("<u>Personalized</u>")
.go();

// Form Validation
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
        // Prevent form from submitting
        e.preventDefault();
    }
});