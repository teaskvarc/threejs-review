/**
 * Created by Tea on 9.4.2016.
 */
//serviramo basic task, ki nam po serviral projekt

var gulp = require('gulp');
var serve = require('gulp-serve');

//definiramo novi task
//kot drugi parameter damo komponento in povemo kateri folder zelimo servirati
// ('./')to pomeni folder v katerem se nahaja gulpfile.js

gulp.task('serve', serve('./'));

