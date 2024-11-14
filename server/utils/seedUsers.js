// utils/seedUsers.js
const { admin, db } = require('../config/firebase');
const { faker } = require('@faker-js/faker');

async function seedUsers() {
    try {
        // Creează admin
        const adminEmail = 'admin@gallery.com';
        const adminPassword = 'admin123';
        
        let adminUser;
        try {
            adminUser = await admin.auth().createUser({
                email: adminEmail,
                password: adminPassword,
                displayName: 'Admin User'
            });

            await db.collection('users').doc(adminUser.uid).set({
                name: 'Admin User',
                email: adminEmail,
                role: 'admin',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log('Created admin user:', adminEmail);
        } catch (error) {
            console.log('Admin might already exist:', error.message);
        }

        // Creează 5 vizitatori
        for(let i = 0; i < 5; i++) {
            const visitorEmail = faker.internet.email();
            const visitorPassword = 'visitor123';
            
            try {
                const visitorUser = await admin.auth().createUser({
                    email: visitorEmail,
                    password: visitorPassword,
                    displayName: faker.name.fullName()
                });

                await db.collection('users').doc(visitorUser.uid).set({
                    name: visitorUser.displayName,
                    email: visitorEmail,
                    role: 'visitor',
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                console.log(`Created visitor: ${visitorEmail}`);
            } catch (error) {
                console.log('Error creating visitor:', error.message);
            }
        }

        console.log('Users seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

seedUsers();