// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser'); 
// const app = express();
// // CORS configuration
// app.use(cors({
//     origin: ['http://localhost:3001', 'http://localhost:3000'], // Allow multiple origins
//     methods: ['GET', 'POST'] // Allowed HTTP methods
//   }));
// // Use body-parser (optional)
// app.use(bodyParser.json());
// // MongoDB connection
// mongoose.connect('mongodb+srv://masudrana15924:masud924@cluster0.df72s.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('Database connected'); // Log when MongoDB connects successfully
// })
// .catch((err) => {
//   console.error('Database connection error:', err);
// });
// // MongoDB Models
// const User = mongoose.model('User', {
//   name: String,
//   phone: { type: String, default: "" },
//   email: String,
//   password: String,
//   role: String, // 'doctor' or 'patient'
//   specialty: String, // for doctors
//   online: { type: Boolean, default: false }
// });
// const Call = mongoose.model('Call', {
//   roomId: String,
//   patientId: mongoose.Schema.Types.ObjectId,
//   doctorId: mongoose.Schema.Types.ObjectId,
//   status: String, // 'pending', 'accepted', 'rejected', 'completed'
//   startTime: Date,
//   endTime: Date
// });
// // Socket.io setup
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:3000', // Allow only localhost:3000
//     methods: ['GET', 'POST']
//   }
// });
// // Socket connection handling
// const connectedUsers = new Map();
// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);
//   // User login
//   socket.on('userLogin', async (userId) => {
//     try {
//       // Update user status in database
//       await User.findByIdAndUpdate(userId, { online: true });
      
//       // Map socket.id to userId
//       connectedUsers.set(socket.id, userId);
      
//       // Broadcast to all clients that this user is online
//       const user = await User.findById(userId);
//       if (user.role === 'doctor') {
//         io.emit('doctorStatusChanged', { doctorId: userId, online: true });
//       }
      
//       console.log(`User ${userId} logged in`);
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   });
  
//   // User logout/disconnect
//   const handleDisconnect = async () => {
//     try {
//       const userId = connectedUsers.get(socket.id);
//       if (userId) {
//         // Update user status in database
//         await User.findByIdAndUpdate(userId, { online: false });
        
//         // Remove from connected users map
//         connectedUsers.delete(socket.id);
        
//         // Broadcast doctor status change
//         const user = await User.findById(userId);
//         if (user && user.role === 'doctor') {
//           io.emit('doctorStatusChanged', { doctorId: userId, online: false });
//         }
        
//         console.log(`User ${userId} disconnected`);
//       }
//     } catch (error) {
//       console.error('Disconnect error:', error);
//     }
//   };
  
//   socket.on('disconnect', handleDisconnect);
//   socket.on('userLogout', handleDisconnect);
// });

// // API Routes
// app.post('/api/register', async (req, res) => {
//   try {
//     const { name, email, password, role, specialty } = req.body;
//     const user = new User({ name, email, password, role, specialty });
//     await user.save();
//     res.status(201).json({ success: true, userId: user._id });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email, password });
    
//     if (!user) {
//       return res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }
    
//     res.status(200).json({ 
//       success: true, 
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role,
//         specialty: user.specialty
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// app.get('/api/doctors', async (req, res) => {
//   try {
//     const doctors = await User.find({ role: 'doctor' });
//     res.status(200).json(doctors.map(doctor => ({
//       id: doctor._id,
//       name: doctor.name,
//       specialty: doctor.specialty,
//       online: doctor.online
//     })));
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
  origin: ['https://jitsi-opal.vercel.app','http://localhost:3001', 'http://localhost:3000'], // Allow multiple origins
  methods: ['GET', 'POST'] // Allowed HTTP methods
}));

// Use body-parser (optional)
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://masudrana15924:masud924@cluster0.df72s.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Database connected'); // Log when MongoDB connects successfully
})
.catch((err) => {
  console.error('Database connection error:', err);
});

// MongoDB Models
const User = mongoose.model('User', {
  name: String,
  phone: { type: String, default: "" },
  email: String,
  password: String,
  role: String, // 'doctor' or 'patient'
  specialty: String, // for doctors
  online: { type: Boolean, default: false }
});

const Call = mongoose.model('Call', {
  roomId: String,
  patientId: mongoose.Schema.Types.ObjectId,
  doctorId: mongoose.Schema.Types.ObjectId,
  status: String, // 'pending', 'accepted', 'rejected', 'completed'
  startTime: Date,
  endTime: Date
});

// Socket.io setup
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://jitsi-opal.vercel.app', // Allow only localhost:3000
    methods: ['GET', 'POST']
  }
});

// Socket connection handling
const connectedUsers = new Map(); // Maps socket.id to userId
const socketToUserMap = new Map(); // Maps userId to socket.id

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User login
  socket.on('userLogin', async (userId) => {
    try {
      // Update user status in database
      await User.findByIdAndUpdate(userId, { online: true });

      // Map socket.id to userId and vice versa
      connectedUsers.set(socket.id, userId);
      socketToUserMap.set(userId, socket.id);

      // Broadcast to all clients that this user is online
      const user = await User.findById(userId);
      if (user.role === 'doctor') {
        io.emit('doctorStatusChanged', { doctorId: userId, online: true });
      }

      console.log(`User ${userId} logged in`);
    } catch (error) {
      console.error('Login error:', error);
    }
  });

  // Handle call requests from patients
  socket.on('requestCall', async ({ patientId, doctorId }) => {
    try {
      const patient = await User.findById(patientId);
      const doctor = await User.findById(doctorId);

      if (!patient || !doctor) {
        console.error('Patient or doctor not found');
        return;
      }

      // Create a new call record
      const roomId = `room_${Date.now()}`;
      const call = new Call({
        roomId,
        patientId,
        doctorId,
        status: 'pending',
        startTime: new Date()
      });
      await call.save();

      // Notify the doctor about the incoming call
      const doctorSocketId = socketToUserMap.get(doctorId);
      if (doctorSocketId) {
        io.to(doctorSocketId).emit('incomingCall', {
          roomId,
          patientId,
          patientName: patient.name
        });
      }

      console.log(`Call requested from patient ${patientId} to doctor ${doctorId}`);
    } catch (error) {
      console.error('Call request error:', error);
    }
  });

  // Handle call responses from doctors
  socket.on('callResponse', async ({ roomId, patientId, doctorId, accepted }) => {
    try {
      const call = await Call.findOne({ roomId });
      if (!call) {
        console.error('Call not found');
        return;
      }

      // Update call status
      call.status = accepted ? 'accepted' : 'rejected';
      await call.save();

      // Notify the patient about the call response
      const patientSocketId = socketToUserMap.get(patientId);
      if (patientSocketId) {
        io.to(patientSocketId).emit('callResponse', {
          roomId,
          accepted,
          doctorId
        });
      }

      console.log(`Call ${roomId} ${accepted ? 'accepted' : 'rejected'} by doctor ${doctorId}`);
    } catch (error) {
      console.error('Call response error:', error);
    }
  });

  // User logout/disconnect
  const handleDisconnect = async () => {
    try {
      const userId = connectedUsers.get(socket.id);
      if (userId) {
        // Update user status in database
        await User.findByIdAndUpdate(userId, { online: false });

        // Remove from connected users map
        connectedUsers.delete(socket.id);
        socketToUserMap.delete(userId);

        // Broadcast doctor status change
        const user = await User.findById(userId);
        if (user && user.role === 'doctor') {
          io.emit('doctorStatusChanged', { doctorId: userId, online: false });
        }

        console.log(`User ${userId} disconnected`);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  socket.on('disconnect', handleDisconnect);
  socket.on('userLogout', handleDisconnect);
});

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role, specialty } = req.body;
    const user = new User({ name, email, password, role, specialty });
    await user.save();
    res.status(201).json({ success: true, userId: user._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        specialty: user.specialty
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.status(200).json(doctors.map(doctor => ({
      id: doctor._id,
      name: doctor.name,
      specialty: doctor.specialty,
      online: doctor.online
    })));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});