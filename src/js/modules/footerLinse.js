const footerLinse = () => {
    console.log('Footer linse!');
    let footer = document.querySelector(".footer");
    let footerShadowDiv = document.querySelector(".footer__linse");

    window.addEventListener('scroll', evt => {
        // let scroll = window.pageYOffset || evt.scrollY;

        if (window.innerHeight >= footer.getBoundingClientRect().bottom / 1.75) {
            footer.addEventListener('mousemove', e => {
                let shiftX = e.x + "px";
                let shiftY = e.y + "px";
                footerShadowDiv.style.cssText = `left: ${shiftX};
                top: ${shiftY};
                position: fixed;`;

            });
        } else {
            footerShadowDiv.style.cssText = `left: 50%;
                top: 50%;
                position: absolute;`;
        }

    });

};

export default footerLinse;