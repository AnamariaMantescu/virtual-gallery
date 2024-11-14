const { faker } = require('@faker-js/faker');
const { admin } = require('../config/firebase');

const generateArtwork = () => ({
    title: faker.lorem.words(5),
    author: faker.name.fullName(),
    creationYear: faker.datatype.number({ min: 1800, max: 2024 }),
    estimatedValue: faker.datatype.number({ min: 1000, max: 100000 }),
    technique: faker.helpers.arrayElement(['Oil', 'Acrylic', 'Watercolor', 'Digital', 'Mixed Media']),
    medium: faker.helpers.arrayElement(['Canvas', 'Paper', 'Wood', 'Glass', 'Others']),
    createdAt: admin.firestore.Timestamp.fromMillis(faker.date.past().getTime())
});

const generateCollection = () => {
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    return {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        exhibitionPeriod: {
            start: admin.firestore.Timestamp.fromMillis(startDate.getTime()),
            end: admin.firestore.Timestamp.fromMillis(endDate.getTime())
        },
        createdAt: admin.firestore.Timestamp.fromMillis(faker.date.past().getTime())
    };
};

const generateUpcomingExhibition = () => {
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    return {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraphs(2),
        estimatedPeriod: {
            start: admin.firestore.Timestamp.fromMillis(startDate.getTime()),
            end: admin.firestore.Timestamp.fromMillis(endDate.getTime())
        },
        createdAt: admin.firestore.Timestamp.fromMillis(faker.date.past().getTime())
    };
};

module.exports = {
    generateArtwork,
    generateCollection,
    generateUpcomingExhibition
};