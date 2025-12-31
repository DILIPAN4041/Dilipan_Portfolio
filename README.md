# 🚀 Dilipan's Professional Portfolio

A modern, full-stack portfolio website featuring an AI-powered admin panel, built with Angular 17+ and Node.js.

## ✨ Features

### Public Site
- 🎨 **Modern Design**: Beautiful, responsive UI with smooth animations
- 🌓 **Theme Toggle**: Light/Dark mode support with smooth transitions
- 📱 **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- ⚡ **Fast Performance**: Optimized loading and rendering
- 📊 **Dynamic Content**: All content managed through admin panel

### Admin Panel
- 🔐 **Secure Authentication**: JWT-based login system
- 📝 **Complete CRUD**: Manage all portfolio content
- 🤖 **AI Integration**: AI-powered content suggestions
- 📈 **Activity Logging**: Track all admin actions
- 👥 **User Management**: Add/remove admin users
- ⚙️ **Site Settings**: Control visibility and themes

### Technical Features
- 🔒 **Security**: JWT authentication, password hashing, input validation
- 📡 **REST API**: Comprehensive API for all operations
- 🗄️ **Database**: MongoDB Atlas integration
- 🎯 **Type Safety**: TypeScript throughout
- 🧪 **Code Quality**: ESLint, validation, error handling

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 17+
- **Styling**: Tailwind CSS & Angular Material
- **Language**: TypeScript
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Animations**: Angular Animations

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing

### AI Integration
- **Providers**: Hugging Face / OpenAI (configurable)
- **Fallback**: Mock responses when API not configured
- **Use Cases**: Content generation, suggestions, chatbot

## 📦 Project Structure

```
portfolio/
├── frontend/                    # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Core services, guards, interceptors
│   │   │   ├── shared/         # Shared components, pipes, utilities
│   │   │   ├── features/       # Feature modules
│   │   │   │   ├── public/     # Public pages
│   │   │   │   ├── auth/       # Authentication pages
│   │   │   │   └── admin/      # Admin panel
│   │   │   └── app.routes.ts   # Route configuration
│   │   ├── styles/             # Global styles
│   │   └── environments/       # Environment configurations
│   └── package.json
│
├── backend/                     # Node.js/Express API
│   ├── config/                 # Configuration files
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── services/               # Business logic services
│   ├── scripts/                # Utility scripts (seeding, etc.)
│   ├── server.js               # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dilipan_Portfolio
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   Create `.env` file in backend folder:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:4200
   
   # Optional AI API Keys
   HUGGINGFACE_API_KEY=your_key
   # OR
   OPENAI_API_KEY=your_key
   ```

4. **Seed Database**
   ```bash
   npm run seed
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

6. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   ```

7. **Configure Frontend Environment**
   Update `frontend/src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api'
   };
   ```

8. **Start Frontend**
   ```bash
   npm start
   ```
   Application runs on `http://localhost:4200`

## 🔑 Default Credentials

After seeding the database, use these credentials to login:

**Account 1:**
- Email: `dilipanb200@gmail.com`
- User ID: `Dilipan_B`
- Password: `Admin@1234`

**Account 2:**
- Email: `dheerandilipan@gmail.com`
- User ID: `Dilipan@8428`
- Password: `Admin@1234`

⚠️ **Important**: You will be required to change the password on first login.

## 📝 API Endpoints

### Public Endpoints
- `GET /api/profile` - Get profile information
- `GET /api/skills` - Get all visible skills
- `GET /api/projects` - Get all visible projects
- `GET /api/experience` - Get all visible experience
- `GET /api/blogs` - Get all published blogs
- `GET /api/funfacts` - Get all visible fun facts
- `GET /api/contact` - Get contact information
- `GET /api/settings` - Get site settings

### Authentication Endpoints
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user

### Admin Endpoints (Protected)
All CRUD operations for:
- `/api/profile` - Profile management
- `/api/skills` - Skills management
- `/api/projects` - Projects management
- `/api/experience` - Experience management
- `/api/blogs` - Blogs management
- `/api/funfacts` - Fun facts management
- `/api/contact` - Contact management
- `/api/users` - User management
- `/api/settings` - Site settings
- `/api/activity` - Activity logs
- `/api/ai` - AI content generation

## 🤖 AI Features

The admin panel includes AI-powered content suggestions:

- **Inline Suggestions**: Click "✨ Suggest with AI" buttons next to text fields
- **Chatbot**: Dedicated AI assistant panel for guidance
- **Content Types**: About, Skills, Projects, Blogs, Fun Facts, Experience

Configure AI provider by setting environment variables:
- `HUGGINGFACE_API_KEY` for Hugging Face
- `OPENAI_API_KEY` for OpenAI

If no API key is configured, the system uses mock responses.

## 🎨 Customization

### Theme Colors
Edit `frontend/src/styles/_theme-light.scss` and `_theme-dark.scss` to customize colors.

### Content
All content is managed through the admin panel:
1. Login to `/admin`
2. Navigate to desired section
3. Edit, add, or delete content
4. Changes appear immediately on public site

### Site Settings
Control section visibility and default theme from Admin Panel > Settings.

## 📱 Deployment

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables
6. Deploy

### Frontend (Netlify/Vercel)
1. Connect GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/dist/frontend`
4. Add environment variable: `API_URL=your_backend_url/api`
5. Deploy

## 🔧 Development Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 👨‍💻 Author

**Dilipan**
- Email: dilipanb200@gmail.com
- Location: Chennai, India

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- MongoDB for the flexible database
- All open-source contributors

---

Made with ❤️ by Dilipan
