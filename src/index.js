let getopt = require("node-getopt");
let safeRun = require("./safe-run");
let globalConfig = require("./config");

let options = getopt.create([
  ["n", "from_stdin", "Take the code from stdin."],
  ["v", "version", "Display the version."],
  ["h", "help", "Display this help."],
  ["l", "language=LANGUAGE", "The language code. Default: es"],
  ["t", "timeout=MILLISECONDS", "The timeout used to detect infinite loops. Default: 3000."]
]);

options.setHelp(
  "Examples of usage:\n" +
  "mulang-scratch targets.json\n" +
  "\n" + "[[OPTIONS]]"
);

config = options.parseSystem();

globalConfig.setConfig(config);

let actions = require("./actions");

function callAction() {
  for (option in actions) {
    if (config.options[option] !== undefined) {
      actions[option](config, options);
      return;
    }
  }

  (((config.argv.length === 0 && !config.options.from_stdin) || config.argv.length > 1)
    ? actions.help
    : actions.mulang_ast
  )(config, options);
}

safeRun(callAction, function(error) {
  console.log(JSON.stringify(error, null, 2));
  process.exit(1);
});
