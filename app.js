#!/usr/bin/env node

import { Command } from 'commander';
import { exec } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';

// Chalk colors
const chalkError = chalk.bold.red;

// Init commander
const program = new Command();

program
  .name('jarvis')
  .description('Jarvis is a command line tool to automate tasks created by Arvind Andrion')
  .version('1.0.0');

program
  .option('-sb, --switch-branch', 'Switch')
  // .option('-s, --small', 'small pizza size')
  // .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

const options = program.opts();

// if (options.debug) console.log(options);
// console.log('pizza details:');
// if (options.small) console.log('- small pizza size');
// if (options.pizzaType) console.log(`- ${options.pizzaType}`);

/**
 * Switch branch
 */
if (options.switchBranch) switchBranch();

function switchBranch() {
  exec('git branch', async (error, stdout, stderr) => {
    if (error) {
      console.error(chalkError(`Error:`));
      console.error(`${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }

    let arr = stdout.split('\n');
    const branches = [];
    let getBranchName = '';

    for (let i = 0; i < arr.length; i++) {
      let branch = arr[i];
      if (branch.length === 0) {
        continue;
      }

      branches.push(branch.trim());
    }

    let answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'branch',
        message: 'Select branch',
        choices: branches
      }
    ]);

    getBranchName = answer.branch;

    if (answer.branch.includes('*')) {
      getBranchName = answer.branch.replace('*', '').trim();
    }

    exec(`git checkout ${getBranchName}`, async (error, stdout, stderr) => {
      if (error) {
        console.error(chalkError(`Error:`));
        console.error(`${error.message}`);
        return;
      }
      if (stderr) {
        console.error(chalkError(`Stderr:`));
        console.error(`${stderr}`);
        return;
      }

      console.log(stdout);
    });
  });
}
