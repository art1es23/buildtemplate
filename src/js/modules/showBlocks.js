const showBlocks = () => {
    window.addEventListener("scroll", function (e) {
        const bindModule = (parentSelector, childSelector, activeClass) => {
            let wScroll = window.innerHeight;

            let parentElement = document.querySelector(parentSelector);
            let parentElementTop = parentElement.getBoundingClientRect().top;
            let childElement = document.querySelectorAll(childSelector);

            if (wScroll > parentElementTop) {
                for (let i = 0; i < childElement.length; i++) {
                    setTimeout(function () {
                        childElement[i].classList.add(activeClass);
                    }, 150 * (i + 1));
                }
            }
        };

        bindModule('.portfolio', '.works__item', 'works__item--show');
        bindModule('.services', '.box-group__item', 'box-group__item--show');
    });
};

export default showBlocks;