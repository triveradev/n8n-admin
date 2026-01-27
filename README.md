# N8N User Manager

A Node.js web application that allows you to add users to your N8N instance through a simple web interface. Users provide their email address, and the application will create an N8N user account and display the invitation link.

## Features

- ✅ Simple web interface for adding N8N users
- ✅ Automatic user creation via N8N API
- ✅ Display and redirect to invitation acceptance link
- ✅ Docker support for easy deployment
- ✅ Environment-based configuration

## Prerequisites

- Node.js 18+ (for local installation)
- Docker and Docker Compose (for containerized deployment)
- Access to an N8N instance with API access
- N8N API key

## Getting Your N8N API Key

1. Log in to your N8N instance as an admin
2. Go to **Settings** → **API**
3. Generate or copy your API key
4. Keep this key secure - you'll need it for configuration

## Installation

### Option 1: Local Installation

1. **Clone or download the project**
   ```bash
   cd N8N_AddUser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` and add your N8N configuration:
   ```
   N8N_URL=http://your-n8n-instance.com
   N8N_API_KEY=your_api_key_here
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to: `http://localhost:3000`

### Option 2: Docker Deployment

1. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` and add your N8N configuration:
   ```
   N8N_URL=http://your-n8n-instance.com
   N8N_API_KEY=your_api_key_here
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   
   Open your browser and navigate to: `http://localhost:3000`

4. **View logs (optional)**
   ```bash
   docker-compose logs -f
   ```

5. **Stop the application**
   ```bash
   docker-compose down
   ```

### Option 3: Docker without Docker Compose

1. **Build the Docker image**
   ```bash
   docker build -t n8n-user-manager .
   ```

2. **Run the container**
   ```bash
   docker run -d -p 3000:3000 ^
     -e N8N_URL=http://your-n8n-instance.com ^
     -e N8N_API_KEY=your_api_key_here ^
     --name n8n-user-manager ^
     n8n-user-manager
   ```

3. **Access the application**
   
   Open your browser and navigate to: `http://localhost:3000`

## Usage

1. Open the application in your web browser
2. Fill in the user details:
   - **Email Address**: The user's email
3. Click **Add User to N8N**
4. Once successful, click **Accept Invitation** to be redirected to the N8N invitation page
5. The user will be forwarded to the N8N instance to complete their registration

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `N8N_URL` | Full URL of your N8N instance (e.g., `http://localhost:5678`) | Yes | - |
| `N8N_API_KEY` | Your N8N API key | Yes | - |
| `APP_ACCESS_CODE` | Shared access code required to create users (no database) | Yes | - |
| `PORT` | Port for the application to run on | No | 3000 |

## API Endpoints

### `POST /api/add-user`

Creates a new user in N8N.

**Request Body:**
```json
{
  "email": "user@example.com",
  "accessCode": "your_shared_access_code"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "User added successfully",
  "inviteUrl": "https://your-n8n-instance.com/...",
  "user": {
    "email": "user@example.com"
  }
}
```

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "n8nUrl": "http://your-n8n-instance.com"
}
```

## Deployment to Production Server

### Using PM2 (Process Manager)

1. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

2. **Start the application with PM2**
   ```bash
   pm2 start server.js --name n8n-user-manager
   ```

3. **Configure PM2 to start on system boot**
   ```bash
   pm2 startup
   pm2 save
   ```

### Using Systemd (Linux)

1. **Create a systemd service file**
   ```bash
   sudo nano /etc/systemd/system/n8n-user-manager.service
   ```

2. **Add the following configuration** (adjust paths as needed):
   ```ini
   [Unit]
   Description=N8N User Manager
   After=network.target

   [Service]
   Type=simple
   User=your-user
   WorkingDirectory=/path/to/N8N_AddUser
   ExecStart=/usr/bin/node server.js
   Restart=on-failure
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and start the service**
   ```bash
   sudo systemctl enable n8n-user-manager
   sudo systemctl start n8n-user-manager
   ```

## Troubleshooting

### Application won't start

- Verify that `.env` file exists and contains valid values
- Check that `N8N_URL` is accessible from your server
- Ensure `N8N_API_KEY` is valid and has proper permissions

### "Failed to add user" error

- Verify your N8N API key is correct
- Check that your N8N instance is running and accessible
- Ensure the N8N API is enabled in your N8N settings
- Check the server logs for detailed error messages

### Docker container issues

- Check container logs: `docker-compose logs -f`
- Verify environment variables are set correctly in `.env`
- Ensure port 3000 is not already in use

## Security Considerations

- **Never commit your `.env` file** to version control
- Keep your N8N API key secure
- Use HTTPS in production environments
- Consider implementing authentication for the web interface in production
- Restrict network access to trusted sources

## License

MIT

## Support

For issues related to:
- **N8N API**: Check the [N8N API documentation](https://docs.n8n.io/api/api-reference/)
- **This application**: Review the logs and troubleshooting section above
