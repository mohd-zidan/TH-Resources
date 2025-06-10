FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and install dependencies
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm build

# Expose the port Next.js runs on (default is 3000)
EXPOSE 3000

# Start the Next.js production server
CMD ["pnpm", "start"]