const parseArgs = () => {
	const args = process.argv.slice(2);
  
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    console.log(`${key} is ${value}`);
  });
};

parseArgs();