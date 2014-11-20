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
	  .pipe(htmlScript({
      write: true,
      noScope: false
    }))
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

## License

MIT © Yodairish 2014
