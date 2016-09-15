'use strict';

let gulp = require('gulp');
let sequence = require('run-sequence');
let livereload = require('gulp-livereload');
let sourcemaps = require('gulp-sourcemaps');
let clean = require('gulp-clean');

let postcss = require('gulp-postcss');
let precss = require('precss');
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');

let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let uglify = require('gulp-uglify');

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
    sequence('clean', ['css', 'js'])
});
