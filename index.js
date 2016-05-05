const utils = require('rsx-common');
const path = require('path');
const generator = require('yeoman-generator');
const chalk = utils.chalk;

module.exports = generator.Base.extend({
  constructor: function() {
    generator.Base.apply(this, arguments);
    this.argument('name', { type: String, required: true });

    this.option('package', {
      desc: 'Package name for the application (com.example.app)',
      type: String,
      defaults: 'com.' + this.name.toLowerCase()
    });
    // this.option('upgrade', {
    //   desc: 'Specify an upgrade',
    //   type: Boolean,
    //   defaults: false
    // });
  },

  initializing: function() {
    if (!utils.isValidPackageName(this.options.package)) {
      throw new Error('Package name ' + this.options.package + ' is not valid');
    }
  },

  writing: function() {
    var templateParams = {
      package: this.options.package,
      name: this.name
    };
    // if (!this.options.upgrade) {
      this.fs.copyTpl(
        this.templatePath(path.join('src', '**')),
        this.destinationPath('android'),
        templateParams
      );
      this.fs.copy(
        this.templatePath(path.join('bin', '**')),
        this.destinationPath('android')
      );
    // } else {
    //   this.fs.copyTpl(
    //     this.templatePath(path.join('src', '*')),
    //     this.destinationPath('android'),
    //     templateParams
    //   );
    //   this.fs.copyTpl(
    //     this.templatePath(path.join('src', 'app', '*')),
    //     this.destinationPath(path.join('android', 'app')),
    //     templateParams
    //   );
    // }

    var javaPath = path.join.apply(
      null,
      [process.cwd(), 'android', 'app', 'src', 'main', 'java'].concat(this.options.package.split('.'))
    );

    this.fs.copyTpl(
      this.templatePath(path.join('package', '**')),
      this.destinationPath(javaPath),
      templateParams
    );
  },

  end: function() {
    var projectPath = this.destinationRoot();
    this.log(chalk.white.bold('To run your app on Android:'));
    this.log(chalk.white('   Have an Android emulator running (quickest way to get started), or a device connected'));
    this.log(chalk.white('   cd ' + projectPath));
    this.log(chalk.white('   react-native run-android'));
  }
});
