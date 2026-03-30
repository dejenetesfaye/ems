const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Resource = require('./models/Resource');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ems');

const seedUsers = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Resource.deleteMany({});

    const salt = await bcrypt.genSalt(10);

    // Create System Admin
    const systemAdminPassword = await bcrypt.hash('system123', salt);
    const systemAdmin = new User({
      name: 'System Admin',
      email: 'system@ems.com',
      password: systemAdminPassword,
      role: 'systemadmin'
    });
    await systemAdmin.save();

    // Create Super Admin
    const adminPassword = await bcrypt.hash('admin123', salt);
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@ems.com',
      password: adminPassword,
      role: 'superadmin'
    });
    await admin.save();

    // Create Manager
    const managerPassword = await bcrypt.hash('manager123', salt);
    const manager = new User({
      name: 'Manager One',
      email: 'manager@ems.com',
      password: managerPassword,
      role: 'manager'
    });
    await manager.save();

    // Create Supervisor
    const supervisorPassword = await bcrypt.hash('supervisor123', salt);
    const supervisor = new User({
      name: 'Supervisor One',
      email: 'supervisor@ems.com',
      password: supervisorPassword,
      role: 'supervisor'
    });
    await supervisor.save();

    // Create Bride
    const bridePassword = await bcrypt.hash('bride123', salt);
    const bride = new User({
      name: 'Bride One',
      email: 'bride@ems.com',
      password: bridePassword,
      role: 'bride'
    });
    await bride.save();

    // Create Resources
    const plates = new Resource({ name: 'Plates', description: 'Dinner plates' });
    await plates.save();
    const drinks = new Resource({ name: 'Drinks', description: 'Soft drinks' });
    await drinks.save();
    const hall = new Resource({ name: 'Hall', description: 'Wedding hall rental' });
    await hall.save();

    // Create Event for Bride
    const event = new Event({
      name: 'Sample Wedding',
      type: 'Wedding',
      date: new Date('2026-06-01'),
      bride: bride._id,
      manager: manager._id,
      resources: [
        { resource: plates._id, quantity: 100, unitCost: 5 },
        { resource: drinks._id, quantity: 200, unitCost: 2 },
        { resource: hall._id, quantity: 1, unitCost: 1000 }
      ]
    });
    await event.save();

    // Update bride with eventId
    bride.eventId = event._id;
    await bride.save();

    console.log('Users, resources, and event seeded successfully');
    console.log('System Admin: system@ems.com / system123');
    console.log('Super Admin: admin@ems.com / admin123');
    console.log('Manager: manager@ems.com / manager123');
    console.log('Supervisor: supervisor@ems.com / supervisor123');
    console.log('Bride: bride@ems.com / bride123');
    console.log('Resources created: Plates, Drinks, Hall');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();