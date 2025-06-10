FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and install dependencies
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application (adjust based on your project, e.g., for a frontend like React/Vue)
# Uncomment the next line if your project requires a build step
# RUN pnpm build

# Expose the port your app runs on (adjust if needed, e.g., 3000 for many Node.js apps)
EXPOSE 3000

# Start the application (adjust based on your package.json start script)
CMD ["pnpm", "start"]