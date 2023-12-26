import { Command } from 'commander'
//import { logger } from '../config/logger.js'

const program = new Command()

program
    .option('-d', 'Variable for debugging', false)
    .option('--mode <mode>', 'Working mode', 'development')
program.parse();

//logger.info("Runtime options: ", program.opts());

export default program
