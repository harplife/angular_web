/* 'use strict'; */

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
    return gulp.src([
            path.join(conf.paths.src, '/**/*.html'),
            path.join(conf.paths.tmp, '/serve/**/*.html'),
            path.join('!' + conf.paths.src, '/assets/**/*.html')
        ])
        .pipe($.htmlmin({
            removeEmptyAttributes: true,
            removeAttributeQuotes: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'salevis4-web',
            root: ''
        }))
        .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {
        read: false
    });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };

    var htmlFilter = $.filter('*.html', {
        restore: true
    });
    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.useref())
        .pipe(jsFilter)
        .pipe($.sourcemaps.init())
        .pipe($.ngAnnotate())
        .pipe($.uglify({
          mangle : false, // 알파벳 한 글자 압축 과정 설정
          preserveComments: $.uglifySaveLicense
        })).on('error', conf.errorHandler('Uglify'))
        .pipe($.rev())
        .pipe($.sourcemaps.write('maps'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        // .pipe($.sourcemaps.init())
        .pipe($.cssnano())
        .pipe($.rev())
        // .pipe($.sourcemaps.write('maps'))
        .pipe(cssFilter.restore)
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.htmlmin({
            removeEmptyAttributes: true,
            removeAttributeQuotes: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({
            title: path.join(conf.paths.dist, '/'),
            showFiles: true
        }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
    return gulp.src('./bower_components/**/*.{eot,otf,svg,ttf,woff,woff2}')
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    return gulp.src([
            path.join(conf.paths.src, '/scripts/index.module.js'),
            path.join(conf.paths.src, '/components/ui-component/layout/header/header-notification/header-notification.component.js'),
            path.join(conf.paths.src, '/**/*'),
            path.join('!' + conf.paths.src, '/scripts/**/*.{html,css,js}'),
            path.join('!' + conf.paths.src, '/components/**/*.{html,css,js}'),
            path.join('!' + conf.paths.src, '/styles/**/*.{html,css,js}'),
            path.join('!' + conf.paths.src, '/app/**/*.{html,css,js}'),
            path.join('!' + conf.paths.src, '/reserve/*.{html,css,js}'),
            path.join('!' + conf.paths.src, '/*.{html,css,js}')
        ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function () {
    return $.del([path.join(conf.paths.dist, '/**/*'), path.join(conf.paths.tmp, '/**/*')]);
});

gulp.task('build', ['html', 'fonts', 'other'], function () {
    gulp.src([path.join(conf.paths.dist, '/**')])
        .pipe($.war({
            welcome: 'index.html',
            dsiplayName: 'deploy WAR'
        }))
        .pipe($.zip('salevis4-web.web.war'))
        .pipe(gulp.dest('./'));
});
