var gulp = require("gulp");

var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var tsProjectTestesUnitarios = ts.createProject("testes/tsconfig.json");
var tsProjectTestesPontaAPonta = ts.createProject("testes-ponta-a-ponta/tsconfig.json");
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
    pages: ['src/*.html'],
    styles: ['src/*.css'],
    testesUnitarios: ['./saida/**/*.spec.js'],
    testesPontaAPonta: ['./saida/testes-ponta-a-ponta/**/*.spec.js'],
    tsFiles: ['./src/**/*.ts'],
    saidaTestes:"./saida",
    saida:"./saida",
    dist:"./dist",
};


function compilar(){
    return tsProject.src()
        .pipe(tsProject());        
}

gulp.task("tslint", () =>{
    var program = tslint.Linter.createProgram("./tsconfig.json");
    return gulp.src(paths.tsFiles)
    .pipe(gulpTslint(program))
    .pipe(gulpTslint.report())
});

gulp.task("compilar-testes-unitarios", ["clean-saida"], function () {
    return compilar()
        .js.pipe(gulp.dest(paths.saidaTestes+"/src/"))
        .pipe(tsProjectTestesUnitarios.src())
        .pipe(tsProjectTestesUnitarios())
        .js.pipe(gulp.dest(paths.saidaTestes));
});

gulp.task("compilar-testes-ponta-a-ponta", ["clean-saida"], function () {
    return tsProjectTestesPontaAPonta.src()
        .pipe(tsProjectTestesPontaAPonta())
        .js.pipe(gulp.dest(paths.saidaTestes));
});


gulp.task("testar-unitarios", ["compilar-testes-unitarios", "tslint"], (done) => {

    // create test set
    const testSet = TestSet.create();

    // add your tests
    testSet.addTestsFromFiles(paths.testesUnitarios);

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

gulp.task("testar-ponta-a-ponta", ["compilar-testes-ponta-a-ponta", "debug", "tslint"], (done) => {

    // create test set
    const testSet = TestSet.create();

    // add your tests
    testSet.addTestsFromFiles(paths.testesPontaAPonta);

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

gulp.task("testar", ["testar-unitarios", "testar-ponta-a-ponta"]);



gulp.task("construir", ['clean-saida'], function(){
    return compilar()
    .js.pipe(gulp.dest(paths.saida));
});




gulp.task('clean-saida', function () {
  return del([
    paths.saida+'/**/*'
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

gulp.task('copy-polyfill-saida', function () {
  return gulp.src("./node_modules/babel-polyfill/dist/polyfill.min.js")
        .pipe(gulp.dest(paths.saida));
});

gulp.task("copy-html-saida", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(paths.saida));
});

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(paths.dist));
});

gulp.task("copy-css-saida", function () {
    return gulp.src(paths.styles)
        .pipe(gulp.dest(paths.saida));
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
        .pipe(gulp.dest(paths.saida))
        .pipe(browserSync.stream({once: true}));
}

gulp.task("empacotar", ["copy-html", "copy-css", 'copy-polyfill', "clean-dist"], function(){
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

gulp.task('empacotar-debug', ["copy-html-saida", "copy-css-saida", 'copy-polyfill-saida', "clean-saida"], function () {
    return bundle();
});

gulp.task("debug", ["empacotar-debug"], function () {    
    browserSync.init({
        server: paths.saida
    });
});

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);

gulp.task("default", ["empacotar"]);