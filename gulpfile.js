var gulp = require('gulp'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	connect = require('gulp-connect'),
	usemin = require('gulp-usemin'),
	rename = require('gulp-rename'),
	open = require('gulp-open'),
	eslint = require('gulp-eslint'),
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
			fonts: 'fonts',
			styles: 'styles',
			scripts: 'scripts',
			images: 'images',
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
			fonts: env.dev + '/fonts/**/*',
			images: env.dev + '/images/**/*',
			html: env.dev + '/**/*.html',
			host: '0.0.0.0',
			port: {
				app: 9090,
				lvd: 35729
			}
		}
	})();

/**************************************************************/
/*********************** DEV RELATED TASKS ********************/
/**************************************************************/


/**
 * Style related Tasks
 * - Compile LESS files
 * - Autoprefix CSS
 * - Minify CSS and rename as .min
 * - Append in the dist/ folder
 **/
gulp.task('dev-styles', function () {
	return gulp.src(config.env.dev + '/app.less')
		.pipe(less())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(rename({basename: config.basenames.styles}))
		.pipe(gulp.dest(config.env.test + '/' + config.basenames.styles))
		.pipe(livereload())
		.pipe(notify({message: 'Styles task complete'}));
});


/**
 * Script related Tasks
 * - Concatenate Javascript
 * - Uglify Javascript
 * - Minify Javascript and rename as .min
 * - Append in the dist/ folder
 **/

gulp.task('dev-scripts', function () {
	return gulp.src(config.scripts)
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(livereload())
		.pipe(notify({message: 'Scripts task complete'}));
});


gulp.task('dev-gulpfile', function () {
	return gulp.src('gulpfile.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(livereload())
		.pipe(notify({message: 'Gulpfile task complete'}));
});

gulp.task('dev-html', function () {
	return gulp.src(config.env.dev + '/index.html')
		.pipe(livereload())
});

/**
 * Image related Tasks
 * - Concatenate Javascript
 * - Uglify Javascript
 * - Minify Javascript and rename as .min
 * - Append in the dist/ folder
 **/
gulp.task('dev-images', function () {
	return gulp.src(config.images)
		.pipe(livereload())
		.pipe(notify({message: 'Images task complete'}));
});


gulp.task('dev-bstp-fonts', function () {
	return gulp.src('bower_components/bootstrap/fonts/**.*')
		.pipe(gulp.dest(config.env.dev + '/' + config.basenames.fonts));
});

gulp.task('watch', function () {

	livereload.listen();

	// Watch .scss files
	gulp.watch(config.styles, ['dev-styles']);

	// Watch .js files
	gulp.watch(config.scripts, ['dev-scripts']);

	gulp.watch(config.html, ['dev-html']);

	// Watch image files
	gulp.watch(config.images, ['dev-images']);

	gulp.watch('gulpfile.js', ['dev-gulpfile']);
});

gulp.task('connect', function () {
	connect.server({
		root: 'app',
		host: config.host,
		port: config.port.app,
		livereload: {
			port: config.port.lvd
		},
		middleware: function(connect) {
			return [
				connect.static('.tmp'),
				connect().use(
					'/bower_components',
					connect.static('./bower_components')
				),
				connect.static('/bower_components/bootstrap/fonts')
			]
		}
	});
});

gulp.task('open', function () {
	var options = {
		url: 'http://' + config.host + ':' + config.port.app,
		app: 'google chrome'
	};

	gulp.src(config.env.dev + '/index.html')
		.pipe(open('', options));
});


/****************************************************************/
/*********************** BUILD RELATED TASKS ********************/
/****************************************************************/

gulp.task('build-images', function () {
	return gulp.src(config.images)
		.pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
		.pipe(gulp.dest(config.env.prod + '/' + config.basenames.images));
});

gulp.task('build-fonts', function () {
	return gulp.src(config.fonts)
		.pipe(gulp.dest(config.env.prod + '/' + config.basenames.fonts));
});

gulp.task('build-html', function () {
	return gulp.src(config.html)
		.pipe(minifyHTML())
		.pipe(gulp.dest(config.env.prod));
});

gulp.task('build-static', function () {
	return gulp.src([
		config.env.dev + '/*.{ico,txt}',
		config.env.dev + '/.htaccess',
		config.env.dev + '/404.html'
	]).pipe(gulp.dest(config.env.prod));
});

gulp.task('connect-dist', function () {
	connect.server({
		root: 'dist',
		host: config.host,
		port: config.port.app
	});
});

gulp.task('open-dist', function () {
	var options = {
		url: 'http://' + config.host + ':' + config.port.app,
		app: 'google chrome'
	};

	gulp.src(config.env.prod + '/index.html')
		.pipe(open('', options));
});

gulp.task('usemin', function () {
	return gulp.src(config.env.dev + '/index.html')
		.pipe(usemin({
			html: [minifyHTML()],
			js: [uglify(), rev()],
			vendorjs: [uglify(), rev()],
			css: [minifycss(), rev()]
		}))
		.pipe(gulp.dest(config.env.prod))
		.pipe(notify({message: 'Build Task Successful'}));
});


/**************************************************************/
/*********************** HELPER TASKS *************************/
/**************************************************************/

gulp.task('wiredep', function () {
	gulp.src(config.env.dev + '/index.html')
		.pipe(wiredep({
			ignorePath: /\.\.\//,
			exclude: [
				/jquery/,
				'bower_components/bootstrap/dist/js/bootstrap.js',
				'bower_components/bootstrap/dist/css/bootstrap.css'
			]
		}))
		.pipe(gulp.dest(config.env.dev));
});

/**
 * Application Clean
 * Will ensure that all assets will be cleaned before any task is called
 */
gulp.task('clean', function (cb) {
	del([
		config.env.prod,
		config.env.test
	], cb);
});



/**************************************************************/
/*********************** RUNNER TASKS *************************/
/**************************************************************/


/**
 * Default Task
 * Clean will be called before executing any task regarding assets
 */
gulp.task('default', ['clean'], function () {
	gulp.start('wiredep', 'dev-styles', 'dev-bstp-fonts', 'dev-scripts', 'dev-images');
});

gulp.task('serve', ['default'], function () {
	gulp.start('connect', 'open', 'watch');
});

gulp.task('build', ['clean', 'dev-styles', 'dev-bstp-fonts'], function () {
	gulp.start(
		'build-html',
		'wiredep',
		'build-images',
		'build-fonts',
		'build-static',
		'usemin');
});

gulp.task('serve-dist', ['build'], function () {
	gulp.start('connect-dist', 'open-dist');
});

