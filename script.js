// protect context with self-invokable function
;(function() {
    // some constants
    const PATH = './assets/$1.png'
    const BG_COLORS = ['#271B5D', '#5F1601', '#444444', '#0A5B2A', '#585B21', '#640058', '#7E0000', '#005B5B']
    const FG_COLORS = ['#8EB9E4', '#81D9F0', '#5E5E5E', '#9CDC9C', '#FFC895', '#F3A5CD', '#FF9095', '#F5F68E']

    // append colors to user interface
    BG_COLORS.forEach(e => {
        $('.bg-colors').append($('<div>', { class: 'color' })
            .append($('<div>').css('background-color', e)))
    })
    FG_COLORS.forEach(e => {
        $('.fg-colors').append($('<div>', { class: 'color' })
            .append($('<div>').css('background-color', e)))
    })

    // do same for avatar ornaments
    for (let i = 0; i <= 8; i++) {
        $('.bg-samples').append($('<div>', { class: 'prev', 'data-index': i })
            .append($('<img>', { src: PATH.replace('$1', `bg_${i}`) })))
    }
    for (let i = 0; i <= 34; i++) {
        $('.fg-samples').append($('<div>', { class: 'prev', 'data-index': i })
            .append($('<img>', { src: PATH.replace('$1', `fg_${i}`) })))
    }

    // set new chosen element by click
    $('.color, .prev').bind('click', e => {
        const _t = $(e.target)
        if (!_t.attr('class')) {
            _t.parent().siblings().removeClass('chosen')
            _t.parent().addClass('chosen')
        } else {
            _t.siblings().removeClass('chosen')
            _t.addClass('chosen')
        }
        redrawCanvas()
    })

    /**
     * Update canvas depending on chosen ornaments and colors
     */
    function redrawCanvas() {
        // getting canvases' contexts
        const ctxBg = $('#bg')[0].getContext('2d')
        const ctxFg = $('#fg')[0].getContext('2d')
        const ctxR = $('#result')[0].getContext('2d')

        // preparing background
        ctxBg.globalCompositeOperation = 'source-over'
        ctxBg.clearRect(0, 0, 128, 128)
        ctxBg.drawImage($('.bg-samples .chosen img')[0], 0, 0)
        ctxBg.globalCompositeOperation = 'source-in'
        ctxBg.fillStyle = $('.bg-colors .chosen div').css('background-color')
        ctxBg.fillRect(0, 0, 128, 128)

        // preparing foreground
        ctxFg.globalCompositeOperation = 'source-over'
        ctxFg.clearRect(0, 0, 128, 128)
        ctxFg.drawImage($('.fg-samples .chosen img')[0], 0, 0)
        ctxFg.globalCompositeOperation = 'source-in'
        ctxFg.fillStyle = $('.fg-colors .chosen div').css('background-color')
        ctxFg.fillRect(0, 0, 128, 128)

        // drawing result
        ctxR.clearRect(0, 0, 128, 128)
        ctxR.drawImage($('#bg')[0], 0, 0)
        ctxR.drawImage($('#fg')[0], 0, 0)
    }

    // choose default parameters
    $('.bg-colors .color').eq(0).addClass('chosen')
    $('.fg-colors .color').eq(0).addClass('chosen')
    $('.bg-samples .prev').eq(0).addClass('chosen')
    $('.fg-samples .prev').eq(0).addClass('chosen')
})();
