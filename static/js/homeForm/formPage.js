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

// Type Effect on Header
let typeText = new TypeIt("#instruction", {
    strings: "Let's get more specific...",
    speed: 45
})
.go();