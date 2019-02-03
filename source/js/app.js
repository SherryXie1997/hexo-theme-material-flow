/* eslint-disable */
let customSearch;
(function ($) {

    "use strict";
    let scrollCorrection = 70; // (header height = 50px) + (gap = 20px)
    function scrollToElement(elem, correction) {
        correction = correction || scrollCorrection;
        let $elem = elem.href ? $(elem.getAttribute('href')) : $(elem);
        $('html, body').animate({'scrollTop': $elem.offset().top - correction}, 400);
    };

    function setHeader() {
        if (!window.subData) return;
        let $wrapper = $('header .wrapper');
        let $comment = $('.s-comment', $wrapper);
        let $top = $('.s-top', $wrapper);

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
        // bind events to every btn
        let $commentTarget = $('#vcomments');
        if ($commentTarget.length) {
            $comment.click(e => {
                e.preventDefault();
                e.stopPropagation();
                scrollToElement($commentTarget);
            });
        } else $comment.remove();

        $top.click(() => scrollToElement(document.body));
    }

    function setHeaderMenu() {
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
            let name = location.pathname.match(/\/(.*?)\//);
            if (name.length > 1) {
                $active_link = $('.nav-' + name[1], $headerMenu);
            }
        }
        setUnderline($active_link, false);
    }

    function setHeaderMenuPhone() {
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
    }

    function setHeaderSearch() {
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
    }

    function setWaves() {
        Waves.attach('.flat-btn', ['waves-button']);
        Waves.attach('.float-btn', ['waves-button', 'waves-float']);
        Waves.attach('.float-btn-light', ['waves-button', 'waves-float', 'waves-light']);
        Waves.attach('.flat-box', ['waves-block']);
        Waves.attach('.float-box', ['waves-block', 'waves-float']);
        Waves.attach('.waves-image');
        Waves.init();
    }

    function setScrollReveal() {
        let $reveal = $('.reveal');
        if ($reveal.length === 0) return;
        let sr = ScrollReveal({distance: 0});
        sr.reveal('.reveal');
    }

    function setTocToggle() {
        let $toc = $('.toc-wrapper');
        if ($toc.length === 0) return;
        // $toc.click((e) => { e.stopPropagation(); $toc.addClass('active'); });
        $(document).click(() => $toc.removeClass('active'));

        $toc.on('click', 'a', (e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollToElement(e.target.tagName.toLowerCase === 'a' ? e.target : e.target.parentElement);
        });

        let liElements = Array.from($toc.find('li a'));
        //function animate above will convert float to int.
        let getAnchor = () => liElements.map(elem => Math.floor($(elem.getAttribute('href')).offset().top - scrollCorrection));

        let anchor = getAnchor();
        let scrollListener = () => {
            let scrollTop = $('html').scrollTop() || $('body').scrollTop();
            if (!anchor) return;
            //binary search.
            let l = 0, r = anchor.length - 1, mid;
            while (l < r) {
                mid = (l + r + 1) >> 1;
                if (anchor[mid] === scrollTop) {
                    l = r = mid;
                } else if (anchor[mid] < scrollTop) {
                    l = mid;
                } else {
                    r = mid - 1;
                }
            }
            $(liElements).removeClass('active').eq(l).addClass('active');
        }
        $(window)
            .resize(() => {
                anchor = getAnchor();
                scrollListener();
            })
            .scroll(() => {
                scrollListener()
            });
        scrollListener();
    }


    $(function () {
        setHeader();
        setHeaderMenu();
        setHeaderMenuPhone();
        setHeaderSearch();
        setWaves();
        setScrollReveal();
        setTocToggle();

        $(".article .video-container").fitVids();

        setTimeout(function () {
            $('#loading-bar-wrapper').fadeOut(500);
        }, 300);

        if (SEARCH_SERVICE === 'google') {
            customSearch = new GoogleCustomSearch({
                apiKey: GOOGLE_CUSTOM_SEARCH_API_KEY,
                engineId: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
                imagePath: "/images/"
            });
        } else if (SEARCH_SERVICE === 'algolia') {
            customSearch = new AlgoliaSearch({
                apiKey: ALGOLIA_API_KEY,
                appId: ALGOLIA_APP_ID,
                indexName: ALGOLIA_INDEX_NAME,
                imagePath: "/images/"
            });
        } else if (SEARCH_SERVICE === 'hexo') {
            customSearch = new HexoSearch({
                imagePath: "/images/"
            });
        } else if (SEARCH_SERVICE === 'azure') {
            customSearch = new AzureSearch({
                serviceName: AZURE_SERVICE_NAME,
                indexName: AZURE_INDEX_NAME,
                queryKey: AZURE_QUERY_KEY,
                imagePath: "/images/"
            });
        } else if (SEARCH_SERVICE === 'baidu') {
            customSearch = new BaiduSearch({
                apiId: BAIDU_API_ID,
                imagePath: "/images/"
            });
        }

    });

})(jQuery);