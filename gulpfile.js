/*==============================================================================
##  My Gulpfile // november 2014
##  Heavily borrowed/stolen from https://gist.github.com/samuelhorn, and
##  Leveluptuts tutorial http://www.youtube.com/channel/UCyU5wkjgQYGRB0hIHMwm2Sg
##  but modified to my liking.
==============================================================================*/

/*******************************************************************************
## Require Stuff
*******************************************************************************/

var gulp = require ('gulp'),                                //require gulp
    uglify = require ('gulp-uglify'),                       //require uglify
    sass = require ('gulp-sass'),                           //require sass
    plumber = require ('gulp-plumber'),                     //require plumber
    browserSync = require('browser-sync'),                  // inject code to all devices
    autoprefixer = require('gulp-autoprefixer'),            // sets missing browserprefixes
    concat = require('gulp-concat'),                        // concatinate js
    rename = require("gulp-rename"),                        // rename files
    jshint = require('gulp-jshint'),                        // check if js is ok
    minifycss = require('gulp-minify-css'),                 // minify the css files
    neat = require('node-neat').includePaths,               // make node-neat work
    stylish = require('jshint-stylish');                    // make errors look good in shell

/*******************************************************************************
## PATHS Source & Destination (RELATIVE TO ROOT FOLDER)
*******************************************************************************/

var path = {
    sass_src : 'sass/*.scss',                               // all sass files
    sass_dest : 'build/css',                                // where to put minified css
    js_lint_src : [                                         // all js that should be linted
        'build/js/*.js'
    ],
    js_uglify_src : [                                       // all js files that should not be concatinated
        'js/libs/*.js'
    ],
    js_concat_src : [                                       // all js files that should be concatinated
        'js/*.js'
    ],
    js_dest : 'build/js'                                   // where to put minified js
};

/*******************************************************************************
## JS TASKS
*******************************************************************************/

// lint my custom js
gulp.task('js-lint', function() {
    gulp.src(path.js_lint_src)                            // get the files
        .pipe(jshint())                                     // lint the files
        .pipe(jshint.reporter(stylish))                     // present the results in a beautiful way
});

//minify all js files that should not be concatinated
gulp.task('js-uglify', function() {
    gulp.src(path.js_uglify_src)                          // get the files
        .pipe(uglify())                                     // uglify the files
        .pipe(rename(function(dir,base,ext){                // give the files a min suffix
            var trunc = base.split('.')[0];
            return trunc + '.min' + ext;
        }))
        .pipe(gulp.dest(path.js_dest));                   // where to put the files
});

// minify & concatinate all other js
gulp.task('js-concat', function() {
    gulp.src(path.js_concat_src)                          // get the files
        .pipe(uglify())                                     // uglify the files
        .pipe(concat('main.min.js'))                        // concatinate to one file
        .pipe(gulp.dest(path.js_dest));                   // where to put the files
});

/*******************************************************************************
## SASS TASKS
*******************************************************************************/

gulp.task('sass', function(){
    gulp.src(path.sass_src)                                 // source
        .pipe(plumber())                                    // Use plumber
        .pipe(sass({                                        // task
            includePaths: ['styles'].concat(neat)           // Make node-neat work
            //style: 'compressed'                           // choose style //expanded, compressed
        }))
        .pipe(autoprefixer(                                 // complete css with correct vendor prefixes
            'last 2 version',
            '> 1%',
            'ie 8',
            'ie 9',
            'ios 6',
            'android 4'
        ))
        .pipe(minifycss())                                  // minify css
        .pipe(gulp.dest(path.sass_dest));                   //destination
});

/*******************************************************************************
## Live Reload
## Same as below. Just not as cool.
*******************************************************************************/

//Livereload goes here

/*******************************************************************************
## BROWSER SYNC
## Checks for changes in these files, triggers update of browser.
*******************************************************************************/

//http://localhost:3000/ is default.

gulp.task('browser-sync', function() {
    browserSync.init(['build/css/*.css', 'build/js/*.js', '*.html'], {
        server: {
            baseDir: './'
        }
    });
});

//set own settings... for Rails for example.

// gulp.task('browser-sync', function() {
//     browserSync.init(['css/*.css', 'js/*.js'], {        // files to inject
//         proxy: {
//             host: 'localhost',                          // development server
//             port: '2368'                                // development server port
//         }
//     });
// });

/*******************************************************************************
##  WATCH TASKS
##  Check files for changes and run task...
*******************************************************************************/

gulp.task('watch', function(){
    gulp.watch('js/**/*.js', ['js-lint', 'js-uglify', 'js-concat']);    //Watch Scripts
    gulp.watch('sass/**/*.scss', ['sass']);                             //Watch Styles
});

/*******************************************************************************
##  GULP TASKS
##  Go Gulp Go! // "gulp" or "gulp scripts" etc...
*******************************************************************************/

gulp.task('default', ['js-uglify', 'js-lint', 'js-concat', 'sass', 'watch', 'browser-sync']);
