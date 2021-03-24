/*
require('require-dir')('./gulp', { recurse: true });*/

const gulp = require('gulp');
const {
    parallel,
    series,
    watch,
    src,
    dest
} = require('gulp');
/*
const cfg = require('../package.json').config;
*/
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttf2wof = require('gulp-ttf2woff');
const ttf2wof2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify');
const tinyPNG = require('gulp-tinypng-compress');

const pug = require('gulp-pug');

const assets = './src/assets/';

sass.compiler = require('node-sass');

const styles = () => {
    return gulp.src('./src/sass/**/*.{scss,sass}')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'expanded'
        }))
        .on('error', notify.onError())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCss({
            level: 2
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream());
};

const converseInHTML = () => {
    return gulp.src(`${assets}templates/*.pug`)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./src/'));
};

const htmlInclude = () => {
    return src(['./src/*.html'])
        .pipe(fileInclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(dest('./build'))
        .pipe(browserSync.stream());
};

const imgMove = () => {
    return src([`${assets}img/*.jpg`, `${assets}img/*.jpeg`, `${assets}img/*.png`, `${assets}img/*.json`, `${assets}img/*.ico`])
        .pipe(dest('./build/img/'));
};

const svgSprites = () => {
    return src(`${assets}img/svg/**.svg`)
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest('./build/img/'));
};

const resourcesMove = () => {
    return src(`${assets}/resources/**`)
        .pipe(dest('./build/resources/'));
};

const fonts = () => {
    src(`${assets}fonts/**.ttf`)
        .pipe(ttf2wof())
        .pipe(dest('./build/fonts/'));
    return src(`${assets}fonts/**.ttf`)
        .pipe(ttf2wof2())
        .pipe(dest('./build/fonts/'));
};

const checkWeight = (fontname) => {
    let weight = 400;
    switch (true) {
        case /Thin/.test(fontname):
            weight = 100;
            break;
        case /ExtraLight/.test(fontname):
            weight = 200;
            break;
        case /Light/.test(fontname):
            weight = 300;
            break;
        case /Regular/.test(fontname):
            weight = 400;
            break;
        case /Medium/.test(fontname):
            weight = 500;
            break;
        case /SemiBold/.test(fontname):
            weight = 600;
            break;
        case /Semi/.test(fontname):
            weight = 600;
            break;
        case /Bold/.test(fontname):
            weight = 700;
            break;
        case /ExtraBold/.test(fontname):
            weight = 800;
            break;
        case /Heavy/.test(fontname):
            weight = 700;
            break;
        case /Black/.test(fontname):
            weight = 900;
            break;
        default:
            weight = 400;
    }
    return weight;
};

const cb = () => {};

let srcFonts = './src/sass/helpers/_fonts.sass';
let appFonts = './build/fonts/';

const fontsStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, '', cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                let font = fontname.split('-')[0];
                let weight = checkWeight(fontname);

                if (c_fontname != fontname) {
                    fs.appendFile(srcFonts, '@include font-face("' + font + '", "' + fontname + '", ' + weight + ')\r\n', cb);
                }
                c_fontname = fontname;
            }
        }
    });

    done();
};

const clean = () => {
    return del(['./build/**']);
};

const scripts = () => {
    return src('./src/js/main.js')
        .pipe(webpackStream({
            mode: 'development',
            output: {
                filename: 'script.js',
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]
                            ]
                        }
                    }
                }]
            }
        }))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end'); // Don't stop the rest of the task
        })
        .pipe(sourcemaps.init())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/js/'))
        .pipe(browserSync.stream());
};

const server = () => {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        /*files: ['build/!*.html', 'build/!**!/!*.css', 'build/img/!*.*', 'build/!**!/!*.js']*/
    });
    watch('./src/sass/**/*.{scss,sass}', styles);
    watch(`${assets}templates/**`, converseInHTML);
    watch('./src/*.html', htmlInclude);
    watch(`${assets}img/**`, imgMove);
    watch(`${assets}img/svg/*.svg`, svgSprites);
    watch(`${assets}resources/**`, resourcesMove);
    watch(`${assets}fonts/**`, fonts);
    watch(`${assets}fonts/**`, fontsStyle);
    watch('./src/js/**/*.js', scripts);
};

exports.styles = styles;
exports.server = server;
exports.converseInHTML = converseInHTML;
exports.htmlInclude = htmlInclude;
exports.imgMove = imgMove;
exports.svgSprites = svgSprites;
exports.resourcesMove = resourcesMove;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.clean = clean;
exports.scripts = scripts;

/*
exports.default = series(clean, parallel(htmlInclude, scripts, imgMove), styles, server);
*/
exports.default = series(clean, parallel(converseInHTML, scripts, fonts, imgMove, svgSprites, resourcesMove), fontsStyle, htmlInclude, styles, server);

const tinyImages = () => {
    return src(`${assets}img/**/*.{png,jpg,jpeg}`)
        .pipe(tinyPNG({
            key: 'mpV6rftBN8Fc0cCB7LknY5y4ZfbyrPjc',
            log: true,
            parallelMax: 50
        }))
        .pipe(dest('./build/img/'));
};

const scriptsProduction = () => {
    return src('./src/js/main.js')
        .pipe(webpackStream({
            output: {
                filename: 'main.js',
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }]
            }
        }))
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest('./build/js/'));
};

const stylesProduction = () => {
    return gulp.src('./src/sass/**/*.{scss,sass}')
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'expanded'
        }))
        .on('error', notify.onError())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCss({
            level: 2
        }))
        .pipe(gulp.dest('./build/css/'));
};

exports.product = series(clean, parallel(htmlInclude, scriptsProduction, fonts, imgMove, svgSprites, resourcesMove), fontsStyle, stylesProduction, server, tinyImages);