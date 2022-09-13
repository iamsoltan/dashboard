#!bin/sh

# Rebuilding the project with the final env variables
echo "Rebuilding the server!!"
time pnpm run build

# Start the server
echo "Staring the server!!"
pnpm start
