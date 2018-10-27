var gulp = require("gulp");

var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var tsProjectUnitTests = ts.createProject("tests/tsconfig.json");
var tsProjectEndToEndTests = ts.createProject("end-to-end-tests/tsconfig.json");
var alsatian=  require("alsatian");
var TestSet = alsatian.TestSet;
var  TestRunner = alsatian.TestRunner;
var tapBark = require("tap-bark");
var TapBark = tapBark.TapBark;

var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var watchify = require("watchify");
var gutil = require("gulp-util");
var del = require('del');
var browserSync = require('browser-sync').create();
var gulpTslint = require("gulp-tslint");
var tslint = require("tslint");

var paths = {
    pages: ['src/**/*.html'],
    styles: ['src/**/*.css'],
    unitTests: ['./out/**/*.spec.js'],
    endToEndTests: ['./out/end-to-end-tests/**/*.spec.js'],
    tsFiles: ['./src/**/*.ts'],
    outTests:"./out",
    out:"./out",
    dist:"./dist",
};


function compile(){
    return tsProject.src()
        .pipe(tsProject());        
}

gulp.task("compile", () =>{    
    return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(paths.outTests+"/src/"));
});

gulp.task("tslint", () =>{
    var program = tslint.Linter.createProgram("./tsconfig.json");
    return gulp.src(paths.tsFiles)
    .pipe(gulpTslint(program))
    .pipe(gulpTslint.report())
});

gulp.task("compile-unit-tests", ["clean-out"], function () {
    return compile()
        .js.pipe(gulp.dest(paths.outTests+"/src/"))
        .pipe(tsProjectUnitTests.src())
        .pipe(tsProjectUnitTests())
        .js.pipe(gulp.dest(paths.outTests));
});

gulp.task("compile-end-to-end-tests", ["clean-out"], function () {
    return tsProjectEndToEndTests.src()
        .pipe(tsProjectEndToEndTests())
        .js.pipe(gulp.dest(paths.outTests));
});


gulp.task("unit-tests", ["compile-unit-tests", "tslint"], (done) => {

    // create test set
    const testSet = TestSet.create();

    // add your tests
    testSet.addTestsFromFiles(paths.unitTests);

    // create a test runner
    const testRunner = new TestRunner();

    // setup the output
    testRunner.outputStream
              // this will use alsatian's default output if you remove this
              // you'll get TAP or you can add your favourite TAP reporter in it's place
              .pipe(TapBark.create().getPipeable()) 
              // pipe to the console
              .pipe(process.stdout);

    // run the test set
    testRunner.run(testSet)
              // and tell gulp when we're done
              .then(() => done());
});

gulp.task("test-end-to-end", ["compile-end-to-end-tests", "debug", "tslint"], (done) => {

    // create test set
    const testSet = TestSet.create();

    // add your tests
    testSet.addTestsFromFiles(paths.endToEndTests);

    // create a test runner
    const testRunner = new TestRunner();

    // setup the output
    testRunner.outputStream
              // this will use alsatian's default output if you remove this
              // you'll get TAP or you can add your favourite TAP reporter in it's place
              .pipe(TapBark.create().getPipeable()) 
              // pipe to the console
              .pipe(process.stdout);

    // run the test set
    testRunner.run(testSet)
              // and tell gulp when we're done
              .then(() => done());
});

gulp.task("test", ["unit-tests", "test-end-to-end"]);



gulp.task("build", ['clean-out'], function(){
    return compile()
    .js.pipe(gulp.dest(paths.out));
});




gulp.task('clean-out', function () {
  return del([
    paths.out+'/**/*'
  ]);
});

gulp.task('clean-dist', function () {
  return del([
    paths.dist+'/**/*'
  ]);
});

gulp.task('copy-polyfill', function () {
  return gulp.src("./node_modules/babel-polyfill/dist/polyfill.min.js")
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copy-polyfill-out', function () {
  return gulp.src("./node_modules/babel-polyfill/dist/polyfill.min.js")
        .pipe(gulp.dest(paths.out));
});

gulp.task("copy-html-out", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(paths.out));
});

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(paths.dist));
});

gulp.task("copy-css-out", function () {
    return gulp.src(paths.styles)
        .pipe(gulp.dest(paths.out));
});

gulp.task("copy-css", function () {
    return gulp.src(paths.styles)
        .pipe(gulp.dest(paths.dist));
});

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}));


function bundle() {
    return watchedBrowserify
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            browserSync.notify("Browserify Error!");
            this.emit("end");
        })
        .pipe(source('main.js'))        
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())        
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.out))
        .pipe(browserSync.stream({once: true}));
}

gulp.task("pack", ["copy-html", "copy-css", 'copy-polyfill', "clean-dist"], function(){
    return browserify({
                basedir: '.',
                debug: false,
                entries: ['src/main.ts'],
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .transform('babelify', {
                presets: ['es2015'],
                extensions: ['.ts']
            })
            .bundle()
            .pipe(source('main.js'))        
            .pipe(buffer())
            // .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())        
            // .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.dist));    
});

gulp.task('pack-debug', ["copy-html-out", "copy-css-out", 'copy-polyfill-out', "clean-out"], function () {
    return bundle();
});

gulp.task("debug", ["pack-debug"], function () {    
    browserSync.init({
        server: paths.out
    });
});

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);

gulp.task("default", ["pack"]);