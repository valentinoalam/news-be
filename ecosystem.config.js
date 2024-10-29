module.exports = {
    apps: [
      {
        name: 'nestjs-app',
        script: 'dist/main.js',
        instances: 1,
        exec_mode: 'fork',
        env: {
          NODE_ENV: 'production',
          PORT: 3000,
        },
        // Optional configurations (consider adding):
        error_file: 'logs/err.log', // Path to the error log file
        out_file: 'logs/out.log', // Path to the output log file
        merge_logs: true, // Merge logs into a single file (optional)
        max_restarts: 5, // Maximum number of restarts in case of errors
        watch: false, // Disable file watching in production (optional)
        time: false,
      },
    ],
  };
  