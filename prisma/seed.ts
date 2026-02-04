import {
  UserRole,
  BookingStatus,
  ConceptTier,
  NotificationType,
  MessageType,
  PrismaClient,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning up database... ---');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  await prisma.aiGuidanceSession.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.photographerSchedule.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.conceptPhoto.deleteMany({});
  await prisma.conceptLocation.deleteMany({});
  await prisma.chatRoom.deleteMany({});
  await prisma.concept.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.photographer.deleteMany({});
  await prisma.user.deleteMany({});

  const password = await bcrypt.hash('password123', 10);

  console.log('--- Seeding 15 Users (Clients) ---');
  const c1 = await prisma.user.create({
    data: {
      fullName: 'Mai Tram',
      email: 'tramhuynh@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client1`,
      province: 'Ho Chi Minh',
      ward: 'Ward 1',
    },
  });
  const c2 = await prisma.user.create({
    data: {
      fullName: 'Kim Sa',
      email: 'kimsa@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client2`,
      province: 'Ho Chi Minh',
      ward: 'Ward 2',
    },
  });
  const c3 = await prisma.user.create({
    data: {
      fullName: 'Do Binh',
      email: 'dobinh@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client3`,
      province: 'Ho Chi Minh',
      ward: 'Ward 3',
    },
  });
  const c4 = await prisma.user.create({
    data: {
      fullName: 'Thi Tiep',
      email: 'thitiep@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client4`,
      province: 'Ho Chi Minh',
      ward: 'Ward 4',
    },
  });
  const c5 = await prisma.user.create({
    data: {
      fullName: 'Thanh Tam',
      email: 'thanhtam@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client5`,
      province: 'Ho Chi Minh',
      ward: 'Ward 5',
    },
  });
  const c6 = await prisma.user.create({
    data: {
      fullName: 'Mai Lan',
      email: 'mailan@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client6`,
      province: 'Ho Chi Minh',
      ward: 'Ward 6',
    },
  });
  const c7 = await prisma.user.create({
    data: {
      fullName: 'Van Anh',
      email: 'vananh@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client7`,
      province: 'Ho Chi Minh',
      ward: 'Ward 7',
    },
  });
  const c8 = await prisma.user.create({
    data: {
      fullName: 'Ha Nhan',
      email: 'hanhan@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client8`,
      province: 'Ho Chi Minh',
      ward: 'Ward 8',
    },
  });
  const c9 = await prisma.user.create({
    data: {
      fullName: 'Quan Tran',
      email: 'quantran@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client9`,
      province: 'Ho Chi Minh',
      ward: 'Ward 9',
    },
  });
  const c10 = await prisma.user.create({
    data: {
      fullName: 'Hieu Hoang',
      email: 'hieuhoang@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client10`,
      province: 'Ho Chi Minh',
      ward: 'Ward 10',
    },
  });
  const c11 = await prisma.user.create({
    data: {
      fullName: 'Vinh',
      email: 'vinh@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client11`,
      province: 'Da Nang',
      ward: 'Hai Chau',
    },
  });
  const c12 = await prisma.user.create({
    data: {
      fullName: 'Lan Pham',
      email: 'lanpham@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client12`,
      province: 'Da Nang',
      ward: 'Thanh Khe',
    },
  });
  const c13 = await prisma.user.create({
    data: {
      fullName: 'Bang Nguyen',
      email: 'bangnguyen@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client13`,
      province: 'Da Nang',
      ward: 'Son Tra',
    },
  });
  const c14 = await prisma.user.create({
    data: {
      fullName: 'Thi Dieu',
      email: 'thidieu@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client14`,
      province: 'Ha Noi',
      ward: 'Ba Dinh',
    },
  });
  const c15 = await prisma.user.create({
    data: {
      fullName: 'Thi On',
      email: 'thion@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client15`,
      province: 'Ha Noi',
      ward: 'Hoan Kiem',
    },
  });

  console.log('--- Seeding 15 Photographer Profiles ---');
  const pu1 = await prisma.user.create({
    data: {
      fullName: 'Thuy Ha',
      email: 'thuyha@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer1`,
      province: 'Ho Chi Minh',
      ward: 'District 1',
    },
  });
  const pu2 = await prisma.user.create({
    data: {
      fullName: 'Bang',
      email: 'bang@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer2`,
      province: 'Ho Chi Minh',
      ward: 'District 2',
    },
  });
  const pu3 = await prisma.user.create({
    data: {
      fullName: 'Hiep',
      email: 'hiep@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer3`,
      province: 'Ho Chi Minh',
      ward: 'District 3',
    },
  });
  const pu4 = await prisma.user.create({
    data: {
      fullName: 'Tan',
      email: 'tan@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer4`,
      province: 'Ho Chi Minh',
      ward: 'District 4',
    },
  });
  const pu5 = await prisma.user.create({
    data: {
      fullName: 'Kien Nguyen',
      email: 'kiennguyen@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer5`,
      province: 'Ho Chi Minh',
      ward: 'District 5',
    },
  });
  const pu6 = await prisma.user.create({
    data: {
      fullName: 'Han Hoang',
      email: 'hanhoang@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer6`,
      province: 'Ho Chi Minh',
      ward: 'District 6',
    },
  });
  const pu7 = await prisma.user.create({
    data: {
      fullName: 'Duc Anh',
      email: 'ducanh@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer7`,
      province: 'Ho Chi Minh',
      ward: 'District 7',
    },
  });
  const pu8 = await prisma.user.create({
    data: {
      fullName: 'Khiem',
      email: 'khiem@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer8`,
      province: 'Ho Chi Minh',
      ward: 'District 8',
    },
  });
  const pu9 = await prisma.user.create({
    data: {
      fullName: 'Tien Nguyen',
      email: 'tiennguyen@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer9`,
      province: 'Ho Chi Minh',
      ward: 'District 9',
    },
  });
  const pu10 = await prisma.user.create({
    data: {
      fullName: 'Kim Ngoc',
      email: 'kimngoc@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer10`,
      province: 'Ho Chi Minh',
      ward: 'District 10',
    },
  });
  const pu11 = await prisma.user.create({
    data: {
      fullName: 'Tay Ha',
      email: 'tayha@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer11`,
      province: 'Da Nang',
      ward: 'Lien Chieu',
    },
  });
  const pu12 = await prisma.user.create({
    data: {
      fullName: 'Thanh Liem',
      email: 'thanhliem@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer12`,
      province: 'Da Nang',
      ward: 'Ngu Hanh Son',
    },
  });
  const pu13 = await prisma.user.create({
    data: {
      fullName: 'Chien Le',
      email: 'chienle@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer13`,
      province: 'Ha Noi',
      ward: 'Tay Ho',
    },
  });
  const pu14 = await prisma.user.create({
    data: {
      fullName: 'Nguyen Nguyen',
      email: 'nguyen@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer14`,
      province: 'Ha Noi',
      ward: 'Cau Giay',
    },
  });
  const pu15 = await prisma.user.create({
    data: {
      fullName: 'On Ha',
      email: 'onha@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer15`,
      province: 'Ha Noi',
      ward: 'Dong Da',
    },
  });

  const p1 = await prisma.photographer.create({
    data: {
      userId: pu1.id,
      bio: 'Expert in Weddings',
      experienceYears: 10,
      isVerified: true,
    },
  });
  const p2 = await prisma.photographer.create({
    data: {
      userId: pu2.id,
      bio: 'Portrait specialist',
      experienceYears: 5,
      isVerified: true,
    },
  });
  const p3 = await prisma.photographer.create({
    data: {
      userId: pu3.id,
      bio: 'Street photography lover',
      experienceYears: 3,
    },
  });
  const p4 = await prisma.photographer.create({
    data: {
      userId: pu4.id,
      bio: 'Fashion and Style',
      experienceYears: 7,
      isVerified: true,
    },
  });
  const p5 = await prisma.photographer.create({
    data: { userId: pu5.id, bio: 'Nature and Landscapes', experienceYears: 4 },
  });
  const p6 = await prisma.photographer.create({
    data: {
      userId: pu6.id,
      bio: 'Commercial Product shots',
      experienceYears: 12,
    },
  });
  const p7 = await prisma.photographer.create({
    data: { userId: pu7.id, bio: 'Event Photographer', experienceYears: 6 },
  });
  const p8 = await prisma.photographer.create({
    data: { userId: pu8.id, bio: 'Family and Kids', experienceYears: 2 },
  });
  const p9 = await prisma.photographer.create({
    data: { userId: pu9.id, bio: 'Sports Action shots', experienceYears: 8 },
  });
  const p10 = await prisma.photographer.create({
    data: {
      userId: pu10.id,
      bio: 'Architecture expert',
      experienceYears: 15,
      isVerified: true,
    },
  });
  const p11 = await prisma.photographer.create({
    data: { userId: pu11.id, bio: 'B&W Art Photography', experienceYears: 5 },
  });
  const p12 = await prisma.photographer.create({
    data: {
      userId: pu12.id,
      bio: 'Travel Content Creator',
      experienceYears: 3,
    },
  });
  const p13 = await prisma.photographer.create({
    data: { userId: pu13.id, bio: 'High Fashion Studio', experienceYears: 9 },
  });
  const p14 = await prisma.photographer.create({
    data: { userId: pu14.id, bio: 'Pet Portraits', experienceYears: 4 },
  });
  const p15 = await prisma.photographer.create({
    data: { userId: pu15.id, bio: 'Cinematic Lifestyle', experienceYears: 6 },
  });

  console.log('--- Seeding 15 Categories ---');
  const cat1 = await prisma.category.create({
    data: { name: 'Wedding', thumbnailUrl: `${baseUrl}/wedding` },
  });
  const cat2 = await prisma.category.create({
    data: { name: 'Portrait', thumbnailUrl: `${baseUrl}/portrait` },
  });
  const cat3 = await prisma.category.create({
    data: { name: 'Street', thumbnailUrl: `${baseUrl}/street` },
  });
  const cat4 = await prisma.category.create({
    data: { name: 'Fashion', thumbnailUrl: `${baseUrl}/fashion` },
  });
  const cat5 = await prisma.category.create({
    data: { name: 'Product', thumbnailUrl: `${baseUrl}/product` },
  });
  const cat6 = await prisma.category.create({
    data: { name: 'Architecture', thumbnailUrl: `${baseUrl}/arch` },
  });
  const cat7 = await prisma.category.create({
    data: { name: 'Family', thumbnailUrl: `${baseUrl}/family` },
  });
  const cat8 = await prisma.category.create({
    data: { name: 'Sports', thumbnailUrl: `${baseUrl}/sports` },
  });
  const cat9 = await prisma.category.create({
    data: { name: 'Art', thumbnailUrl: `${baseUrl}/art` },
  });
  const cat10 = await prisma.category.create({
    data: { name: 'Food', thumbnailUrl: `${baseUrl}/food` },
  });
  const cat11 = await prisma.category.create({
    data: { name: 'Travel', thumbnailUrl: `${baseUrl}/travel` },
  });
  const cat12 = await prisma.category.create({
    data: { name: 'Nature', thumbnailUrl: `${baseUrl}/nature` },
  });
  const cat13 = await prisma.category.create({
    data: { name: 'Macro', thumbnailUrl: `${baseUrl}/macro` },
  });
  const cat14 = await prisma.category.create({
    data: { name: 'Automotive', thumbnailUrl: `${baseUrl}/car` },
  });
  const cat15 = await prisma.category.create({
    data: { name: 'Night', thumbnailUrl: `${baseUrl}/night` },
  });

  console.log('--- Seeding 15 Concepts & Locations ---');
  const con1 = await prisma.concept.create({
    data: {
      name: 'Royal Wedding',
      photographerId: p1.userId,
      categoryId: cat1.id,
      tier: ConceptTier.PREMIUM,
      price: 5000,
      thumbnailUrl: `${baseUrl}/con1`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con1.id, province: 'London', ward: 'Central' },
  });

  const con2 = await prisma.concept.create({
    data: {
      name: 'Cyberpunk Tokyo',
      photographerId: p3.userId,
      categoryId: cat15.id,
      tier: ConceptTier.STANDARD,
      price: 800,
      thumbnailUrl: `${baseUrl}/con2`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con2.id, province: 'Tokyo', ward: 'Shibuya' },
  });

  const con3 = await prisma.concept.create({
    data: {
      name: 'Minimal Portrait',
      photographerId: p2.userId,
      categoryId: cat2.id,
      tier: ConceptTier.BASIC,
      price: 300,
      thumbnailUrl: `${baseUrl}/con3`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con3.id, province: 'Paris', ward: 'Zone 1' },
  });

  const con4 = await prisma.concept.create({
    data: {
      name: 'Milan Fashion Week',
      photographerId: p4.userId,
      categoryId: cat4.id,
      tier: ConceptTier.PREMIUM,
      price: 2500,
      thumbnailUrl: `${baseUrl}/con4`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con4.id, province: 'Milan', ward: 'Fashion District' },
  });

  const con5 = await prisma.concept.create({
    data: {
      name: 'Wild Outback',
      photographerId: p5.userId,
      categoryId: cat12.id,
      tier: ConceptTier.STANDARD,
      price: 600,
      thumbnailUrl: `${baseUrl}/con5`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con5.id, province: 'Sydney', ward: 'Outback' },
  });

  const con6 = await prisma.concept.create({
    data: {
      name: 'Modern Skyscraper',
      photographerId: p10.userId,
      categoryId: cat6.id,
      tier: ConceptTier.PREMIUM,
      price: 1500,
      thumbnailUrl: `${baseUrl}/con6`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con6.id, province: 'Singapore', ward: 'Marina' },
  });

  const con7 = await prisma.concept.create({
    data: {
      name: 'Family Picnic',
      photographerId: p8.userId,
      categoryId: cat7.id,
      tier: ConceptTier.BASIC,
      price: 200,
      thumbnailUrl: `${baseUrl}/con7`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con7.id, province: 'Toronto', ward: 'Park' },
  });

  const con8 = await prisma.concept.create({
    data: {
      name: 'Stadium Heat',
      photographerId: p9.userId,
      categoryId: cat8.id,
      tier: ConceptTier.STANDARD,
      price: 750,
      thumbnailUrl: `${baseUrl}/con8`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con8.id, province: 'Madrid', ward: 'Stadium' },
  });

  const con9 = await prisma.concept.create({
    data: {
      name: 'Ethereal Forest',
      photographerId: p11.userId,
      categoryId: cat9.id,
      tier: ConceptTier.STANDARD,
      price: 900,
      thumbnailUrl: `${baseUrl}/con9`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con9.id, province: 'London', ward: 'Forest' },
  });

  const con10 = await prisma.concept.create({
    data: {
      name: 'Gourmet Textures',
      photographerId: p6.userId,
      categoryId: cat10.id,
      tier: ConceptTier.STANDARD,
      price: 1100,
      thumbnailUrl: `${baseUrl}/con10`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con10.id, province: 'New York', ward: 'Kitchen' },
  });

  const con11 = await prisma.concept.create({
    data: {
      name: 'Lost in Bangkok',
      photographerId: p12.userId,
      categoryId: cat11.id,
      tier: ConceptTier.BASIC,
      price: 450,
      thumbnailUrl: `${baseUrl}/con11`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con11.id, province: 'Bangkok', ward: 'Siam' },
  });

  const con12 = await prisma.concept.create({
    data: {
      name: 'K-Pop Studio',
      photographerId: p13.userId,
      categoryId: cat4.id,
      tier: ConceptTier.PREMIUM,
      price: 3000,
      thumbnailUrl: `${baseUrl}/con12`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con12.id, province: 'Seoul', ward: 'Gangnam' },
  });

  const con13 = await prisma.concept.create({
    data: {
      name: 'Tiny Worlds',
      photographerId: p14.userId,
      categoryId: cat13.id,
      tier: ConceptTier.BASIC,
      price: 150,
      thumbnailUrl: `${baseUrl}/con13`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con13.id, province: 'Amsterdam', ward: 'Macro' },
  });

  const con14 = await prisma.concept.create({
    data: {
      name: 'Supercar Sunset',
      photographerId: p15.userId,
      categoryId: cat14.id,
      tier: ConceptTier.STANDARD,
      price: 1200,
      thumbnailUrl: `${baseUrl}/con14`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con14.id, province: 'LA', ward: 'Sunset' },
  });

  const con15 = await prisma.concept.create({
    data: {
      name: 'Vintage London',
      photographerId: p1.userId,
      categoryId: cat3.id,
      tier: ConceptTier.STANDARD,
      price: 1000,
      thumbnailUrl: `${baseUrl}/con15`,
    },
  });
  await prisma.conceptLocation.create({
    data: { conceptId: con15.id, province: 'London', ward: 'Vintage' },
  });

  console.log('--- Seeding 15 Concept Photos ---');
  await prisma.conceptPhoto.create({
    data: { conceptId: con1.id, imageUrl: `${baseUrl}/wedding1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con1.id, imageUrl: `${baseUrl}/wedding2` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con2.id, imageUrl: `${baseUrl}/tokyo1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con3.id, imageUrl: `${baseUrl}/port1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con4.id, imageUrl: `${baseUrl}/fash1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con5.id, imageUrl: `${baseUrl}/wild1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con6.id, imageUrl: `${baseUrl}/arch1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con7.id, imageUrl: `${baseUrl}/fam1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con8.id, imageUrl: `${baseUrl}/sport1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con9.id, imageUrl: `${baseUrl}/art1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con10.id, imageUrl: `${baseUrl}/food1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con11.id, imageUrl: `${baseUrl}/trav1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con12.id, imageUrl: `${baseUrl}/kpop1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con13.id, imageUrl: `${baseUrl}/macro1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con14.id, imageUrl: `${baseUrl}/car1` },
  });

  console.log('--- Seeding 15 Bookings ---');
  const b1 = await prisma.booking.create({
    data: {
      clientId: c1.id,
      photographerId: p1.userId,
      conceptId: con1.id,
      bookingDate: new Date('2025-05-20'),
      status: BookingStatus.COMPLETED,
      totalPrice: 5000,
      isCompletedByCustomer: true,
    },
  });
  const b2 = await prisma.booking.create({
    data: {
      clientId: c2.id,
      photographerId: p3.userId,
      conceptId: con2.id,
      bookingDate: new Date('2025-06-15'),
      status: BookingStatus.CONFIRMED,
      totalPrice: 800,
    },
  });
  const b3 = await prisma.booking.create({
    data: {
      clientId: c3.id,
      photographerId: p2.userId,
      conceptId: con3.id,
      bookingDate: new Date('2025-04-10'),
      status: BookingStatus.COMPLETED,
      totalPrice: 300,
      isCompletedByCustomer: true,
    },
  });
  const b4 = await prisma.booking.create({
    data: {
      clientId: c4.id,
      photographerId: p4.userId,
      conceptId: con4.id,
      bookingDate: new Date('2025-09-01'),
      status: BookingStatus.PENDING,
      totalPrice: 2500,
    },
  });
  const b5 = await prisma.booking.create({
    data: {
      clientId: c5.id,
      photographerId: p5.userId,
      conceptId: con5.id,
      bookingDate: new Date('2025-07-20'),
      status: BookingStatus.CONFIRMED,
      totalPrice: 600,
    },
  });
  const b6 = await prisma.booking.create({
    data: {
      clientId: c6.id,
      photographerId: p10.userId,
      conceptId: con6.id,
      bookingDate: new Date('2025-10-10'),
      status: BookingStatus.PENDING,
      totalPrice: 1500,
    },
  });
  const b7 = await prisma.booking.create({
    data: {
      clientId: c7.id,
      photographerId: p8.userId,
      conceptId: con7.id,
      bookingDate: new Date('2025-03-05'),
      status: BookingStatus.COMPLETED,
      totalPrice: 200,
      isCompletedByCustomer: true,
    },
  });
  const b8 = await prisma.booking.create({
    data: {
      clientId: c8.id,
      photographerId: p9.userId,
      conceptId: con8.id,
      bookingDate: new Date('2025-08-15'),
      status: BookingStatus.CONFIRMED,
      totalPrice: 750,
    },
  });
  const b9 = await prisma.booking.create({
    data: {
      clientId: c9.id,
      photographerId: p11.userId,
      conceptId: con9.id,
      bookingDate: new Date('2025-11-22'),
      status: BookingStatus.PENDING,
      totalPrice: 900,
    },
  });
  const b10 = await prisma.booking.create({
    data: {
      clientId: c10.id,
      photographerId: p6.userId,
      conceptId: con10.id,
      bookingDate: new Date('2025-12-05'),
      status: BookingStatus.CONFIRMED,
      totalPrice: 1100,
    },
  });
  const b11 = await prisma.booking.create({
    data: {
      clientId: c11.id,
      photographerId: p12.userId,
      conceptId: con11.id,
      bookingDate: new Date('2025-05-30'),
      status: BookingStatus.PENDING,
      totalPrice: 450,
    },
  });
  const b12 = await prisma.booking.create({
    data: {
      clientId: c12.id,
      photographerId: p13.userId,
      conceptId: con12.id,
      bookingDate: new Date('2025-01-15'),
      status: BookingStatus.COMPLETED,
      totalPrice: 3000,
      isCompletedByCustomer: true,
    },
  });
  const b13 = await prisma.booking.create({
    data: {
      clientId: c13.id,
      photographerId: p14.userId,
      conceptId: con13.id,
      bookingDate: new Date('2025-02-14'),
      status: BookingStatus.REJECTED,
      totalPrice: 150,
    },
  });
  const b14 = await prisma.booking.create({
    data: {
      clientId: c14.id,
      photographerId: p15.userId,
      conceptId: con14.id,
      bookingDate: new Date('2025-04-20'),
      status: BookingStatus.CANCELLED,
      totalPrice: 1200,
    },
  });
  const b15 = await prisma.booking.create({
    data: {
      clientId: c15.id,
      photographerId: p1.userId,
      conceptId: con15.id,
      bookingDate: new Date('2025-03-12'),
      status: BookingStatus.CONFIRMED,
      totalPrice: 1000,
    },
  });

  console.log('--- Seeding 15 Reviews ---');
  await prisma.review.create({
    data: {
      bookingId: b1.id,
      rating: 5,
      comment: 'Magical wedding shots! Highly recommended.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b3.id,
      rating: 4,
      comment: 'Nice and clean portrait work.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b7.id,
      rating: 5,
      comment: 'Wonderful family memories captured.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b12.id,
      rating: 5,
      comment: 'The K-pop studio vibe was perfect.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b2.id,
      rating: 4,
      comment: 'Great eye for urban details.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b5.id,
      rating: 3,
      comment: 'Good but late to the session.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b8.id,
      rating: 5,
      comment: 'Fastest action shots I have ever seen.',
    },
  });
  await prisma.review.create({
    data: { bookingId: b10.id, rating: 4, comment: 'Tasty looking photos.' },
  });
  await prisma.review.create({
    data: { bookingId: b15.id, rating: 5, comment: 'Classic look, loved it.' },
  });

  console.log('--- Seeding 15 Schedules ---');
  await prisma.photographerSchedule.create({
    data: { photographerId: p1.userId, availableDate: new Date('2025-05-20') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p2.userId, availableDate: new Date('2025-04-10') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p3.userId, availableDate: new Date('2025-06-15') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p4.userId, availableDate: new Date('2025-09-01') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p5.userId, availableDate: new Date('2025-07-20') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p6.userId, availableDate: new Date('2025-12-05') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p7.userId, availableDate: new Date('2025-06-20') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p8.userId, availableDate: new Date('2025-03-05') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p9.userId, availableDate: new Date('2025-08-15') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p10.userId, availableDate: new Date('2025-10-10') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p11.userId, availableDate: new Date('2025-11-22') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p12.userId, availableDate: new Date('2025-05-30') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p13.userId, availableDate: new Date('2025-01-15') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p14.userId, availableDate: new Date('2025-02-14') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p15.userId, availableDate: new Date('2025-04-20') },
  });

  console.log('--- Seeding 15 Chat Rooms & 15 Messages ---');
  const room1 = await prisma.chatRoom.create({
    data: { clientId: c1.id, photographerId: p1.userId, conceptId: con1.id },
  });
  await prisma.message.create({
    data: {
      chatRoomId: room1.id,
      senderId: c1.id,
      content: 'Hi Alex, I want to book the Royal Wedding concept.',
      type: MessageType.TEXT,
    },
  });
  await prisma.message.create({
    data: {
      chatRoomId: room1.id,
      senderId: pu1.id,
      content: 'Sure Alice, what date are you looking for?',
      type: MessageType.TEXT,
    },
  });

  const room2 = await prisma.chatRoom.create({
    data: { clientId: c2.id, photographerId: p3.userId, conceptId: con2.id },
  });
  await prisma.message.create({
    data: {
      chatRoomId: room2.id,
      senderId: c2.id,
      content: 'I love your Tokyo night shots!',
      type: MessageType.TEXT,
    },
  });

  for (let i = 3; i <= 15; i++) {
    const room = await prisma.chatRoom.create({
      data: { clientId: c1.id, photographerId: pu1.id },
    });
    await prisma.message.create({
      data: {
        chatRoomId: room.id,
        senderId: c1.id,
        content: `Message #${i}`,
        type: MessageType.TEXT,
      },
    });
  }

  console.log('--- Seeding 15 Notifications ---');
  await prisma.notification.create({
    data: {
      userId: c1.id,
      title: 'Booking Updated',
      content: 'Your booking has been confirmed.',
      type: NotificationType.BOOKING_UPDATE,
    },
  });
  await prisma.notification.create({
    data: {
      userId: pu1.id,
      title: 'New Message',
      content: 'You have a new message from Alice.',
      type: NotificationType.NEW_MESSAGE,
    },
  });
  for (let i = 3; i <= 15; i++) {
    await prisma.notification.create({
      data: {
        userId: c1.id,
        title: 'System Alert',
        content: `System notification ${i}`,
        type: NotificationType.SYSTEM,
      },
    });
  }

  console.log('--- Seeding 15 AI Guidance Sessions ---');
  await prisma.aiGuidanceSession.create({
    data: {
      userId: c1.id,
      contextType: 'Portrait',
      voiceScriptUsed: 'Tilt your head 30 degrees to the right.',
    },
  });
  for (let i = 2; i <= 15; i++) {
    await prisma.aiGuidanceSession.create({
      data: {
        userId: c2.id,
        contextType: 'Street',
        voiceScriptUsed: `Pose suggestion #${i}`,
      },
    });
  }

  console.log('--- Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
