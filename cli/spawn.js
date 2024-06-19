const { spawn } = require('child_process');

spawn(`
export LIGHT_CYAN='\\033[1;36m'
export RED='\\033[31m'
export NC='\\033[0m'

ls
cd ..
echo "Hello"
echo >&2 "\\033[1;36mHello From Log\\033[0m"
`,
    {
        shell: true,
        stdio: ['ignore', 'inherit', 'inherit']
    });