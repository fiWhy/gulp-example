var gulp = require("gulp");
var postcss = require("gulp-postcss");
var watch = require("gulp-watch");
var sass = require("gulp-sass");
var cssnano = require("cssnano");
var connect = require("gulp-connect");
var bro = require("gulp-bro");
var precss = require("precss");
var rename = require("gulp-rename")
var copy = require("gulp-copy");
var autoprefixer = require("autoprefixer");
var stringify = require("stringify");
var config = require("./config")();

gulp.task("build:styles", function () {
    return gulp.src(config.appStyle)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([precss, autoprefixer, cssnano])
            .on("error", console.log)
        )
        .pipe(rename({
            extname: ".css"
        }))
        .pipe(gulp.dest(config.dist))
        .pipe(connect.reload());
})

gulp.task("build:js", function () {
    return gulp.src(config.app)
        .pipe(bro({
            transform: [
                ["stringify", {
                    appliesTo: {
                        includeExtensions: [".html"]
                    }
                }]
            ]
        })
            .on("error", function (err) { console.log(err); }))
        .pipe(gulp.dest(config.dist))
        .pipe(connect.reload());
})

gulp.task("copy:files", function () {
    return gulp.src(config.assets)
        .pipe(gulp.dest(config.dist + "/assets"))
})

gulp.task('build:html', function () {
    var target = gulp.src(config.index);

    return target.pipe(gulp.dest(config.dist))
        .pipe(connect.reload());
});

gulp.task("watch:styles", ["build:styles"], function () {
    gulp.watch(config.styles, ["build:styles"]);
})

gulp.task("watch:js", ["build:js"], function () {
    gulp.watch(config.scripts, ["build:js"]);
})

gulp.task("watch:files", ["copy:files"], function () {
    return watch(config.assets, ["copy:files"]);
})

gulp.task("watch:html", ["build:html"], function () {
    gulp.watch(config.index, ["build:html"]);
})

gulp.task("serve", ["watch:styles", "watch:js", "watch:html", "watch:files"], function () {
    connect.server({
        root: "dist",
        port: 8080,
        livereload: true
    })
})

gulp.task("default", ["serve"]);