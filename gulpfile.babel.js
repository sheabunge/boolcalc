'use strict';

import gulp from 'gulp';
import run from 'run-sequence';
import livereload from 'gulp-livereload';
import sourcemaps from 'gulp-sourcemaps';
import clean from 'gulp-clean';

import postcss from 'gulp-postcss';
import precss from 'precss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';

const dest = 'dist';

gulp.task('css', () => {
    let processors = [
        precss(),
        autoprefixer(),
        cssnano()
    ];

    return gulp.src('css/app.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest))
        .pipe(livereload())
});

gulp.task('js', () => {

    return browserify({ entries: 'js/app.js', debug: true })
        .transform('babelify', { presets: ['es2015'], sourceMaps: true })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest))
        .pipe(livereload())
});

gulp.task('watch', ['default'], () => {
    livereload.listen();
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch('css/**/*.css', ['css']);
});


gulp.task('clean', () => {
    return gulp.src(dest, {read: false})
        .pipe(clean());
});

gulp.task('default', () => {
    run('clean', ['css', 'js'])
});
