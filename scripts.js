$(document).ready(function() {
    // Smooth scrolling for navigation links
    $('nav a').on('click', function(event) {
        event.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 50
        }, 800);
    });

    // Mobile menu toggle (if needed, add a hamburger button in HTML)
    // $('.hamburger').on('click', function() {
    //     $('nav ul').toggleClass('show');
    // });

    // Modal for project details
    $('.view-btn').on('click', function() {
        var description = $(this).closest('.project-card').data('description');
        $('#modal-description').text(description);
        $('#modal').fadeIn();
    });

    $('.close').on('click', function() {
        $('#modal').fadeOut();
    });

    $(window).on('click', function(event) {
        if (event.target == $('#modal')[0]) {
            $('#modal').fadeOut();
        }
    });

    // Basic form submission (replace with real backend if needed)
    $('#contact-form').on('submit', function(event) {
        event.preventDefault();
        alert('Thank you for your message! (Form not connected to backend yet.)');
        $(this).trigger('reset');
    });
});