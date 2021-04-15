$(document).foundation();

$(document).ready(function() {
    $.ajax({
        url: 'https://api.github.com/repos/bridgecrewio/checkov',
        headers: { 'Accept': 'application/vnd.github.preview'},
        success: function(response) {
            if(response.watchers_count) {
                $('.github-stars > a').append(
                    '<span class="separator"> &#x7c; </span> <span class="github-stars__count"><svg class="icon"><use xlink:href="#star"></use></svg>' + abbrNum(response.watchers_count, 1) + '</span>'
                )
            }
        },
        error: function(err) {
            console.log(err)
        }
    });

    $('.fade-carousel').slick({
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        fade: true,
        autoplay: true,
        cssEase: 'linear'
    });

    $('.hamburger-button').on('click', function(e) {
        var $mobileNav = $('.mobile-nav');

        if($mobileNav.hasClass('open')) {
            $mobileNav.removeClass('open');
        } else {
            $mobileNav.addClass('open');
        }
    })

    // Make sure current submenu is down on page load
    var $docsMenu = $('#docs-menu');
    if($docsMenu.length) {
        $docsMenu.foundation('down', $('.current.is-active > .submenu'))
    }


    // When the user scrolls the page, execute myFunction
    window.onscroll = function() {myFunction()};

    // Get the header
    var header = document.getElementById("sticky-nav");

    // Get the offset position of the navbar
    var offset = header.offsetTop;

    // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function myFunction() {
        if (window.pageYOffset > offset) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }

    // Smooth scroll on docs
    $('a').click(function (e) {
        var $top = ($($(this).attr('href')).offset().top - 106);

        $('html, body').animate({
            scrollTop: $top
        }, 1000);
    });
})

function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number*decPlaces/size)/decPlaces;

            // Handle special case where we round up to the next abbreviation
            if((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }

            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return number;
}
