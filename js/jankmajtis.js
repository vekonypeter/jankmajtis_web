//
// SLIDESHOW
//
var slideIndex = -1;
var x = document.getElementsByClassName("headerImage");
for (var i = 0; i < x.length; i++) {
    x[i].style.opacity = "0";
}

carousel();

function carousel() {

    slideIndex++;

    if (slideIndex >= x.length) {
        slideIndex = 0;

        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.opacity = "0";
        }
    }

    $(x[slideIndex]).fadeTo(500, 1);
    setTimeout(carousel, 5000);
}

//
// MENUBAR
//
// Helper globals
var submenus = $(".subMenu");
var menus = $(".subbedMenu");
var dropped = -1;
var lock = false;

function slideDown(n) {
    if (!lock) {
        lock = true;
        $(menus[n]).addClass("menuBtnSelected");

        $(submenus[n]).slideDown({
            duration: "slow",
            start: () => {
                setSubmenuPadding(n);
            },
            complete: () => {
                dropped = n;
                lock = false;
            }
        });
    }
}

function slideUp(n, next) {
    if (!lock) {
        lock = true;
        $(menus[dropped]).removeClass("menuBtnSelected");

        $(submenus[n]).slideUp("slow", () => {
            dropped = -1;
            lock = false;

            if (next)
                next();
        });
    }
}

function setSubmenuPadding(n, next) {
    if ($(window).innerWidth() > 768) {
        var pos = $(menus[n]).position();
        $(submenus[n]).css("padding-left", pos.left - 10);

        if (next)
            next();
    }
}

function submenu(n) {
    if (dropped === -1) // no dropped => drop selected submenu
    {
        slideDown(n);
    }
    else if (dropped >= 0) // there is a dropped menu
    {
        if (dropped === n) // same as dropped => slide up current submenu
        {
            slideUp(dropped);

        } else // not the same => slide up current & drop selected
        {
            slideUp(dropped, () => { slideDown(n); });
        }
    }
}

//
// MOBILE MENUBAR
//
function mainmenu() {
    $('#mainMenu').slideToggle("slow");

    if (dropped !== -1) {
        slideUp(dropped);
    }
}

//
// RESIZE FUNCTIONS
//
$(window).resize(function () {

    $('#mainMenu').slideUp(0);

    if (dropped !== -1) {
        $(submenus[dropped]).slideUp(0);
        dropped = -1;
    }

    for (var i = 0; i < menus.length; i++) {
        $(menus[i]).removeClass("menuBtnSelected");
        $(submenus[i]).css("padding-left", 0);
    }
});

//
// Modal
//
function openModal(e, modalPrefix) {
    $('#' + modalPrefix + 'Modal').fadeIn(100);
}

function closeModal(e, modalPrefix) {
    $('#' + modalPrefix + 'Modal').fadeOut(100);
}

// 
// ONREADY
//
$(document).ready(function () {

    //
    // INIT FANCYBOX
    //
    $('.fancybox').fancybox();


    //
    // Modal Close
    //
    // $("[id$='Modal']").click(closeModal);
});
