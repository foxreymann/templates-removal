var walk = require('walk');
const exec = require('child_process').exec;
var templates = [];
var removedCounter = 0;
var removedNames = '';

// Walker options
var walker  = walk.walk('src/templates', { followLinks: false });

walker.on('file', function(root, stat, next) {
  // Add this file to the list of templates
  templates.push(root + '/' + stat.name);
  next();
});

walker.on('end', function() {
  templatesCount = templates.length;
  templates.forEach(function(template, index) {
    grep(template);
  });
});

function grep(template) {
    var search = template.substring(38, template.indexOf('.html')) + '\'',
        dir = 'src/scripts/views',
        cmd = 'git grep "' + search + '"',
        options = {
          cwd: dir
        };

    const child = exec(cmd, options,
      (error, stdout, stderr) => {
        if(!stdout.length && error) {
            remove(template);
        }
    });
}

function remove(template) {
    var cmd = 'rm ' + template,
        templateName = template.substring(38, template.indexOf('.html'));

    const child = exec(cmd,
      (error, stdout, stderr) => {
        if(!error) {
          removedCounter++;
          removedNames = removedNames + templateName + '\n';
        }
        done();
    });
}

function done() {
  console.log('no of templates: ' + templatesCount);
  console.log('to remove ' + removedCounter);
  console.log(removedNames);
}
