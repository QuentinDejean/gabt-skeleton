var gulp = require('gulp'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	connect = require('gulp-connect'),
	rename = require('gulp-rename'),
	open = require('gulp-open'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	rev = require('gulp-rev'),
	minifyHTML = require('gulp-minify-html'),
	wiredep = require('wiredep').stream,
	livereload = require('gulp-livereload'),
	del = require('del'),

	config = (function () {
		var basenames = {
			styles: 'styles',
			scripts: 'scripts',
			images: 'images'
		};

		var env = {
			dev: 'app',
			test: '.tmp',
			prod: 'dist'
		};

		return {
			env: env,
			basenames: basenames,
			scripts: env.dev + '/**/*.js',
			styles: env.dev + '/**/*.less',
			images: env.dev + '/images/**/*',
			html: env.dev + '/**/*.html',
			host: '0.0.0.0',
			port: {
				app: 9000,
				lvd: 35729
			}
		}
	})();

/**************************************************************/
/******************** ASSETS RELATED TASKS ********************/
/**************************************************************/


/**
 * Style related Tasks
 * - Compile LESS files
 * - Autoprefix CSS
 * - Minify CSS and rename as .min
 * - Append in the dist/ folder
 **/
gulp.task('styles', function () {
	return gulp.src(config.styles)
		.pipe(less())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(config.env.test + '/' + config.basenames.styles))
		.pipe(rename({basename: config.basenames.styles}))
		.pipe(minifycss())
		.pipe(rev())
		.pipe(gulp.dest(config.env.prod + '/' + config.basenames.styles))
		.pipe(notify({message: 'Styles task complete'}));
});


/**
 * Script related Tasks
 * - Concatenate Javascript
 * - Uglify Javascript
 * - Minify Javascript and rename as .min
 * - Append in the dist/ folder
 **/
gulp.task('scripts', function () {
	return gulp.src(config.scripts)
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('app.js'))
		.pipe(gulp.dest(config.env.test + '/' + config.basenames.scripts))
		.pipe(rename({basename: config.basenames.scripts}))
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest(config.env.prod + '/' + config.basenames.scripts))
		.pipe(notify({message: 'Scripts task complete'}));
});


gulp.task('html', function () {
	return gulp.src(config.html)
		.pipe(minifyHTML())
		.pipe(gulp.dest(config.env.prod));
});

gulp.task('static', function () {
	return gulp.src([
		config.env.dev + '/*.{ico,txt}',
		config.env.dev + '/.htaccess'
	])
		.pipe(gulp.dest(config.env.prod));
});

/**
 * Image related Tasks
 * - Concatenate Javascript
 * - Uglify Javascript
 * - Minify Javascript and rename as .min
 * - Append in the dist/ folder
 **/
gulp.task('images', function () {
	return gulp.src(config.images)
		.pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
		.pipe(gulp.dest(config.env.prod + '/' + config.basenames.images))
		.pipe(notify({message: 'Images task complete'}));
});


/**************************************************************/
/*********************** HELPER TASKS *************************/
/**************************************************************/


gulp.task('watch', function () {

	// Watch .scss files
	gulp.watch(config.styles, ['styles']);

	// Watch .js files
	gulp.watch(config.scripts, ['scripts']);

	gulp.watch(config.html, ['html']);

	// Watch image files
	gulp.watch(config.images, ['images']);

	// Watch any files in dist/, reload on change
	gulp.watch([config.env.prod + '/**']).on('change', livereload.changed);

});


/**
 * Application Clean
 * Will ensure that all assets will be cleaned before any task is called
 */
gulp.task('clean', function (cb) {
	del([config.env.prod + '/**/*'], cb);
});


gulp.task('connect', function () {
	connect.server({
		root: 'app',
		host: config.host,
		port: config.port.app,
		livereload: {
			port: config.port.lvd
		}
	});
});


gulp.task('wiredep', function () {
	gulp.src(config.env.dev + '/index.html')
		.pipe(wiredep({
			exclude: [/jquery/]
		}))
		.pipe(gulp.dest(config.env.dev));
});


gulp.task('open', function () {
	var options = {
		url: 'http://' + config.host + ':' + config.port.app,
		app: 'google chrome'
	};

	gulp.src(config.env.dev + '/index.html')
		.pipe(open('', options));
});


/**************************************************************/
/*********************** RUNNER TASKS *************************/
/**************************************************************/


/**
 * Default Task
 * Clean will be called before executing any task regarding assets
 */
gulp.task('default', ['clean'], function () {
	gulp.start('wiredep', 'styles', 'scripts', 'images', 'static');
});

gulp.task('serve', ['connect', 'open', 'watch']);
