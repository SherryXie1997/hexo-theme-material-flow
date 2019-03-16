let customSearch;
let scrollCorrection = 70;


let changeEssay = () => {
    $('#digest, #open').fadeOut(1000, () => {
        $('#content').fadeIn(1000);
    });
}

let scrollToElement = (elem, correction) => {
    correction = correction || scrollCorrection;
    let $elem = elem.href ? $(elem.getAttribute('href')) : $(elem);
    $('html, body').animate({ 'scrollTop': $elem.offset().top - correction }, 400);
};

let initCustomSearch = () => {
    if (CONFIG.search_service === 'google') {
        customSearch = new GoogleCustomSearch({
            apiKey: GOOGLE_CUSTOM_SEARCH_API_KEY,
            engineId: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
            imagePath: "/images/"
        });
    } else if (CONFIG.search_service === 'algolia') {
        customSearch = new AlgoliaSearch({
            apiKey: ALGOLIA_API_KEY,
            appId: ALGOLIA_APP_ID,
            indexName: ALGOLIA_INDEX_NAME,
            imagePath: "/images/"
        });
    } else if (CONFIG.search_service === 'hexo') {
        customSearch = new HexoSearch({
            imagePath: "/images/"
        });
    } else if (CONFIG.search_service === 'azure') {
        customSearch = new AzureSearch({
            serviceName: AZURE_SERVICE_NAME,
            indexName: AZURE_INDEX_NAME,
            queryKey: AZURE_QUERY_KEY,
            imagePath: "/images/"
        });
    } else if (CONFIG.search_service === 'baidu') {
        customSearch = new BaiduSearch({
            apiId: BAIDU_API_ID,
            imagePath: "/images/"
        });
    }
}


let initHeaderMenu = () => {
    let $headerMenu = $('header .menu');
    let $underline = $headerMenu.find('.underline');

    function setUnderline($item, transition) {
        $item = $item || $headerMenu.find('li a.active');//get instant
        transition = transition === undefined ? true : !!transition;
        if (!transition) $underline.addClass('disable-trans');
        if ($item && $item.length) {
            $item.addClass('active').siblings().removeClass('active');
            $underline.css({
                left: $item.position().left,
                width: $item.innerWidth()
            });
        } else {
            $underline.css({
                left: 0,
                width: 0
            });
        }
        if (!transition) {
            setTimeout(function () {
                $underline.removeClass('disable-trans')
            }, 0);//get into the queue.
        }
    }

    $headerMenu.on('mouseenter', 'li', function (e) {
        setUnderline($(e.currentTarget));
    });
    $headerMenu.on('mouseout', function () {
        setUnderline();
    });
    //set current active nav
    let $active_link = null;
    if (location.pathname === '/' || location.pathname.startsWith('/page/')) {
        $active_link = $('.nav-home', $headerMenu);
    } else {
        let pathname = location.pathname;
        pathname = pathname[pathname.length - 1] === '\/' ? pathname : pathname + '\/';
        let name = pathname.match(/\/(.*?)\//);
        if (name.length > 1) {
            $active_link = $('.nav-' + name[1], $headerMenu);
        }
    }
    setUnderline($active_link, false);
};

// only once
let initHeaderMenuPhone = () => {
    let $switcher = $('.l_header .switcher .s-menu');
    $switcher.click(function (e) {
        e.stopPropagation();
        $('body').toggleClass('z_menu-open');
        $switcher.toggleClass('active');
    });
    $(document).click(function (e) {
        $('body').removeClass('z_menu-open');
        $switcher.removeClass('active');
    });
};

// only once
let initHeaderSearch = () => {
    let $switcher = $('.l_header .switcher .s-search');
    let $header = $('.l_header');
    let $search = $('.l_header .m_search');
    if ($switcher.length === 0) return;
    $switcher.click(function (e) {
        e.stopPropagation();
        $header.toggleClass('z_search-open');
        $search.find('input').focus();
    });
    $(document).click(function (e) {
        $header.removeClass('z_search-open');
    });
    $search.click(function (e) {
        e.stopPropagation();
    })
};


// only once
let initHeaderIconTop = () => {
    let $wrapper = $('header .wrapper');
    let $top = $('.s-top', $wrapper);
    $top.click(() => scrollToElement(document.body))
}

let initHeaderIconDown = () => {
    let $wrapper = $('header .wrapper');
    let $down = $('.s-down', $wrapper);
    let $downTarget = $('#footer');
    $down.click(e => {
        e.preventDefault();
        e.stopPropagation();
        scrollToElement($downTarget);
    });
}

let initHeaderIconComment = () => {
    let $wrapper = $('header .wrapper');
    let $comment = $('.s-comment', $wrapper);
    let $down = $('.s-down', $wrapper);
    let $commentTarget = $('#gitalk-container');
    if ($commentTarget.length) {
        $down.hide();
        $comment.unbind("click");
        $comment.show();
        $comment.click(e => {
            e.preventDefault();
            e.stopPropagation();
            scrollToElement($commentTarget);
        });
    } else {
        $comment.hide();
        $down.show();
    }
}

let initHeader = () => {
    // header init, clear active
    let $headerMenu = $('header .menu');
    let $item = $headerMenu.find('li a.active');
    if ($item && $item.length) {
        $item.removeClass('active');
    }

    if (!window.subData) return;
    let $wrapper = $('header .wrapper');

    $wrapper.find('.nav-sub .logo').text(window.subData.title);
    let pos = document.body.scrollTop;
    $(document, window).scroll(() => {
        let scrollTop = $(window).scrollTop();
        let del = scrollTop - pos;
        if (del >= 50 && scrollTop > 100) {
            pos = scrollTop;
            $wrapper.addClass('sub');
        } else if (del <= -50) {
            pos = scrollTop;
            $wrapper.removeClass('sub');
        }
    });
};

let initWaves = () => {
    Waves.attach('.flat-btn', ['waves-button']);
    Waves.attach('.float-btn', ['waves-button', 'waves-float']);
    Waves.attach('.float-btn-light', ['waves-button', 'waves-float', 'waves-light']);
    Waves.attach('.flat-box', ['waves-block']);
    Waves.attach('.float-box', ['waves-block', 'waves-float']);
    Waves.attach('.waves-image');
    Waves.init();
};

let initReveal = () => {
    let $reveal = $('.reveal');
    if ($reveal.length === 0) return;
    let sr = ScrollReveal({ distance: '0px', easing: 'ease-in' });
    sr.destroy();
    sr.reveal('.reveal');
};


let initToc = () => {
    if (!$('.toc-wrapper').length)
        return;
    $('.toc-wrapper a').unbind('click');
    $('.toc-wrapper a').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        scrollToElement(this);
    });
};

let initTagCloud = () => {
    if (!location.pathname.startsWith('/tagcloud/'))
        return;
    TagCanvas.textColour = null;
    TagCanvas.textHeight = 18;
    TagCanvas.outlineMethod = 'block';
    TagCanvas.maxSpeed = 0.03;
    TagCanvas.minBrightness = 0.2;
    TagCanvas.pulsateTo = 0.6;
    // TagCanvas.initial = [0.1, -0.1];
    TagCanvas.reverse = true;
    TagCanvas.hideTags = false;
    TagCanvas.weight = false;
    TagCanvas.imageScale = null;
    TagCanvas.fadeIn = 1000;
    TagCanvas.clickToFront = 600;
    try {
        TagCanvas.Delete('tagcanvas')
        TagCanvas.Start('tagcanvas', '', {
            shape: 'sphere'
        })
        TagCanvas.tc['tagcanvas'].Wheel(false);
    } catch (e) {

    }
};

let initGallery = () => {
    if (!location.pathname.startsWith('/gallery/'))
        return;
    let pics = [];
    const gallery = document.getElementById('gallery');
    const createElements = pic => {
        let img = document.createElement('img');
        img.setAttribute("src", pic.url);
        let div = document.createElement('div');
        let divStyle = "flex-grow:" + pic.width * 100 / pic.height + ";flex-basis:" + pic.width * 200 / pic.height + "px;"
        div.setAttribute('style', divStyle);
        let i = document.createElement('i');
        let iStyle = "padding-bottom:" + pic.height / pic.width * 100 + "%";
        i.setAttribute("style", iStyle);
        div.appendChild(i);
        div.appendChild(img);
        gallery.appendChild(div);
    };
    const removeElements = elem => {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    };
    const initialize = () => {
        removeElements(gallery);
        pics.forEach(createElements);
        document.body.scrollTop = 0;
    };

    fetch('/gallery/data.json')
        .then(res => res.json())
        .then(images => {
            pics = images.pics;
            initialize();
            lazyImage();
            wrapImage();
            loadImage();
        });
};

let initImage = () => {
    if (location.pathname.startsWith('/gallery/'))
        return;

    lazyImage();
    wrapImage();
    loadImage();
};

let initMotto = () => {
    $("#motto-div").click(function () {
        $("#motto-div").unbind('click');
        let options = {
            strings: ["Hello，你好哇！", "睁着一只眼睛，关注人生。\n闭着一只眼睛，放进梦意。"],
            typeSpeed: 100,
            backSpeed: 100,
            startDelay: 500,
            backDelay: 500,
            onComplete: function () {
                let cursor = document.querySelector('.typed-cursor');
                setTimeout(function () {
                    cursor.style.opacity = 0;
                }, 2000);
            }
        }
        let typed = new Typed("#motto", options);
    });
}

let init = () => {
    initCustomSearch();
    initHeader();
    initHeaderIconTop();
    initHeaderIconDown();
    initHeaderIconComment();
    initHeaderMenu();
    initHeaderMenuPhone();
    initHeaderSearch()
    initWaves();
    initReveal();
    initToc();
    initTagCloud();
    initGallery();
    initImage();
    loadBgImage();
    initSince();
    initMotto();
    $(".article .video-container").fitVids();
};

let pjax_init = () => {
    initHeader();
    initHeaderIconComment();
    initHeaderMenu();
    initWaves();
    initReveal();
    initToc();
    initTagCloud();
    initGallery();
    initImage();
    $(".article .video-container").fitVids();
};
