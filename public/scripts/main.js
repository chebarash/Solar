$(document).scroll(function () {
    let offset = window.pageYOffset;
    $('.parLG').css("margin-top", offset * - 0.4 + "px");
    $('.parMD').css("margin-top", offset * - 0.3 + "px");
    $('.parSM').css("margin-top", offset * - 0.15 + "px");

    $('.fi1').css("margin-top", 110 - -(offset - 950 * 9.5) * 0.2 + "px");
    $('.fi2').css("margin-top", -(offset - 950 * 7) * 0.2 + "px");
    $('.fi3').css("margin-top", -(offset - 950 * 6) * 0.2 + "px");
})

let styleIconBtn = $('.styles-bar-btn')
let st_block = $('.st-block')

styleIconBtn.click(function () {
    let thisIdx = $(this).index()

    styleIconBtn.removeClass('styles-bar-active')
    $(styleIconBtn[thisIdx]).addClass('styles-bar-active')

    st_block.removeClass('styles-active')
    $(st_block[thisIdx]).addClass('styles-active')
})

let specials_space = $('.specials-space')
let post_sp = $('.post-specials')
let specials = $('.specials-hide')
let specials_main = $('.specials')
let specials_bar = $('.specials-bar')

$('.specials-space').css('height', window.innerHeight * 3.5 + 'px')

$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= $(specials_space).offset().top + $(window).height()) {
        specials_bar.css('left', 950 + -$(window).scrollTop() / 2.2 + 'px');
        specials.css('position', 'sticky')
        specials_main.css('border-radius', '0')
    }
    else {
        specials_bar.css('left', '50px');
        specials.css('position', 'absolute')
        specials_main.css('border-radius', '50px')
    }
});
$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= $(post_sp).offset().top) {
        specials_bar.css('left', -window.innerHeight - 100 + 'px');
    }
});

let qa_block = $('.qa-block')
let qa_cY = $('.qa-check-y')
let qa_spec = $('.qa-block-spec')

$(qa_block[1]).click(function() {
    if ($(qa_spec).hasClass('qa-block-spec')) {
        qa_spec.removeClass('qa-block-spec')
        qa_cY.css('opacity', '1')
    } else {
        qa_spec.removeClass('qa-block-spec')
        qa_cY.css('opacity', '1')
        $(qa_spec).addClass('qa-block-spec')
        $(qa_cY).css('opacity', '0')
    }
})

qa_block.click(function () {
    let thisIdx = $(this).index()

    if ($(qa_block[thisIdx]).hasClass('qa-active')) {
        qa_block.removeClass('qa-active')
        qa_cY.css('opacity', '1')
    } else {
        qa_block.removeClass('qa-active')
        qa_cY.css('opacity', '1')
        $(qa_block[thisIdx]).addClass('qa-active')
        $(qa_cY[thisIdx]).css('opacity', '0')
    }
})

$('.goUp').click(function () {
    $('html, body').animate({
        scrollTop: 0
    }, 500)
})

$('.discover').click(function() {
    $('html, body').animate({
        scrollTop: $('.styles').offset().top - 300,
    }, 800)
})

var swiper = new Swiper(".mySwiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 30,
});

// var swiper = new Swiper(".mobile-specials", {
//     slidesPerView: "auto",
//     centeredSlides: true,
//     spaceBetween: 20,
// });


let dtone_button = $('.duotone-check-button')
let dtone_circle = $('.duotone-check-circle')

function dtone_btn(check) {
    let styleIconBtn_mobile = $('.styles-bar-btn-mobile')
    let st_block_mobile = $('.st-block-mobile')

    if (check) {
        styleIconBtn_mobile.removeClass('styles-bar-active-mobile')
        $(styleIconBtn_mobile[0]).addClass('styles-bar-active-mobile')
        styleIconBtn_mobile.click(function () {
            let thisIdx = $(this).index()

            styleIconBtn_mobile.removeClass('styles-bar-active-mobile')
            $(styleIconBtn_mobile[thisIdx]).addClass('styles-bar-active-mobile')

            st_block_mobile.removeClass('styles-active-mobile')
            $(st_block_mobile[thisIdx + 3]).addClass('styles-active-mobile')
        })
    } else {
        styleIconBtn_mobile.click(function () {
            let thisIdx = $(this).index()

            styleIconBtn_mobile.removeClass('styles-bar-active-mobile')
            $(styleIconBtn_mobile[thisIdx]).addClass('styles-bar-active-mobile')

            st_block_mobile.removeClass('styles-active-mobile')
            $(st_block_mobile[thisIdx]).addClass('styles-active-mobile')
        })
    }
}

dtone_btn()

$(dtone_button).click(function () {
    let st_block_mobile = $('.st-block-mobile')

    let thisIdx = 0

    if (dtone_button.hasClass('styles-active-mobile')) {
        dtone_button.removeClass('styles-active-mobile')
        dtone_button.css({
            'background': 'white',
            'justify-content': 'flex-start'
        })
        dtone_circle.css('background', 'var(--main-color)')

        st_block_mobile.removeClass('styles-active-mobile')
        $(st_block_mobile[thisIdx]).addClass('styles-active-mobile')

        dtone_btn(false)
    }
    else {
        dtone_button.addClass('styles-active-mobile')
        dtone_button.css({
            'background': 'var(--main-color)',
            'justify-content': 'flex-end'
        })
        dtone_circle.css('background', 'white')

        st_block_mobile.removeClass('styles-active-mobile')
        $(st_block_mobile[thisIdx + 3]).addClass('styles-active-mobile')

        dtone_btn(true)
    }
})

SmoothScroll({
    animationTime: 1000,
    stepSize: 75,
    stepSize: 100,
    accelerationDelta: 50,
    accelerationMax: 2,
    keyboardSupport: true,
    arrowScroll: 50,
    pulseAlgorithm: true,
    pulseScale: 4,
    pulseNormalize: 1,
    touchpadSupport: true,
})