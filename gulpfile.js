var gulp            = require('gulp');
// var browserSync     = require('browser-sync');
var BrowserSync     = require('laravel-elixir-browsersync2');
var sass            = require('gulp-sass');
var elixir          = require('laravel-elixir');  
var connectPHP      = require('gulp-connect-php');
// var pug            = require('laravel-elixir-pug');
var del             = require('del');
var jshint          = require('gulp-jshint');
var imagemin        = require('gulp-imagemin');
//javacript
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var sourcemaps      = require('gulp-sourcemaps');

var fs              = require('fs');
var server          = require('gulp-livereload');

var dir_path_js     = "./resources/assets/js/";
var dir_dest_js     = "./public/assets/app/js/";
var dir_path_html   = "./resources/views/";
// var dir_path_jade   = "./resources/assets/templates/";
var dir_path_css    = "./resources/assets/sass/";
var dir_dest_css    = "./public/assets/app/css/";
var dir_path_images = "./resources/assets/images/";
var dir_dest_images = "./public/assets/app/images/";
/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir.extend('sass_compile', function() {
});

elixir.config.sourcemaps = false;
BrowserSync.init();   

elixir(function(mix) {
    connectPHP.server({
        base: './public'
    }); 
    
    gulp.watch(dir_path_css+"**/**/*.sass", ['sass']); 
    gulp.watch(dir_path_js+"**/**/*.js", ['angular']); 
    gulp.watch(dir_path_images+"**/**/*", ['images']); 

    mix.BrowserSync(
    {
        proxy: 'localhost:8000',
        logPrefix       : "Laravel Eixir Iniciando BrowserSync",
        logConnections  : false,
        reloadOnRestart : false,
        notify          : true
    });
});


gulp.task('images', function() {
    // gulp.watch(dir_path_css+"**/**/*.sass", ['sass']); 
    // gulp.watch(dir_path_js+"**/**/*.js", ['js']); 
    gulp.watch(dir_path_images+"**/**/*", ['images']); 
});

gulp.task('clean', function() { 
    return del(['public/app']);
});
  
gulp.task('sass',['clean'], function() { 
    return gulp.src(dir_path_css+"**/**/*.sass")
        .pipe(sass())
        .pipe(gulp.dest(dir_dest_css)) 
        // .pipe(notify({message:'css compilado correctamente', onLast: true}));
});    

gulp.task('js',['clean'], function() {   
    return gulp.src(dir_path_js+"**/**/*.js")
    .pipe(sourcemaps.init()) 
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    // .pipe(concat(dir_path_js+"**/**/*.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dir_dest_js)); 
});

gulp.task('images',['clean'], function() {
    return gulp.src(dir_path_images+"**/**/*") 
    .pipe(sourcemaps.init())
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({plugins: [{removeViewBox: true}]})
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dir_dest_images));
});


gulp.task('angular',['clean'], function() {  
    var modules = fs.readdirSync(dir_path_js);
    var indexToRemoveModule = modules.indexOf("util");
    (indexToRemoveModule > -1)?modules.splice(indexToRemoveModule, 1):"";   
    var countModules = modules.length;
    console.log("");
    console.log("|------------------------------------------------------------------|");
    console.log("| compilando archivos angular");
    console.log("|------------------------------------------------------------------|");
    for(var i = 0; i < countModules; i++){
        var item = fs.readdirSync(dir_path_js+modules[i]);
        var countItem = item.length;
        console.log("| modulo: "+modules[i]);
            //console.log("|------------------------------------------------------------------");

            for (var j = 0; j < countItem; j++) {

                console.log("| "+(j+1)+".- "+item[j]);
                gulp.src(dir_path_js+modules[i]+'/'+item[j]+'/*.js')
                .pipe(sourcemaps.init()) 
                .pipe(uglify({mangle: true,outSourceMap: true}))
                .pipe(concat(item[j]+'.js'))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(dir_dest_js+modules[i]));
            }
            console.log("|------------------------------------------------------------------|");
            console.log("");
    }
});



