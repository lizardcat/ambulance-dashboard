import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Ambulance, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Send, 
  Filter,
  Navigation,
  Heart,
  Hospital,
  Truck,
  MessageCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Radio
} from 'lucide-react';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different marker types
const createCustomIcon = (color, icon) => L.divIcon({
  html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><div style="color: white; font-size: 12px;">${icon}</div></div>`,
  className: 'custom-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const AmbulanceDispatchDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Dispatch', message: 'Unit 101, proceed to Kenyatta Avenue emergency', time: '14:23', type: 'dispatch' },
    { id: 2, sender: 'Unit 101', message: 'Copy, en route via Tom Mboya Street', time: '14:24', type: 'ambulance' },
    { id: 3, sender: 'KNH ER', message: 'Trauma bay 2 prepared for incoming patient', time: '14:25', type: 'hospital' },
    { id: 4, sender: 'Unit 102', message: 'Traffic jam on Jogoo Road, requesting alternative route', time: '14:26', type: 'ambulance' },
    { id: 5, sender: 'Dispatch', message: 'Unit 102, take Outer Ring Road to bypass traffic', time: '14:27', type: 'dispatch' }
  ]);

  // Mock data for ambulances
  const [ambulances] = useState([
    {
      id: 'AMB-101',
      driver: 'Grace Wanjiku',
      status: 'Available',
      location: { lat: -1.2921, lng: 36.8219 }, // Nairobi CBD
      type: 'Advanced Life Support',
      eta: null,
      lastUpdate: '2 min ago'
    },
    {
      id: 'AMB-102', 
      driver: 'James Ochieng',
      status: 'Dispatched',
      location: { lat: -1.3031, lng: 36.7073 }, // Kawangware
      type: 'Basic Life Support',
      eta: '8 min',
      lastUpdate: '30 sec ago'
    },
    {
      id: 'AMB-103',
      driver: 'Mary Njeri', 
      status: 'Transporting',
      location: { lat: -1.2634, lng: 36.8081 }, // Westlands
      type: 'Advanced Life Support',
      eta: '12 min',
      lastUpdate: '1 min ago'
    },
    {
      id: 'AMB-104',
      driver: 'Samuel Kipchoge',
      status: 'At Hospital',
      location: { lat: -1.2744, lng: 36.8022 }, // Kilimani
      type: 'Basic Life Support', 
      eta: '5 min',
      lastUpdate: '45 sec ago'
    },
    {
      id: 'AMB-105',
      driver: 'Faith Akinyi',
      status: 'Available',
      location: { lat: -1.3244, lng: 36.8862 }, // Embakasi
      type: 'Critical Care',
      eta: null,
      lastUpdate: '1 min ago'
    }
  ]);

  // Mock emergency requests
  const [emergencies] = useState([
    {
      id: 'E-2024-001',
      priority: 'Critical',
      location: 'Kenyatta Avenue, CBD',
      coordinates: { lat: -1.2845, lng: 36.8238 },
      timeReceived: '14:23',
      timeSince: '8 min ago',
      description: 'Chest pain, 65-year-old male',
      assignedAmbulance: 'AMB-102',
      patientInfo: {
        name: 'Peter Mwangi',
        age: 65,
        symptoms: 'Severe chest pain, shortness of breath',
        medicalHistory: 'Hypertension, previous MI',
        vitals: 'BP: 180/95, HR: 110, O2: 92%'
      }
    },
    {
      id: 'E-2024-002', 
      priority: 'High',
      location: 'Ngong Road, Karen',
      coordinates: { lat: -1.3197, lng: 36.7075 },
      timeReceived: '14:31',
      timeSince: '2 min ago',
      description: 'Fall injury, elderly woman',
      assignedAmbulance: null,
      patientInfo: {
        name: 'Rose Wanjiru',
        age: 78,
        symptoms: 'Hip pain after fall, unable to walk',
        medicalHistory: 'Osteoporosis, diabetes',
        vitals: 'BP: 140/85, HR: 88, Alert'
      }
    },
    {
      id: 'E-2024-003',
      priority: 'Medium', 
      location: 'Thika Super Highway, Kasarani',
      coordinates: { lat: -1.2167, lng: 36.8906 },
      timeReceived: '14:18',
      timeSince: '15 min ago',
      description: 'Motor vehicle accident',
      assignedAmbulance: 'AMB-103',
      patientInfo: {
        name: 'David Kiprotich',
        age: 34,
        symptoms: 'Back pain, possible spinal injury',
        medicalHistory: 'No known allergies',
        vitals: 'BP: 120/80, HR: 85, Conscious'
      }
    },
    {
      id: 'E-2024-004',
      priority: 'High',
      location: 'Jogoo Road, Eastlands',
      coordinates: { lat: -1.2921, lng: 36.8663 },
      timeReceived: '14:35',
      timeSince: '1 min ago',
      description: 'Difficulty breathing, child',
      assignedAmbulance: null,
      patientInfo: {
        name: 'Amina Hassan',
        age: 7,
        symptoms: 'Severe asthma attack, wheezing',
        medicalHistory: 'Asthma, no other conditions',
        vitals: 'O2: 89%, HR: 120, Distressed'
      }
    }
  ]);

  // Mock hospital data
  const [hospitals] = useState([
    {
      id: 'H-001',
      name: 'Kenyatta National Hospital',
      location: { lat: -1.3013, lng: 36.8073 },
      erStatus: 'Available',
      capacity: 25,
      currentPatients: 15,
      eta: '8 min',
      specialties: ['Trauma', 'Cardiac', 'Stroke', 'Neurosurgery']
    },
    {
      id: 'H-002',
      name: 'Nairobi Hospital', 
      location: { lat: -1.2883, lng: 36.8120 },
      erStatus: 'Busy',
      capacity: 20,
      currentPatients: 18,
      eta: '12 min',
      specialties: ['General', 'Cardiac', 'Orthopedic']
    },
    {
      id: 'H-003',
      name: 'Aga Khan University Hospital',
      location: { lat: -1.2635, lng: 36.8078 },
      erStatus: 'Available', 
      capacity: 18,
      currentPatients: 10,
      eta: '15 min',
      specialties: ['Trauma', 'Emergency', 'Pediatric']
    },
    {
      id: 'H-004',
      name: 'Mater Misericordiae Hospital',
      location: { lat: -1.2938, lng: 36.8169 },
      erStatus: 'Critical',
      capacity: 15,
      currentPatients: 15,
      eta: '6 min',
      specialties: ['Maternity', 'General', 'Emergency']
    },
    {
      id: 'H-005',
      name: 'Karen Hospital',
      location: { lat: -1.3239, lng: 36.7073 },
      erStatus: 'Available',
      capacity: 12,
      currentPatients: 7,
      eta: '20 min',
      specialties: ['General', 'Pediatric', 'Orthopedic']
    }
  ]);

  // Performance metrics data
  const [performanceData] = useState([
    { time: '14:00', responseTime: 6.2, activeCalls: 8, utilization: 75 },
    { time: '14:15', responseTime: 7.1, activeCalls: 12, utilization: 82 },
    { time: '14:30', responseTime: 5.8, activeCalls: 15, utilization: 90 },
    { time: '14:45', responseTime: 6.5, activeCalls: 11, utilization: 78 }
  ]);

  // System alerts
  const [alerts] = useState([
    { id: 1, type: 'critical', message: 'No available ambulances in Eastlands area', time: '14:30' },
    { id: 2, type: 'warning', message: 'Heavy traffic on Thika Super Highway affecting ETA', time: '14:28' },
    { id: 3, type: 'warning', message: 'Road closure on Uhuru Highway due to VIP movement', time: '14:25' },
    { id: 4, type: 'info', message: 'Unit AMB-105 completing maintenance at KNH', time: '14:15' },
    { id: 5, type: 'critical', message: 'Fuel shortage reported at Westlands depot', time: '14:10' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-500';
      case 'Dispatched': return 'bg-yellow-500'; 
      case 'Transporting': return 'bg-blue-500';
      case 'At Hospital': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'border-l-red-500 bg-red-50';
      case 'High': return 'border-l-orange-500 bg-orange-50';
      case 'Medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getHospitalStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'text-green-600';
      case 'Busy': return 'text-yellow-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'Dispatch',
        message: chatMessage,
        time: currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: 'dispatch'
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg mb-6 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Ambulance className="h-8 w-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-800">Emergency Dispatch Center</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="font-semibold">Active Units:</span> {ambulances.filter(a => a.status !== 'Available').length}/{ambulances.length}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Queue:</span> {emergencies.filter(e => !e.assignedAmbulance).length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Map Panel */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Live Map
              </h2>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Dispatched</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Transporting</span>
                </div>
              </div>
            </div>
            <div style={{ height: '400px' }}>
              <MapContainer center={[-1.2921, 36.8219]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {/* Ambulance markers */}
                {ambulances.map(ambulance => (
                  <Marker 
                    key={ambulance.id} 
                    position={[ambulance.location.lat, ambulance.location.lng]}
                    icon={createCustomIcon(
                      ambulance.status === 'Available' ? '#10B981' :
                      ambulance.status === 'Dispatched' ? '#F59E0B' :
                      ambulance.status === 'Transporting' ? '#3B82F6' : '#8B5CF6',
                      '🚑'
                    )}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{ambulance.id}</h3>
                        <p>Driver: {ambulance.driver}</p>
                        <p>Status: {ambulance.status}</p>
                        <p>Type: {ambulance.type}</p>
                        {ambulance.eta && <p>ETA: {ambulance.eta}</p>}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Emergency markers */}
                {emergencies.map(emergency => (
                  <Marker 
                    key={emergency.id}
                    position={[emergency.coordinates.lat, emergency.coordinates.lng]}
                    icon={createCustomIcon(
                      emergency.priority === 'Critical' ? '#DC2626' :
                      emergency.priority === 'High' ? '#EA580C' : '#D97706',
                      '🚨'
                    )}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{emergency.id}</h3>
                        <p>Priority: {emergency.priority}</p>
                        <p>{emergency.description}</p>
                        <p>Location: {emergency.location}</p>
                        <p>Time: {emergency.timeSince}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Hospital markers */}
                {hospitals.map(hospital => (
                  <Marker 
                    key={hospital.id}
                    position={[hospital.location.lat, hospital.location.lng]}
                    icon={createCustomIcon('#6366F1', '🏥')}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{hospital.name}</h3>
                        <p>Status: {hospital.erStatus}</p>
                        <p>Capacity: {hospital.currentPatients}/{hospital.capacity}</p>
                        <p>Specialties: {hospital.specialties.join(', ')}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Emergency Requests Queue */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Emergency Requests Queue ({emergencies.length})
              </h2>
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Filter className="h-4 w-4" />
                <span className="text-sm">Filter</span>
              </button>
            </div>
            <div className="space-y-2">
              {emergencies.map(emergency => (
                <div 
                  key={emergency.id} 
                  className={`border-l-4 p-4 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(emergency.priority)}`}
                  onClick={() => setSelectedEmergency(emergency)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{emergency.id}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          emergency.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                          emergency.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {emergency.priority}
                        </span>
                        {emergency.assignedAmbulance && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {emergency.assignedAmbulance}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{emergency.description}</p>
                      <p className="text-xs text-gray-500">{emergency.location} • {emergency.timeSince}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        Assign
                      </button>
                      <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Fleet Status Overview */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Truck className="h-5 w-5 mr-2 text-blue-600" />
              Fleet Status
            </h2>
            <div className="space-y-3">
              {ambulances.map(ambulance => (
                <div key={ambulance.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{ambulance.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(ambulance.status)}`}>
                      {ambulance.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Driver: {ambulance.driver}</p>
                    <p>Type: {ambulance.type}</p>
                    {ambulance.eta && <p>ETA: {ambulance.eta}</p>}
                    <p className="text-xs">Updated: {ambulance.lastUpdate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Detail & Triage Panel */}
          {selectedEmergency && (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <Heart className="h-5 w-5 mr-2 text-red-600" />
                Patient Details
              </h2>
              <div className="space-y-3">
                <div className="border-b pb-2">
                  <h3 className="font-medium">{selectedEmergency.patientInfo.name}</h3>
                  <p className="text-sm text-gray-600">Age: {selectedEmergency.patientInfo.age}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Symptoms:</h4>
                  <p className="text-sm text-gray-700">{selectedEmergency.patientInfo.symptoms}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Medical History:</h4>
                  <p className="text-sm text-gray-700">{selectedEmergency.patientInfo.medicalHistory}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Vitals:</h4>
                  <p className="text-sm text-gray-700">{selectedEmergency.patientInfo.vitals}</p>
                </div>
                <div className="pt-2">
                  <label className="block text-sm font-medium mb-2">Priority Level:</label>
                  <select className="w-full p-2 border rounded-lg text-sm">
                    <option value={selectedEmergency.priority}>{selectedEmergency.priority}</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Hospital Readiness Panel */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Hospital className="h-5 w-5 mr-2 text-purple-600" />
              Hospital Status
            </h2>
            <div className="space-y-3">
              {hospitals.map(hospital => (
                <div key={hospital.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{hospital.name}</h3>
                    <span className={`text-sm font-medium ${getHospitalStatusColor(hospital.erStatus)}`}>
                      {hospital.erStatus}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span>{hospital.currentPatients}/{hospital.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ETA:</span>
                      <span>{hospital.eta}</span>
                    </div>
                    <p>Specialties: {hospital.specialties.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {/* Communication Feed */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
            Communications
          </h2>
          <div className="h-64 overflow-y-auto mb-4 border rounded p-2">
            {chatMessages.map(message => (
              <div key={message.id} className="mb-2 p-2 rounded bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{message.sender}</span>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 p-2 border rounded-lg text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="flex space-x-2 mt-2">
            <button className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-800 text-sm rounded-lg hover:bg-yellow-200">
              <Radio className="h-4 w-4 inline mr-1" />
              PTT
            </button>
            <button className="flex-1 px-3 py-2 bg-red-100 text-red-800 text-sm rounded-lg hover:bg-red-200">
              Emergency
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">6.2</div>
                <div className="text-xs text-gray-600">Avg Response (min)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-xs text-gray-600">Active Calls</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <div className="text-xs text-gray-600">Fleet Utilization</div>
              </div>
            </div>
            <div style={{ height: '150px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="responseTime" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            System Alerts
          </h2>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'critical' ? 'border-l-red-500 bg-red-50' :
                alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {alert.type === 'critical' ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : alert.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                      <span className={`text-xs font-medium ${
                        alert.type === 'critical' ? 'text-red-800' :
                        alert.type === 'warning' ? 'text-yellow-800' :
                        'text-blue-800'
                      }`}>
                        {alert.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                  <button className="text-xs text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between mb-1">
                <span>System Health:</span>
                <span className="font-medium text-green-600">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span>Network Status:</span>
                <span className="font-medium text-green-600">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic & Routing Panel */}
      <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Navigation className="h-5 w-5 mr-2 text-indigo-600" />
            Traffic & Routing
          </h2>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Clear</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Heavy</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Route to Kenyatta National Hospital</h3>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Clear</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Distance: 3.2 km</p>
              <p>ETA: 8 minutes</p>
              <p>Via: Uhuru Highway</p>
            </div>
            <button className="mt-2 w-full px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200">
              View Route
            </button>
          </div>

          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Route to Nairobi Hospital</h3>
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Moderate</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Distance: 4.8 km</p>
              <p>ETA: 15 minutes</p>
              <p>Via: Ngong Road (traffic)</p>
            </div>
            <button className="mt-2 w-full px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200">
              View Route
            </button>
          </div>

          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Route to Aga Khan Hospital</h3>
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Heavy</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Distance: 6.1 km</p>
              <p>ETA: 22 minutes</p>
              <p>Via: Waiyaki Way (roadworks)</p>
            </div>
            <button className="mt-2 w-full px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200">
              Alternative Route
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Traffic Advisory</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            VIP movement on Uhuru Highway causing delays. Matatu strike affecting Jogoo Road. Use Outer Ring Road for faster access to Eastlands.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceDispatchDashboard;