const { readFileSync, writeFileSync, watch, readFile } = require("fs");
const path = require("path");
const chalk = require("chalk");

function parseCssVariables(cssString) {
    const regex = /--(\w+)\s*:\s*([^;]+);/g;
    const variables = {};
    let match;
    while ((match = regex.exec(cssString)) !== null) {
        const [, key, value] = match;
        variables[key] = value.trim();
    }
    return variables;
}

function convertObjectToCssVariables(obj) {
    let cssString = ".colors {\n";
    for (const [key, value] of Object.entries(obj)) {
        cssString += `  --${key}: ${value};\n`;
    }
    cssString += "}";
    return cssString;
}

function handleFileContent(content, output) {
    console.log(chalk.cyan("\nProcessing file content..."));
    console.log(chalk.yellow(content));
    console.log(chalk.cyan("\nParsing CSS variables from the file..."));
    const parsedVariables = parseCssVariables(content);
    console.log(chalk.green("Variables parsed successfully!"));
    const dataToWrite = JSON.stringify(parsedVariables, null, 2);
    console.log(chalk.cyan("Writing data to file:"), chalk.magenta(output));
    writeFileSync(output, dataToWrite);
    console.log(chalk.green("Successfully wrote data to file!\n"));
}

function saveData(input, output) {
    console.log(chalk.blue("Starting file processing..."));
    console.log(chalk.blue("Input file:"), chalk.magenta(input));
    console.log(chalk.blue("Output file:"), chalk.magenta(output));

    let fileData = readFileSync(input, "utf8");
    handleFileContent(fileData, output);

    watch(input, (eventType, filename) => {
        if (filename && eventType === 'change') {
            console.log(chalk.yellow(`\nFile changed: ${filename}`));

            readFile(input, 'utf8', (err, data) => {
                if (err) {
                    console.error(chalk.red(`Error reading file: ${err.message}`));
                } else {
                    handleFileContent(data, output);
                }
            });
        }
    });
}

const args = process.argv.slice(2);

if (!args[0]) {
    console.error(chalk.red("\nError: No input file specified!\n"));
    process.exit(1);
} else if (!args[1]) {
    args[1] = path.basename(args[0], ".css") + ".json";
}

saveData(args[0], args[1]);