var gulp = require('gulp');
var bless = require('gulp-bless');
var mqRemove = require("gulp-mq-remove");
var compass = require('gulp-compass');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var todo = require('gulp-todo');
var fs = require('fs');
var path = require('path');
var template = require('lodash.template');
var through = require('through2');
var directoryMap = require("gulp-directory-map");

gulp.task('cleantemp', function() {
    return gulp.src('.temp', {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

gulp.task('cleandist', function() {
    return gulp.src('.dist', {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('gulp-jshint-html-reporter', {
            filename: __dirname + '/styleguide/compiled-assets/jshint-output.html'
        }));
        
});

// Concatenate & Minify JS
gulp.task('headerjs', function() {
    return gulp.src(['js/header/libraries/*.js', 'js/header/custom/*.js'])
        .pipe(concat('header.dev.js'))
        .pipe(gulp.dest('.dist/js/header'))
        .pipe(rename('header.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.dist/js/header'));
});

// Concatenate & Minify JS
gulp.task('footerjs', function() {
    return gulp.src(['js/footer/libraries/*.js', 'js/footer/custom/*.js'])
        .pipe(concat('footer.dev.js'))
        .pipe(gulp.dest('.dist/js/footer'))
        .pipe(rename('footer.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.dist/js/footer'));
});

gulp.task('fonts', function() {
    return gulp.src('fonts/**/*')
        .pipe(gulp.dest('.dist/assets/fonts'));
});

gulp.task('images', function() {
    return gulp.src('images/**/*')
        .pipe(gulp.dest('.dist/assets/images'));
});

gulp.task('textures-json', function() {

    gulp.src(['images/backgrounds/textures/*.jpg', 'images/backgrounds/textures/*.png'])
        .pipe(directoryMap({
        filename: 'textures.json'
    }))
    .pipe(gulp.dest('styleguide/compiled-assets'));

});

gulp.task('patterns-json', function() {

    gulp.src(['images/backgrounds/patterns/**/*.jpg', 'images/backgrounds/patterns/**/*.png'])
        .pipe(directoryMap({
        filename: 'patterns.json'
    }))
    .pipe(gulp.dest('styleguide/compiled-assets'));

});


// output once in markdown and then output a json file as well 
gulp.task('todo-scss', function() {
    gulp.src('scss/**/*.scss')
        .pipe(todo({fileName: 'todo-scss.md' }))
        .pipe(gulp.dest('./styleguide/compiled-assets/')) //output todo.md as markdown 
});

gulp.task('todo-js', function() {
    gulp.src('js/**/*.js')
        .pipe(todo({fileName: 'todo-js.md' }))
        .pipe(gulp.dest('./styleguide/compiled-assets/')) //output todo.md as markdown 
});

gulp.task('todo-html', function() {
    gulp.src('styleguide/**/*.html')
        .pipe(todo({fileName: 'todo-html.md' }))
        .pipe(gulp.dest('./styleguide/compiled-assets/')) //output todo.md as markdown 
});

gulp.task('styles-prod', ['styles'], function() {
    gulp.src('./.dist/css/style.css')
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('.dist/css'));
        
    


    gulp.src('./.dist/css/style.min.css')
        .pipe(rename({
            suffix: '.blessed.ie89'
        }))
        .pipe(bless())
        .pipe(gulp.dest('.dist/css'));
        
    

    gulp.src('./.dist/css/style.min.css')
        .pipe(mqRemove({ width: "1280px" }))
        .pipe(rename({
            suffix: '.blessed.ie7'
        }))
        .pipe(bless())
        .pipe(gulp.dest('.dist/css'));
        
});

gulp.task('styles', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass({
            css: '.dist/css',
            sass: 'scss',
            fonts: 'fonts',
            debug: true,
            style: 'expanded',
            comments: true,
            sourceComments: true,
            sourcemap: false
        })).on('error', gutil.log)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('.dist/css'))
        //.pipe(gulp.dest('app/assets/temp'))
        
        .pipe(notify({
            message: 'Styles task complete'
        }));


});

gulp.task('browser-sync', function() {
    browserSync({
        proxy: "styleguide.unity.dev:8080",
        startPath: "styleguide/index.html"
    });
});



gulp.task('watch', function() {
    gulp.watch('js/header**/*.js', ['lint', 'headerjs']);
    gulp.watch('js/footer/**/*.js', ['lint', 'footerjs']);
    gulp.watch('fonts/**/*', ['fonts']);
    gulp.watch('images/**/*', ['images']);
    gulp.watch('scss/**/*.scss', ['styles']);
});


gulp.task('watch-simple', function() {
    gulp.watch('js/header**/*.js', ['headerjs']);
    gulp.watch('js/footer/**/*.js', ['footerjs']);
    gulp.watch('scss/**/*.scss', ['styles']);
});

gulp.task('default', ['lint', 'fonts', 'images', 'styles', 'todo-scss', 'todo-js', 'headerjs', 'footerjs', 'watch']);

gulp.task('simple', ['styles', 'headerjs', 'footerjs', 'watch-simple']);


gulp.task('release', ['fonts', 'images', 'styles', 'styles-prod', 'headerjs', 'footerjs']);

gulp.task('browsersync', ['browser-sync'], function() {

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    //gulp.watch("js/*.js", ['js', browserSync.reload]);
    gulp.watch('styleguide/**/*', browserSync.reload);
    gulp.watch('js/header/**/*.js', ['lint', 'headerjs', browserSync.reload]);
    gulp.watch('js/footer/**/*.js', ['lint', 'footerjs', browserSync.reload]);
    gulp.watch('fonts/**/*', ['fonts', browserSync.reload]);
    gulp.watch('images/**/*', ['images', browserSync.reload]);
    gulp.watch('scss/**/*.scss', ['styles', browserSync.reload]);
});