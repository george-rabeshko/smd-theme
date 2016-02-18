var gulp = require('gulp'), // gulp JS
	browserSync = require('browser-sync').create(), // browsersync
    sass = require('gulp-sass'), // SCSS maintenance
	autoprefixer = require('gulp-autoprefixer'), // CSS autoprefixer
    csso = require('gulp-csso'), // CSS minify
	uncss = require('gulp-uncss'), // unCSS
    uglify = require('gulp-uglify'), // JS minify
	browserify = require('gulp-browserify'), // browserify
    imagemin = require('gulp-imagemin'), // images minify
	wiredep = require('wiredep').stream, // wiredep
	useref = require('gulp-useref'), // useref
    gulpif = require('gulp-if'), // look on changes in html
    concat = require('gulp-concat'), // patching files
	rename = require('gulp-rename'),
	notify = require('gulp-notify');
	
// default task
gulp.task('default', ['css', 'js', 'browser-sync-s']);

// process JS files
gulp.task('js', function () {
    gulp.src('./assets/js/*.js')
		.pipe(browserify({
		  insertGlobals : true,
		  debug : !gulp.env.production
		}))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('js-watch', ['js'], browserSync.reload);

// process SCSS files and return CSS
gulp.task('css', function() {
    return gulp.src('./assets/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});

// unCSS usage
gulp.task('uncss', function () {
    return gulp.src('./build/css/*.css')
        .pipe(uncss({
            html: './build/*.html'
        }))
        .pipe(gulp.dest('./build/css/*.css'));
});

// bower
gulp.task('bower', function () {
	gulp.src('./build/index.html')
		.pipe(wiredep({
		  directory: './assets/bower_components'
		}))
		.pipe(gulp.dest('./build'));
});


// public
gulp.task('public', function () {
    return gulp.src('./build/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulp.dest('public'));
});
	
// static server
gulp.task('browser-sync-s', function() {
    browserSync.init({
        server: './build'
    });

    gulp.watch('./assets/scss/*.scss', ['css']);
	gulp.watch('./assets/js/*.js', ['js-watch']);
    gulp.watch('./build/*.html').on('change', browserSync.reload);
    gulp.watch('bower.json', ['bower']);
});

// dynamic server
gulp.task('browser-sync-d', function() {
    browserSync.init({
        proxy: ''
    });
});