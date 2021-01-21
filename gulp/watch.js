const gulp = require('gulp');
const runSequence = require('gulp4-run-sequence');

gulp.task('default', function() {
    runSequence('copy',
        'sass',
        'server',
        'copy:watch',
        'sass:watch'
    );
});