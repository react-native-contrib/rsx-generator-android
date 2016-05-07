const utils = require('rsx-common');
const path = require('path');
const generator = require('yeoman-generator');
const chalk = utils.chalk;

const install = {
    templates: [{
        src: ['src', '**'],
        dest: ['android'],
    }],
    files: [{
        src: ['bin', '**'],
        dest: ['android'],
    }],
};

const upgrade = {
    templates: [{
        src: ['src', '*'],
        dest: ['android'],
    }, {
        src: ['src', 'app', '*'],
        dest: ['android', 'app'],
    }],
    files: [],
};

module.exports = generator.Base.extend({
    constructor: function() {
        generator.Base.apply(this, arguments);
        this.argument('name', { type: String, required: true });

        this.option('package', {
            desc: 'Package name for the application (com.example.app)',
            type: String,
            defaults: 'com.' + this.name.toLowerCase(),
        });
        this.option('upgrade', {
          desc: 'Upgrade the application',
          type: Boolean,
          defaults: false,
        });
    },

    initializing: function() {
        if (!utils.validate.isPackageName(this.options.package)) {
            throw new Error('Package name ' + this.options.package + ' is not valid');
        }
    },

    writing: function() {
        const templateParams = {
            package: this.options.package,
            name: this.name,
        };

        const copyTemplate = (template) => {
            this.fs.copyTpl(
                this.templatePath(path.join(...template.src)),
                this.destinationPath(path.join(...template.dest)),
                templateParams
            );
        };

        const copyFile = (file) => {
            this.fs.copy(
                this.templatePath(path.join(...file.src)),
                this.destinationPath(path.join(...file.dest)),
                templateParams
            );
        };

        if (!this.options.upgrade) {
            // If installing
            Object.keys(install).forEach((resource) => {
                install.templates.forEach(copyTemplate);
                install.files.forEach(copyFile);
            });
        } else {
            // If upgrading
            Object.keys(upgrade).forEach((resource) => {
                upgrade.templates.forEach(copyTemplate);
                upgrade.files.forEach(copyFile);
            });
        }

        const javaPath = path.join(...[this.destinationRoot(), 'android', 'app', 'src', 'main', 'java'].concat(this.options.package.split('.'))
        );

        this.fs.copyTpl(
            this.templatePath(path.join('package', '**')),
            this.destinationPath(javaPath),
            templateParams
        );
    },

    end: function() {
        this.log(chalk.white.bold('To run your app on Android:'));
        this.log(chalk.white('   Have an Android emulator running (quickest way to get started), or a device connected'));
        this.log(chalk.white('   cd ' + this.destinationRoot()));
        this.log(chalk.white('   rsx run android'));
    },
});
