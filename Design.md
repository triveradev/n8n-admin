I need a NodeJS application that allows me to add users to a N8N instance.
I need to be able to deploy this application to a server and a Docker container.
A user must be able to provide their email and real name, after which the application will add the user to the N8N instance and show the invitation link.
The user must then be able to click on the invitation link to accept the invitation, and then be forwarded to the N8N instance.
The N8N URL and API key must be configurable in a .env file.

## API Reference

The N8N API documentation can be found here: https://docs.n8n.io/api/api-reference/