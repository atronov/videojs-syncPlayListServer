/**
 * Created by vkusny on 16.08.15.
 */
var gulp = require("gulp"),
    path = require("path"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat");

var src = "client",
    dst = "public",
    dist = "dist",
    bundleFileName = "videojs-videoQueue.bundle.js",
    libFileName = "videojs-videoQueue.js",
    libFilePath = path.join(src, "js", libFileName),
    bowerDir = "bower_components",
    libPaths = [
        path.join(bowerDir, "bluebird/js/browser/bluebird.js"),
        path.join(bowerDir, "videojs-playList/dist/videojs-playlists.js"),
        path.join(bowerDir, "videojs-syncPlayList/dist/videojs-syncPlayList.js")
    ];

gulp.task("default", ["build"]);

gulp.task("build", ["html", "js", "lib"]);

gulp.task("html", function() {
    gulp.src(path.join(src,"*.html"))
        .pipe(gulp.dest(dst));
});

gulp.task("js", function() {
    var jsDstPath = path.join(dst,"js");
    gulp.src(path.join(src,"js/*.js"))
        .pipe(gulp.dest(jsDstPath));
});

gulp.task("lib", function() {
    gulp.src(libPaths)
        .pipe(rename({ dirname: "." }))
        .pipe(gulp.dest(path.join(dst, "lib")));
});

gulp.task("watch", function() {
    gulp.watch(path.join(src,"*.html"), ["html"]);
    gulp.watch(path.join(src,"**/*.js"), ["js"]);
    gulp.watch("bower_components/**/*", ["lib"]);
});

gulp.task("dist", ["dist-one", "dist-all", "dist-bundle"]);

gulp.task("dist-one", function() {
    gulp.src(libFilePath)
        .pipe(gulp.dest(dist));
});

gulp.task("dist-all", function() {
    gulp.src(libPaths.concat([libFilePath]))
        .pipe(gulp.dest(dist));
});

gulp.task("dist-bundle", function() {
    gulp.src(libPaths.concat([libFilePath])) 
        .pipe(concat(bundleFileName))
        .pipe(gulp.dest(dist));
});