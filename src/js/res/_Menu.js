class Menu {
    constructor() {
        this.header = document.querySelector('.header');
        this.menuToogle = this.header.querySelector('.menu');
        this.menuNav = this.header.querySelector('.navigation--wrapper');
        this.slider = document.querySelector('.slider');

        this.toggleNavigation();
        this.scrollDefault();
    }
    // toggle() {

    //     let toggleBtn = this.menuToogle;
    //     let toggleMenu = this.menuNav;

    //     console.log('asdasdasds');
    //     toggleMenu.classList.add('show');
    //     toggleBtn.classList.add('btn--swap');
    // }

    toggleNavigation() {
        this.menuToogle.addEventListener('click', (e) => {
            e.preventDefault();
            let toggleBtn = this.menuToogle;
            let toggleMenu = this.menuNav;
            let toggleHeader = this.header;
            let slider = this.slider;

            if (toggleHeader.classList.contains('header--size')) {
                toggleMenu.classList.remove('navigation--show');
                toggleBtn.classList.remove('btn--swap');
                toggleHeader.classList.remove('header--size');
                slider.classList.remove('slider--size');
                document.querySelector('.navigation').style.alignItems = 'center';
            }

            toggleMenu.classList.toggle('navigation--show');
            toggleBtn.classList.toggle('btn--swap');
            toggleHeader.classList.toggle('header--size');
            slider.classList.toggle('slider--size');
            document.querySelector('.navigation').style.alignItems = 'baseline';
            toggleHeader.classList.remove('header--position');
        });
    }

    scrollDefault() {
        let toggleHeader = this.header;
        let toggleMenu = this.menuNav;
        let xHeader = toggleHeader.clientHeight;

        window.addEventListener('scroll', (e) => {
            e.preventDefault();
            let scrollPage = window.pageYOffset;
            console.log('adsa', xHeader);

            toggleHeader.classList.remove('header--position', 'header--size');
            // toggleMenu.classList.remove('navigation--show');

            console.log(scrollPage);
            if (scrollPage > xHeader / 2) {
                toggleHeader.classList.add('header--position');

                // if (toggleHeader.classList.contains('header--size')) {
                //     toggleMenu.classList.add('navigation--show');
                // }
                // if (toggleHeader.classList.contains('header--size')) {
                //     toggleHeader.classList.remove('header--size');
                //     toggleMenu.classList.remove('navigation--show');
                // }
                console.log('start');
            } else {
                toggleMenu.classList.remove('navigation--show');
                // toggleHeader.classList.remove('header--size');
            }

        });
    }


}


export default Menu;