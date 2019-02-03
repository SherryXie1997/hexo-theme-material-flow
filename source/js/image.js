const lazyImage = () => {
    $('img').not('.avatar').each(function () {
        let $image = $(this);
        let src = $image.attr('src');
        $image.attr('class', 'lazy');
        $image.attr('data-original', src);
        $image.removeAttr('src');
    });
};

const wrapImage = () => {
    $('img').not('.avatar').each(function () {
        let $image = $(this);
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

const loadImage = () => {
    $("img.lazy").lazyload({
        effect: 'fadeIn',
        threshold: 50,
    });
};