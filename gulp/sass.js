const gulp = require('gulp');
const sass = require('gulp-sass');
const cfg = require('../package.json').config;
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src(cfg.src.sass + '/**/*.{scss,sass}')
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
        .pipe(gulp.dest(cfg.build.css));
});

gulp.task('sass:watch', function () {
    gulp.watch(cfg.src.sass + '/**/*.{scss,sass}', gulp.parallel('sass'));
});

/*
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cfg = require('../package.json').config;

sass.compiler = require('node-sass');

gulp.task('sass', function (){
    gulp.src(cfg.src.sass + '/!**!/!*.{scss,sass}')
    .pipe(sass({
        errorLogToConsole: true,
        outputStyle: 'compressed'
    }).on('error', console.error.bind(console)))
    .pipe(autoprefixer({
        overriderBrowserlist: ['last 2 versions'],
        cascade: true
    }))
    .pipe(gulp.dest(cfg.build.css));
});

gulp.task('sass:watch', function () {
    gulp.watch(cfg.src.sass + '/!**!/!*.{scss,sass}', gulp.parallel('sass'));
});*/
