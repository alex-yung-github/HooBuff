// Nav Bar background appears when scrolling down
// Run only after DOM has finished loading
$(document).ready(() => {
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