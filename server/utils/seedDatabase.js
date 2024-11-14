const { admin, db } = require('../config/firebase');
const { faker } = require('@faker-js/faker');
const { generateArtwork, generateCollection, generateUpcomingExhibition } = require('./faker');


async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        const artworksRef = db.collection('artworks');
        const artworks = [];
        for(let i=0; i < 20; i++) {
            const artwork = generateArtwork();
            const docRef = await artworksRef.add(artwork);
            artworks.push({ id: docRef.id, ...artwork });
            console.log(`Created artwork: ${artwork.title}` )
        }

        const collectionsRef = db.collection('collections');
        const collections = [];
        for( let i = 0; i < 5; i++) {
            const collection = generateCollection();

            const selectedArtworks = faker.helpers.arrayElements(
                artworks,
                faker.datatype.number({ min: 4, max: 8 })
            );

            const docRef = await collectionsRef .add(collection);
            collections.push({ id: docRef.id, ...collection});

            for(const artwork of selectedArtworks) {
                await db.collection('collection_artworks').add({
                    collectionId: docRef.id,
                    artworkId: artwork.id,
                    addedAt: admin.firestore.Timestamp.fromDate(faker.date.past())
                });
            }
            console.log(`Created collection: ${collection.title}`);
        }

        const exhibitionsRef = db.collection('upcoming_exhibitions');
        for(let i = 0; i < 3; i++) {
            const exhibition = generateUpcomingExhibition();
            await exhibitionsRef.add(exhibition);
            console.log(`Created upcoming exhibition: ${exhibition.title}`);
        }

        const visitors = await db.collection('users')
        .where('role', '==', 'visitor')
        .get();

        const exhibitions = await exhibitionsRef.get();

        for(const visitor of visitors.docs) {
            const randomExhibitions = faker.helpers.arrayElements(
                exhibitions.docs,
                faker.datatype.number({ min: 1, max: 2 })
            );

            for(const exhibition of randomExhibitions) {
                await db.collection('registrations').add({
                    exhibitionId: exhibition.id,
                    userId: visitor.id,
                    registeredAt: admin.firestore.Timestamp.fromDate(faker.date.past())
                });
            }       
        }
        console.log('Database seeding completed successfully!');
        process.exit(0); 
    } catch ( error ) {
        console.error('Error seeding database', error);
        process.exit(1);
    }
}

seedDatabase();