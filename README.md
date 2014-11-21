# gulp-html-script

Allocates scripts from html into separate files

## Usage

```html
<!-- about.html -->
<body>
<div>text text</div>
<script>
  var one = 222;
  one++;
</script>
<div>text text</div>
</body>
```

```js
// gulpfile.js
var gulp = require('gulp');
var htmlScript = require('gulp-html-script');

gulp.task('html', function () {
	return gulp.src('path/to/project')
	  .pipe(htmlScript())
    .pipe(gulp.dest('path/to/project'));
});
```

**Output:**

```html
<!-- about.html -->
<body>
<div>text text</div>
<script src="js/about.js"></script>
<div>text text</div>
</body>
```

```js
// about.js
(function() {
  var one = 222;
  one++;
})();
```

## Options

  - **write**: Rewrite files and create js files, if `false` just write log; default `true`.
  - **noScope**: If `true` don't create closure for script; default `false`.
  - **folder**: Path to the folder where the js files will be created relative to html file; default: `js`.
  - **inline**: Also check the inline js handled on events. Files with only inline scripts just written to the log; default `false`.
  - **logPath**: Path to log file.

## TODO

  - update script detection

## License

MIT © Yodairish 2014
