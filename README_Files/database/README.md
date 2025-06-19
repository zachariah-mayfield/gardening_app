# How to configure the PostgresSQL Database: 

## Ensure PostgreSQL and pgAdmin are Running
### Check your docker-compose.yml file to confirm both services are defined and running. If you haven’t already, start them:

### Start with Docker Compose:
```bash
docker-compose up -d --build
```


## Access pgAdmin
- Open http://localhost:5050 in your browser.
- The default login is often:
- Email: admin@example.com
- Password: admin123
- (Check your docker-compose.yml for the actual credentials.)


## Add Your PostgreSQL Server in pgAdmin
- In pgAdmin, right-click “Servers” > “Create” > “Server…”
- General Tab:
- Name: "gardening_db" (or any name you like)
- Connection Tab:
- Host name/address: "db" (this is the Docker service name, not localhost)
- Port: 5432
- Username: postgres (default, unless changed)
- Password: password (default, unless changed)
- Save Password: checked
- Click “Save.”


## View Your Plants Table
- Expand your new server > Databases > postgres (or your DB name) > Schemas > public > Tables.
- You should see the plants table.
- Right-click plants > “View/Edit Data” > “All Rows” to see your plant data.

