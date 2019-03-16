const lazyImage = () => {
    $('img').not('.avatar').each(function () {
        let $image = $(this);
        let src = $image.attr('src');
        if ($image.attr('data-original')) {
            return;
        }
        if ($image.attr('class')) {
            $image.attr('class', $image.attr('class') + " lazy");
        } else {
            $image.attr('class', 'lazy');
        }
        $image.attr('data-original', src);
        $image.removeAttr('src');
    });
};

const wrapImage = () => {
    $('img').not('.avatar').not('#bing_img').each(function () {
        let $image = $(this);
        if ($image.attr('data-src')) {
            return;
        }
        let imageCaption = $image.attr('alt');
        let $imageWrapLink = $image.parent('a');

        if ($imageWrapLink.length < 1) {
            let src = $image.attr('data-original');
            let idx = src.lastIndexOf('?');
            if (idx !== -1) {
                src = src.substring(0, idx);
            }
            $imageWrapLink = $image.wrap('<a href="' + src + '"></a>').parent('a');
        }
        $imageWrapLink.attr('data-fancybox', 'gallery');
        if (imageCaption) {
            $imageWrapLink.attr('data-caption', imageCaption);
        }
    });
};

const loadBgImage = () => {
    $("img[id='bing_img'][class='lazy']").lazyload({
        effect: 'fadeIn',
        threshold: 5,
    });
}

const loadImage = () => {
    $("img.lazy").not("#bing_img").lazyload({
        effect: 'fadeIn',
        threshold: 50,
    });
};