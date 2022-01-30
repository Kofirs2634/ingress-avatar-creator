// protect context with self-invokable function
;(function() {
    // some constants
    const PATH = './assets'
    const BG_COLORS = ['#271B5D', '#5F1601', '#444444', '#0A5B2A', '#585B21', '#640058', '#7E0000', '#005B5B']
    const FG_COLORS = ['#8EB9E4', '#81D9F0', '#5E5E5E', '#9CDC9C', '#FFC895', '#F3A5CD', '#FF9095', '#F5F68E']
    var CHOSEN_BORDER

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
            .append($('<img>', { src: `${PATH}/backgrounds/bg_${i}.png` })))
    }
    for (let i = 0; i <= 34; i++) {
        $('.fg-samples').append($('<div>', { class: 'prev', 'data-index': i })
            .append($('<img>', { src: `${PATH}/foregrounds/fg_${i}.png` })))
    }

    // set new chosen element by click
    $('.color, .prev').bind('click', e => {
        if ($('#save').attr('disabled'))
            $('#save').removeAttr('disabled')
        const _t = $(e.target)
        if (!_t.attr('class')) {
            _t.parent().siblings().removeClass('chosen')
            _t.parent().addClass('chosen')
        } else {
            _t.siblings().removeClass('chosen')
            _t.addClass('chosen')
        }
        redrawCanvas(CHOSEN_BORDER)
    })

    /**
     * Update canvas depending on chosen ornaments and colors
     * @param {HTMLImageElement=} border Optional [REDACTED] avatar border image
     */
    function redrawCanvas(border) {
        // getting canvases' contexts
        const ctxBg = $('#bg')[0].getContext('2d')
        const ctxFg = $('#fg')[0].getContext('2d')
        const ctxR = $('#result')[0].getContext('2d')

        const ornamentSize = typeof border != 'undefined' ? 58 : 128
        const ornamentPos = typeof border != 'undefined' ? 35 : 0

        // preparing background
        ctxBg.globalCompositeOperation = 'source-over'
        ctxBg.clearRect(0, 0, 128, 128)
        ctxBg.drawImage($('.bg-samples .chosen img')[0], ornamentPos, ornamentPos, ornamentSize, ornamentSize)
        ctxBg.globalCompositeOperation = 'source-in'
        ctxBg.fillStyle = $('.bg-colors .chosen div').css('background-color')
        ctxBg.fillRect(0, 0, 128, 128)

        // drawing [REDACTED] avatar border
        if (typeof border != 'undefined') {
            ctxBg.globalCompositeOperation = 'destination-over'
            ctxBg.drawImage(border, 0, 0)
        }

        // preparing foreground
        ctxFg.globalCompositeOperation = 'source-over'
        ctxFg.clearRect(0, 0, 128, 128)
        ctxFg.drawImage($('.fg-samples .chosen img')[0], ornamentPos, ornamentPos, ornamentSize, ornamentSize)
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
    setTimeout(() => redrawCanvas(), 2000)

    // save image by click on button
    $('#save').bind('click', () => {
        const data = $('#result')[0].toDataURL()
        const download = $('<a>')
            .attr('href', data)
            .attr('download', 'avatar.png')
        download[0].click()
    })

    // toggle [REDACTED] avatar mode
    $('#redacted-mode').bind('change', e => {
        const active = e.target.checked
        if (active) {
            $('#level, #faction-enl, #faction-res').removeAttr('disabled')
            getRedactedBorder()
        } else {
            $('#level, #faction-enl, #faction-res').attr('disabled', '')
            CHOSEN_BORDER = undefined
            redrawCanvas()
        }
    })
    $('#level, #faction-enl, #faction-res').bind('change', getRedactedBorder)

    /**
     * Gets [REDACTED] avatar border according to some settings
     */
    function getRedactedBorder() {
        const level = $('#level').val()
        const faction = $('input[name="faction"]:checked').attr('data-faction')
        const img = new Image()
        img.src = `${PATH}/redacted/${faction}/${(level < 1 || level > 16) ? 1 : level}.png`
        img.addEventListener('load', e => {
            CHOSEN_BORDER = e.path[0]
            redrawCanvas(CHOSEN_BORDER)
        })
    }
})();
