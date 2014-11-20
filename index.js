var through = require('through2'),
    gutil = require('gulp-util'),
    fs = require('fs');

const PLUGIN_NAME = 'gulp-html-script',
      REG = {
        SCRIPT: /<script[^>]*>[^<]*[a-zA-Z]+[^<]*<\/script>/g,
        EXT: /\..*$/,
        FILE: /([^\/\\]*)$/,
        SCRIPT_START: /^<script[^>]*>[\n ]*/,
        SCRIPT_END: /[\n ]*<\/script>$/
      };

module.exports = function(options){
  options = options || {};

  options.folder = options.folder ? options.folder : 'js';
  options.logPath = options.logPath ?
                    options.logPath.replace(REG.FILE, '') :
                    '';

  var logContent = '';

  function htmlScript(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(
        PLUGIN_NAME,
        'Streams are not supported!'
      ));
      return;
    }

    if (!options.logPath) {
      options.logPath = file.cwd + '/';
    }

    var contents = file.contents.toString(),
        match = contents.match(REG.SCRIPT);

    if (match) {
      var logFile = options.logPath + 'htmlScript.log',
          logTime = (new Date()).toJSON().replace('T', ' ');

      if (!logContent && fs.existsSync(logFile)) {
        logContent = fs.readFileSync(logFile) + '====================\n';
      }

      if (options.write) {
        var num = 1;

        match.forEach(function(jsContent){
          var jsPath = file.path.replace(REG.EXT, '.js');

          jsPath = jsPath.replace(REG.FILE, options.folder + '/$1');

          if (match.length > 1 || fs.existsSync(jsPath)) {
            jsPath = jsPath.replace(REG.EXT, '_' + num + '.js');
            num++;
          }

          contents = contents.replace(
            jsContent,
            '<script src="' +
              options.folder + '/' + jsPath.match(REG.FILE)[0] +
            '"></script>'
          );

          jsContent = jsContent.replace(
            REG.SCRIPT_START,
            options.noScope ? '' : '(function() {\n'
          );
          jsContent = jsContent.replace(
            REG.SCRIPT_END,
            options.noScope ? '' : '\n})();'
          );

          this.push(
            new gutil.File({
              base: file.base,
              cwd: file.cwd,
              path: jsPath,
              contents: new Buffer(jsContent)
            })
          );

          logContent += logTime + ' ' + file.path +  ' -> ' +jsPath + '\n';
        }.bind(this));

        file.contents = new Buffer(contents);

      } else {
        logContent += logTime + ' ' + file.path + '\n';
        process.stdout.write(file.path + '\n');
      }

      this.push(
        new gutil.File({
          base: file.base,
          cwd: file.cwd,
          path: logFile,
          contents: new Buffer(logContent)
        })
      );
    }

    this.push(file);
    cb();
  }

  return through.obj(htmlScript);
};