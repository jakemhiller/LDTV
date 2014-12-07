gulp     = require 'gulp'
gutil    = require 'gulp-util'
gulpif   = require 'gulp-if'

browserify = require 'browserify'
es6ify     = require 'es6ify'

concat     = require 'gulp-concat'
uglify     = require 'gulp-uglify'
sass       = require 'gulp-sass'
refresh    = require 'gulp-livereload'
imagemin   = require 'gulp-imagemin'
plumber    = require 'gulp-plumber'

source  = require 'vinyl-source-stream'
connect = require 'connect'
http    = require 'http'
path    = require 'path'
lr      = require 'tiny-lr'
server  = lr()
rmdir   = require 'rimraf'

process.env.NODE_PATH = "#{process.cwd()}/scripts:#{process.env.NODE_PATH}";

gulp.task 'webserver', ->
  port = 3000
  hostname = null
  base = path.resolve 'dist'
  directory = path.resolve 'dist'

  app = connect()
    .use connect.static base
    .use connect.directory directory

  http.createServer(app).listen port, hostname

# Starts the livereload server
gulp.task 'livereload', ->
  server.listen 35729, (err) ->
    console.log err if err?

gulp.task 'scripts', ->

  bundlestream = browserify({debug: !gutil.env.production})
    .on 'error', (err) ->
      console.log(err)
    .add(es6ify.runtime)
    .transform(require('es6ify').configure(/^(?!.*node_modules)+.+\.js$/))
    .require(require.resolve('./scripts/app.js'), { entry: true })
    .bundle()
    .pipe(source('app.js'));


  bundlestream
    .pipe plumber()
    .pipe gulpif gutil.env.production, uglify()
    .pipe(gulp.dest 'dist/assets/')


gulp.task 'bower', ->
  gulp.src 'bower_components/phaser/build/phaser.js'
    .pipe plumber()
    .pipe concat 'phaser.js'
    .pipe gulpif gutil.env.production, uglify()
    .pipe gulp.dest 'dist/assets/'
    .pipe refresh server

gulp.task 'styles', ->
  gulp.src 'styles/scss/init.scss'
    .pipe plumber()
    .pipe sass includePaths: ['styles/scss/includes']
    .pipe concat 'styles.css'
    .pipe gulp.dest 'dist/assets/'
    .pipe refresh server

gulp.task 'html', ->
  gulp.src '*.html'
    .pipe plumber()
    .pipe gulp.dest 'dist/'
    .pipe refresh server

gulp.task 'images', ->
  gulp.src 'resources/images/**'
    .pipe plumber()
    .pipe imagemin()
    .pipe gulp.dest 'dist/assets/images/'
    .pipe refresh server

gulp.task 'tilemaps', ->
  gulp.src 'resources/tilemaps/**'
    .pipe plumber()
    .pipe imagemin()
    .pipe gulp.dest 'dist/assets/tilemaps/'
    .pipe refresh server

gulp.task 'sounds', ->
  gulp.src 'resources/sounds/**'
    .pipe plumber()
    .pipe gulp.dest 'dist/assets/sounds/'
    .pipe refresh server

gulp.task 'watch', ->
  gulp.watch 'scripts/**/*', ['scripts']
  gulp.watch 'styles/scss/**/*', ['styles']
  gulp.watch 'resources/images/**/*', ['images']
  gulp.watch 'resources/tilemaps/**/*', ['tilemaps']
  gulp.watch 'resources/sounds/**/*', ['sounds']
  gulp.watch '*.html', ['html']

gulp.task 'clean', ->
  rmdir 'dist', () ->

gulp.task 'build', ['scripts', 'bower', 'styles', 'images', 'tilemaps', 'sounds', 'html']

gulp.task 'default', ['build', 'webserver', 'livereload', 'watch']
