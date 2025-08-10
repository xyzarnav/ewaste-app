# E-Waste Management System

A comprehensive web application for managing e-waste pickup requests from service partners (hospitals, colleges, etc.) with admin oversight for item management.

## 🌟 Features

### For Service Partners
- **Simple Batch Creation**: Create pickup requests with basic information
- **Auto-Generated Batch IDs**: Unique identifiers based on organization, location, and date
- **Clean Interface**: Intuitive form design with validation
- **Request Tracking**: View submitted batch requests

### For Administrators  
- **Batch Management**: View all submitted pickup requests
- **Item Cataloging**: Add detailed item information to batches
- **Advanced Filtering**: Search and filter batches by status, organization, etc.
- **Environmental Tracking**: CO2 estimates and environmental impact data
- **Priority Management**: Set item priorities and hazard levels

## 🏗️ System Architecture

### Workflow
1. **Partner Submission**: Service partners create batch requests with basic info
2. **Admin Processing**: Administrators review batches and add detailed item information
3. **Tracking**: Full lifecycle tracking from request to completion

### Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **UI Components**: shadcn/ui + Tailwind CSS
- **Authentication**: JWT-based auth system

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ewaste-app
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ewaste-db
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   ```

4. **Start Development Servers**
   ```bash
   # From root directory
   ./start-dev.sh
   ```

   Or manually:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

## 📱 Application Routes

### Partner Routes
- `/partner/dashboard` - Create new batch requests

### Admin Routes
- `/admin/dashboard` - View all batch requests
- `/admin/batch/:id/add-items` - Add items to specific batch

### Authentication Routes
- `/login` - User login
- `/register` - User registration
- `/client-dashboard` - Client dashboard
- `/admin-dashboard` - Admin authentication dashboard

## 🗃️ Database Schema

### Batch Collection
```javascript
{
  batchId: "GEA-123-CINC-12252024", // Auto-generated unique ID
  batchName: "GE Aviation IT Equipment",
  contactPerson: "John Smith",
  pickupLocation: "Cincinnati, OH - Building A",
  department: "IT Department", // Optional
  requestDate: Date,
  notes: "Special instructions...", // Optional
  status: "pending" | "in_progress" | "completed" | "cancelled",
  items: [ItemSchema], // Array of items (added by admin)
  createdBy: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Item Schema (Embedded in Batch)
```javascript
{
  itemName: "Dell Laptop",
  modelSerial: "DL-12345",
  quantity: 5,
  condition: "working" | "non_working" | "broken" | "damaged",
  stockType: "electronic" | "it" | "battery" | "medical" | "telecom" | "industrial",
  estimatedValue: Number,
  co2Estimate: Number,
  greenhouseGasInfo: String,
  hazardLevel: "none" | "low" | "medium" | "high",
  priority: "low" | "medium" | "high",
  recyclingNotes: String,
  description: String,
  addedBy: ObjectId, // Admin who added the item
  addedAt: Date
}
```

## 🔧 API Endpoints

### Batch Management
- `GET /api/batches` - Get all batches (filtered by user role)
- `GET /api/batches/:id` - Get specific batch
- `POST /api/batches` - Create new batch (partners only)
- `PUT /api/batches/:id/status` - Update batch status (admin only)
- `POST /api/batches/:id/items` - Add items to batch (admin only)
- `DELETE /api/batches/:id` - Delete batch (super admin only)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

## 🎨 UI Components

### Partner Dashboard
- Clean, modern form interface
- Auto-generated batch ID preview
- Form validation and error handling
- Success confirmation with batch details

### Admin Dashboard
- Statistical overview cards
- Advanced search and filtering
- Batch status management
- Quick action buttons

### Item Management Form
- Dynamic item addition/removal
- Comprehensive item fields
- Environmental impact tracking
- Bulk item processing

## 🔐 Authentication & Authorization

### User Roles
- **Partner**: Can create and view their own batch requests
- **Admin**: Can view all batches and add items
- **Super Admin**: Full system access including batch deletion

### Permissions
- Partners: `create_batches`, `view_own_batches`
- Admins: `manage_batches`, `manage_items`, `view_all_batches`
- Super Admins: All permissions

## 🌱 Environmental Features

### CO2 Tracking
- Item-level CO2 impact estimates
- Batch-level environmental summaries
- Greenhouse gas information tracking

### Hazard Management
- Item hazard level classification
- Special handling requirements
- Recycling notes and considerations

## 🔍 Batch ID Generation

Format: `{BatchInitials}-{Sequence}-{LocationAbbr}-{MMDDYYYY}`

Example: `GEA-123-CINC-12252024`
- `GEA`: GE Aviation (batch name initials)
- `123`: Sequential number
- `CINC`: Cincinnati (location abbreviation)
- `12252024`: December 25, 2024

## 📊 Features in Detail

### Partner Experience
1. **Simple Form**: Only essential fields required
2. **Instant Feedback**: Real-time validation and confirmation
3. **Batch Tracking**: Clear batch ID for reference
4. **Professional UI**: Clean, corporate-friendly design

### Admin Experience
1. **Dashboard Overview**: Statistics and quick insights
2. **Batch Processing**: Efficient workflow for adding items
3. **Advanced Search**: Filter by status, organization, date
4. **Detailed Forms**: Comprehensive item cataloging

## 🚀 Deployment

### Production Environment
1. **Backend**: Deploy to services like Heroku, DigitalOcean, or AWS
2. **Frontend**: Deploy to Netlify, Vercel, or serve statically
3. **Database**: Use MongoDB Atlas or self-hosted MongoDB
4. **Environment Variables**: Configure production settings

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ewaste-system.com or create an issue in the repository.

---

**Built with ❤️ for sustainable e-waste management**