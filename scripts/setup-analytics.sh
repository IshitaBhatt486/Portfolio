#!/bin/bash

# D1 Database Setup Script
# Creates the analytics database and initializes tables

echo "🔧 Setting up Cloudflare D1 Analytics Database..."

# Create the database
echo "📦 Creating analytics database..."
wrangler d1 create analytics

# Note: After running this, update wrangler.toml with the database_id

echo ""
echo "✅ Database created!"
echo ""
echo "Next steps:"
echo "1. Copy the database ID from above"
echo "2. Update wrangler.toml with the database_id in the [[d1_databases]] section"
echo "3. Deploy the Worker: wrangler deploy"
echo ""
