
import gulp from 'gulp';
import run from 'run-sequence';
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
import eslint from 'gulp-eslint';

let browsersync = require('browser-sync').create();

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
		.pipe(browsersync.stream({ match: '**/*.css' }))
});

gulp.task('test-js', () => {

	const options = {
		parserOptions: {
			ecmaVersion: 6,
			sourceType: 'module'
		},
		extends: 'eslint:recommended',
		rules: {
			'quotes': ['error', 'single'],
			'linebreak-style': ['error', 'unix'],
			'eqeqeq': ['warn', 'always'],
			'indent': ['error', 'tab']
		}
	};

	return gulp.src(['*.js', 'js/**/*.js'])
		.pipe(eslint(options))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
});

gulp.task('js', ['test-js'], () => {

	const b = browserify({
		debug: true,
		entries: 'js/app.js'
	});

	b.transform('babelify', {
		presets: ['es2015'], sourceMaps: true
	});

	return b.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dest))
		.pipe(browsersync.stream({ match: '**/*.js' }))
});

gulp.task('watch', ['default'], () => {
	gulp.watch('css/**/*.css', ['css']);
	gulp.watch('js/**/*.js', ['js']);
});

gulp.task('browsersync', ['watch'], () => {

	browsersync.init({
		server: {
			baseDir: './'
		}
	});

	gulp.watch('*.html').on('change', browsersync.reload);
});

gulp.task('clean', () => {
	return gulp.src(dest, {read: false})
		.pipe(clean());
});

gulp.task('bootstrap', () => {
	return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css*')
		.pipe(gulp.dest(dest));
});

gulp.task('default', () => {
	run('clean', ['bootstrap', 'css', 'js'])
});

gulp.task('test', ['eslint']);
