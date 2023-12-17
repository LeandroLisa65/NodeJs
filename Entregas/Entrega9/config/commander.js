import { Command } from 'commander';

const program = new Command()

program
    .option('-d', 'Variable for debugging', false)
    .option('--mode <mode>', 'Working mode', 'development')
program.parse();

export default program;
