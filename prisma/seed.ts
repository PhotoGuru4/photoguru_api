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

  console.log('--- Seeding Clients ---');
  const c1 = await prisma.user.create({
    data: {
      fullName: 'Mai Tram',
      email: 'tramhuynh@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client1`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Phường Thủ Dầu Một',
    },
  });
  const c2 = await prisma.user.create({
    data: {
      fullName: 'Kim Sa',
      email: 'kimsa@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client2`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Phường Phú Lợi',
    },
  });
  const c3 = await prisma.user.create({
    data: {
      fullName: 'Do Binh',
      email: 'dobinh@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client3`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường Hải Vân',
    },
  });
  const c4 = await prisma.user.create({
    data: {
      fullName: 'Thi Tiep',
      email: 'thitiep@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client4`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Ba Đình',
    },
  });
  const c5 = await prisma.user.create({
    data: {
      fullName: 'Thanh Tam',
      email: 'thanhtam@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client5`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Phường Bình Dương',
    },
  });
  const c6 = await prisma.user.create({
    data: {
      fullName: 'Mai Lan',
      email: 'mailan@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client6`,
      province: 'Tỉnh Quảng Ngãi',
      ward: 'Xã Bình Sơn',
    },
  });
  const c7 = await prisma.user.create({
    data: {
      fullName: 'Van Anh',
      email: 'vananh@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client7`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường Liên Chiểu',
    },
  });
  const c8 = await prisma.user.create({
    data: {
      fullName: 'Ha Nhan',
      email: 'hanhan@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client8`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Ngọc Hà',
    },
  });
  const c9 = await prisma.user.create({
    data: {
      fullName: 'Quan Tran',
      email: 'quantran@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client9`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Phường Phú An',
    },
  });
  const c10 = await prisma.user.create({
    data: {
      fullName: 'Hieu Hoang',
      email: 'hieuhoang@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client10`,
      province: 'Tỉnh Quảng Ngãi',
      ward: 'Xã Vạn Tường',
    },
  });
  const c11 = await prisma.user.create({
    data: {
      fullName: 'Vinh',
      email: 'vinh@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client11`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Phường Chánh Hiệp',
    },
  });
  const c12 = await prisma.user.create({
    data: {
      fullName: 'Lan Pham',
      email: 'lanpham@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client12`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường Hòa Khánh',
    },
  });
  const c13 = await prisma.user.create({
    data: {
      fullName: 'Bang Nguyen',
      email: 'bangnguyen@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client13`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Giảng Võ',
    },
  });
  const c14 = await prisma.user.create({
    data: {
      fullName: 'Thi Dieu',
      email: 'thidieu@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client14`,
      province: 'Tỉnh Khánh Hòa',
      ward: 'Phường Nha Trang',
    },
  });
  const c15 = await prisma.user.create({
    data: {
      fullName: 'Thi On',
      email: 'thion@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client15`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Xã Dầu Tiếng',
    },
  });
  const c16 = await prisma.user.create({
    data: {
      fullName: 'Huynh Van Nam',
      email: 'nam.huynh@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client16`,
      province: 'Tỉnh Quảng Ngãi',
      ward: 'Xã Bình Minh',
    },
  });
  const c17 = await prisma.user.create({
    data: {
      fullName: 'Bui Thi Thu Ha',
      email: 'ha.bui@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client17`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Ô Chợ Dừa',
    },
  });
  const c18 = await prisma.user.create({
    data: {
      fullName: 'Doan Minh Khang',
      email: 'khang.doan@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client18`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường Thanh Khê',
    },
  });
  const c19 = await prisma.user.create({
    data: {
      fullName: 'Ngo Thi Bao Ngoc',
      email: 'ngoc.ngo@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client19`,
      province: 'Tỉnh Quảng Ninh',
      ward: 'Phường Hà Tu',
    },
  });
  const c20 = await prisma.user.create({
    data: {
      fullName: 'Ly Van Phat',
      email: 'phat.ly@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client20`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Xã Minh Thạnh',
    },
  });
  const c21 = await prisma.user.create({
    data: {
      fullName: 'Nguyen Thi Thu Thuy',
      email: 'thuy.nguyen@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client21`,
      province: 'Tỉnh Lâm Đồng',
      ward: 'Phường Mũi Né',
    },
  });
  const c22 = await prisma.user.create({
    data: {
      fullName: 'Tran Minh Duc',
      email: 'duc.tran@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client22`,
      province: 'Thành phố Cần Thơ',
      ward: 'Phường Cái Khế',
    },
  });
  const c23 = await prisma.user.create({
    data: {
      fullName: 'Le Thi Kim Oanh',
      email: 'oanh.le@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client23`,
      province: 'Tỉnh Đồng Nai',
      ward: 'Phường Bình Phước',
    },
  });
  const c24 = await prisma.user.create({
    data: {
      fullName: 'Pham Van Khoa',
      email: 'khoa.pham@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client24`,
      province: 'Thành phố Hải Phòng',
      ward: 'Phường Thành Đông',
    },
  });
  const c25 = await prisma.user.create({
    data: {
      fullName: 'Hoang Thi Mai Anh',
      email: 'anh.hoangthi@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client25`,
      province: 'Thành phố Hải Phòng',
      ward: 'Phường Thành Đông',
    },
  });
  const c26 = await prisma.user.create({
    data: {
      fullName: 'Vu Minh Tri',
      email: 'tri.vu@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client26`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Xã Long Hòa',
    },
  });
  const c27 = await prisma.user.create({
    data: {
      fullName: 'Dang Van Hung',
      email: 'hung.dang@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client27`,
      province: 'Tỉnh Thanh Hóa',
      ward: 'Phường Hàm Rồng',
    },
  });
  const c28 = await prisma.user.create({
    data: {
      fullName: 'Nguyen Thi Lan Huong',
      email: 'huong.lan@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client28`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường Hải Châu',
    },
  });
  const c29 = await prisma.user.create({
    data: {
      fullName: 'Tran Thi Hong Phuc',
      email: 'phuc.tran@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client29`,
      province: 'Tỉnh Thanh Hóa',
      ward: 'Phường Hạc Thành',
    },
  });
  const c30 = await prisma.user.create({
    data: {
      fullName: 'Le Van Tuan Anh',
      email: 'tuananh.le@gmail.com',
      password,
      role: UserRole.CUSTOMER,
      avatarUrl: `${baseUrl}/client30`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Yên Hòa',
    },
  });

  console.log('--- Seeding 30 Photographer Profiles ---');
  const pu1 = await prisma.user.create({
    data: {
      fullName: 'Thuy Ha',
      email: 'thuyha@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer1`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Xã Thanh An',
    },
  });
  const pu2 = await prisma.user.create({
    data: {
      fullName: 'Tran Bang',
      email: 'bang.tran.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer2`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường Hòa Cường',
    },
  });
  const pu3 = await prisma.user.create({
    data: {
      fullName: 'Hiep',
      email: 'hiep@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer3`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Kim Liên',
    },
  });
  const pu4 = await prisma.user.create({
    data: {
      fullName: 'Tan',
      email: 'tan@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer4`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Phường Bến Cát',
    },
  });
  const pu5 = await prisma.user.create({
    data: {
      fullName: 'Kien Nguyen',
      email: 'kiennguyen@photo.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer5`,
      province: 'Tỉnh Bình Dương',
      ward: 'Phường Chánh Nghĩa',
    },
  });
  const pu6 = await prisma.user.create({
    data: {
      fullName: 'Vu Han Hoang',
      email: 'han.vu.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer6`,
      province: 'Thành phố Hồ Chí Minh',
      ward: '"Xã Trừ Văn Thố',
    },
  });
  const pu7 = await prisma.user.create({
    data: {
      fullName: 'Duc Anh Nguyen',
      email: 'ducanh.nguyen.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer7`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường Cẩm Lệ',
    },
  });
  const pu8 = await prisma.user.create({
    data: {
      fullName: 'Khiem Tran',
      email: 'khiem.tran.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer8`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Phú Thượng',
    },
  });
  const pu9 = await prisma.user.create({
    data: {
      fullName: 'Tien Le',
      email: 'tien.le.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer9`,
      province: 'Tỉnh Đồng Nai',
      ward: 'Phường Đồng Xoài',
    },
  });
  const pu10 = await prisma.user.create({
    data: {
      fullName: 'Kim Ngoc Pham',
      email: 'kimngoc.pham.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer10`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Xã Bàu Bàng',
    },
  });
  const pu11 = await prisma.user.create({
    data: {
      fullName: 'Tay Ha Hoang',
      email: 'tayha.hoang.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer11`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường Liên Chiểu',
    },
  });
  const pu12 = await prisma.user.create({
    data: {
      fullName: 'Thanh Liem Vu',
      email: 'thanhliem.vu.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer12`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Hồng Hà',
    },
  });
  const pu13 = await prisma.user.create({
    data: {
      fullName: 'Chien Le Dang',
      email: 'chienle.dang.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer13`,
      province: 'Tỉnh Khánh Hòa',
      ward: 'Phường Bắc Nha Trang',
    },
  });
  const pu14 = await prisma.user.create({
    data: {
      fullName: 'Nguyen Nguyen',
      email: 'nguyen.nguyen.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer14`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Phường Chánh Phú Hòa',
    },
  });
  const pu15 = await prisma.user.create({
    data: {
      fullName: 'On Ha Tran',
      email: 'onha.tran.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer15`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Tây Hồ',
    },
  });
  const pu16 = await prisma.user.create({
    data: {
      fullName: 'Minh Quang Le',
      email: 'minhquang.le.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer16`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường Sơn Trà',
    },
  });
  const pu17 = await prisma.user.create({
    data: {
      fullName: 'Thi Hoa Pham',
      email: 'thihoa.pham.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer17`,
      province: 'Tỉnh Khánh Hòa',
      ward: 'Phường Nha Trang',
    },
  });
  const pu18 = await prisma.user.create({
    data: {
      fullName: 'Van Dung Hoang',
      email: 'vandung.hoang.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer18`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Phường Long Nguyên',
    },
  });
  const pu19 = await prisma.user.create({
    data: {
      fullName: 'Thi Lan Vu',
      email: 'thilan.vu.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer19`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Bồ Đề',
    },
  });
  const pu20 = await prisma.user.create({
    data: {
      fullName: 'Minh Hai Tran',
      email: 'minhhai.tran.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer20`,
      province: 'Tỉnh Khánh Hòa',
      ward: 'Phường Nha Trang',
    },
  });
  const pu21 = await prisma.user.create({
    data: {
      fullName: 'Thi Minh Le',
      email: 'thiminh.le.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer21`,
      province: 'Thành phố Cần Thơ',
      ward: 'Phường Ninh Kiều',
    },
  });
  const pu22 = await prisma.user.create({
    data: {
      fullName: 'Van Long Pham',
      email: 'vanlong.pham.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer22`,
      province: 'Tỉnh Đồng Nai',
      ward: 'Phường Đồng Xoài',
    },
  });
  const pu23 = await prisma.user.create({
    data: {
      fullName: 'Thi Ngoc Hoang',
      email: 'thingoc.hoang.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer23`,
      province: 'Thành phố Hải Phòng',
      ward: 'Phường Hải Dương',
    },
  });
  const pu24 = await prisma.user.create({
    data: {
      fullName: 'Minh Tuan Vu',
      email: 'minhtuan.vu.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer24`,
      province: 'Thành phố Hải Phòng',
      ward: 'Phường Thành Đông',
    },
  });
  const pu25 = await prisma.user.create({
    data: {
      fullName: 'Thi Huong Dang',
      email: 'thihuong.dang.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer25`,
      province: 'Thành phố Hồ Chí Minh',
      ward: 'Phường Tây Nam',
    },
  });
  const pu26 = await prisma.user.create({
    data: {
      fullName: 'Van Khanh Tran',
      email: 'vankhanh.tran.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer26`,
      province: 'Tỉnh Thanh Hóa',
      ward: 'Phường Hạc Thành',
    },
  });
  const pu27 = await prisma.user.create({
    data: {
      fullName: 'Thi Phuong Le',
      email: 'thiphuong.le.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer27`,
      province: 'Thành phố Đà Nẵng',
      ward: 'Phường An Hải',
    },
  });
  const pu28 = await prisma.user.create({
    data: {
      fullName: 'Minh Son Pham',
      email: 'minhson.pham.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer28`,
      province: 'Tỉnh Thanh Hóa',
      ward: 'Phường Hạc Thành',
    },
  });
  const pu29 = await prisma.user.create({
    data: {
      fullName: 'Thi Van Hoang',
      email: 'thivan.hoang.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer29`,
      province: 'Thành phố Hà Nội',
      ward: 'Phường Việt Hưng',
    },
  });
  const pu30 = await prisma.user.create({
    data: {
      fullName: 'Van Thang Vu',
      email: 'vanthang.vu.photo@gmail.com',
      password,
      role: UserRole.PHOTOGRAPHER,
      avatarUrl: `${baseUrl}/photographer30`,
      province: 'Tỉnh Khánh Hòa',
      ward: 'Phường Nha Trang',
    },
  });

  const p1 = await prisma.photographer.create({
    data: {
      userId: pu1.id,
      bio: 'Expert in wedding photography with natural light',
      experienceYears: 10,
      isVerified: true,
      ratingAvg: 4.8,
    },
  });
  const p2 = await prisma.photographer.create({
    data: {
      userId: pu2.id,
      bio: 'Portrait specialist with studio lighting expertise',
      experienceYears: 5,
      isVerified: true,
      ratingAvg: 4.5,
    },
  });
  const p3 = await prisma.photographer.create({
    data: {
      userId: pu3.id,
      bio: 'Street photography enthusiast capturing urban life',
      experienceYears: 3,
      isVerified: false,
      ratingAvg: 4.2,
    },
  });
  const p4 = await prisma.photographer.create({
    data: {
      userId: pu4.id,
      bio: 'Fashion photographer for magazines and brands',
      experienceYears: 7,
      isVerified: true,
      ratingAvg: 4.7,
    },
  });
  const p5 = await prisma.photographer.create({
    data: {
      userId: pu5.id,
      bio: 'Nature landscapes and wildlife specialist',
      experienceYears: 4,
      isVerified: false,
      ratingAvg: 4.3,
    },
  });
  const p6 = await prisma.photographer.create({
    data: {
      userId: pu6.id,
      bio: 'Commercial product shots for e-commerce',
      experienceYears: 12,
      isVerified: true,
      ratingAvg: 4.9,
    },
  });
  const p7 = await prisma.photographer.create({
    data: {
      userId: pu7.id,
      bio: 'Event photographer for corporate and parties',
      experienceYears: 6,
      isVerified: true,
      ratingAvg: 4.6,
    },
  });
  const p8 = await prisma.photographer.create({
    data: {
      userId: pu8.id,
      bio: 'Family and kids portrait sessions',
      experienceYears: 2,
      isVerified: false,
      ratingAvg: 4.1,
    },
  });
  const p9 = await prisma.photographer.create({
    data: {
      userId: pu9.id,
      bio: 'Sports action photography for events',
      experienceYears: 8,
      isVerified: true,
      ratingAvg: 4.4,
    },
  });
  const p10 = await prisma.photographer.create({
    data: {
      userId: pu10.id,
      bio: 'Architecture and real estate photographer',
      experienceYears: 15,
      isVerified: true,
      ratingAvg: 4.9,
    },
  });
  const p11 = await prisma.photographer.create({
    data: {
      userId: pu11.id,
      bio: 'Black and white fine art photography',
      experienceYears: 5,
      isVerified: false,
      ratingAvg: 4.2,
    },
  });
  const p12 = await prisma.photographer.create({
    data: {
      userId: pu12.id,
      bio: 'Travel content creator and blogger',
      experienceYears: 3,
      isVerified: true,
      ratingAvg: 4.5,
    },
  });
  const p13 = await prisma.photographer.create({
    data: {
      userId: pu13.id,
      bio: 'High fashion studio shoots',
      experienceYears: 9,
      isVerified: true,
      ratingAvg: 4.7,
    },
  });
  const p14 = await prisma.photographer.create({
    data: {
      userId: pu14.id,
      bio: 'Pet portraits and animal photography',
      experienceYears: 4,
      isVerified: false,
      ratingAvg: 4.3,
    },
  });
  const p15 = await prisma.photographer.create({
    data: {
      userId: pu15.id,
      bio: 'Cinematic lifestyle and couple sessions',
      experienceYears: 6,
      isVerified: true,
      ratingAvg: 4.6,
    },
  });
  const p16 = await prisma.photographer.create({
    data: {
      userId: pu16.id,
      bio: 'Drone aerial photography for landscapes',
      experienceYears: 7,
      isVerified: true,
      ratingAvg: 4.8,
    },
  });
  const p17 = await prisma.photographer.create({
    data: {
      userId: pu17.id,
      bio: 'Food styling and restaurant menus',
      experienceYears: 5,
      isVerified: false,
      ratingAvg: 4.4,
    },
  });
  const p18 = await prisma.photographer.create({
    data: {
      userId: pu18.id,
      bio: 'Wedding pre-wedding romantic shoots',
      experienceYears: 11,
      isVerified: true,
      ratingAvg: 4.9,
    },
  });
  const p19 = await prisma.photographer.create({
    data: {
      userId: pu19.id,
      bio: 'Newborn and maternity gentle sessions',
      experienceYears: 4,
      isVerified: true,
      ratingAvg: 4.5,
    },
  });
  const p20 = await prisma.photographer.create({
    data: {
      userId: pu20.id,
      bio: 'Automotive car photography for ads',
      experienceYears: 8,
      isVerified: false,
      ratingAvg: 4.6,
    },
  });
  const p21 = await prisma.photographer.create({
    data: {
      userId: pu21.id,
      bio: 'Macro close-up nature details',
      experienceYears: 6,
      isVerified: true,
      ratingAvg: 4.7,
    },
  });
  const p22 = await prisma.photographer.create({
    data: {
      userId: pu22.id,
      bio: 'Night sky astrophotography',
      experienceYears: 9,
      isVerified: true,
      ratingAvg: 4.8,
    },
  });
  const p23 = await prisma.photographer.create({
    data: {
      userId: pu23.id,
      bio: 'Concert and music event coverage',
      experienceYears: 5,
      isVerified: false,
      ratingAvg: 4.4,
    },
  });
  const p24 = await prisma.photographer.create({
    data: {
      userId: pu24.id,
      bio: 'Boudoir empowering women portraits',
      experienceYears: 7,
      isVerified: true,
      ratingAvg: 4.6,
    },
  });
  const p25 = await prisma.photographer.create({
    data: {
      userId: pu25.id,
      bio: 'Cultural festival documentary',
      experienceYears: 10,
      isVerified: true,
      ratingAvg: 4.9,
    },
  });
  const p26 = await prisma.photographer.create({
    data: {
      userId: pu26.id,
      bio: 'Surreal conceptual art photography',
      experienceYears: 3,
      isVerified: false,
      ratingAvg: 4.2,
    },
  });
  const p27 = await prisma.photographer.create({
    data: {
      userId: pu27.id,
      bio: 'Vintage film style emulation',
      experienceYears: 4,
      isVerified: true,
      ratingAvg: 4.5,
    },
  });
  const p28 = await prisma.photographer.create({
    data: {
      userId: pu28.id,
      bio: 'Underwater ocean life shots',
      experienceYears: 12,
      isVerified: true,
      ratingAvg: 4.8,
    },
  });
  const p29 = await prisma.photographer.create({
    data: {
      userId: pu29.id,
      bio: 'Children playful lifestyle sessions',
      experienceYears: 6,
      isVerified: false,
      ratingAvg: 4.3,
    },
  });
  const p30 = await prisma.photographer.create({
    data: {
      userId: pu30.id,
      bio: 'Corporate headshots and branding',
      experienceYears: 8,
      isVerified: true,
      ratingAvg: 4.7,
    },
  });

  console.log('--- Seeding 30 Categories ---');
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
  const cat16 = await prisma.category.create({
    data: { name: 'Aerial', thumbnailUrl: `${baseUrl}/aerial` },
  });
  const cat17 = await prisma.category.create({
    data: { name: 'Underwater', thumbnailUrl: `${baseUrl}/underwater` },
  });
  const cat18 = await prisma.category.create({
    data: { name: 'Fine Art', thumbnailUrl: `${baseUrl}/fine-art` },
  });
  const cat19 = await prisma.category.create({
    data: { name: 'Lifestyle', thumbnailUrl: `${baseUrl}/lifestyle` },
  });
  const cat20 = await prisma.category.create({
    data: { name: 'Newborn', thumbnailUrl: `${baseUrl}/newborn` },
  });
  const cat21 = await prisma.category.create({
    data: { name: 'Maternity', thumbnailUrl: `${baseUrl}/maternity` },
  });
  const cat22 = await prisma.category.create({
    data: { name: 'Pet', thumbnailUrl: `${baseUrl}/pet` },
  });
  const cat23 = await prisma.category.create({
    data: { name: 'Corporate', thumbnailUrl: `${baseUrl}/corporate` },
  });
  const cat24 = await prisma.category.create({
    data: { name: 'Documentary', thumbnailUrl: `${baseUrl}/documentary` },
  });
  const cat25 = await prisma.category.create({
    data: { name: 'Boudoir', thumbnailUrl: `${baseUrl}/boudoir` },
  });
  const cat26 = await prisma.category.create({
    data: { name: 'Concert', thumbnailUrl: `${baseUrl}/concert` },
  });
  const cat27 = await prisma.category.create({
    data: { name: 'Festival', thumbnailUrl: `${baseUrl}/festival` },
  });
  const cat28 = await prisma.category.create({
    data: { name: 'Surreal', thumbnailUrl: `${baseUrl}/surreal` },
  });
  const cat29 = await prisma.category.create({
    data: { name: 'Vintage', thumbnailUrl: `${baseUrl}/vintage` },
  });
  const cat30 = await prisma.category.create({
    data: { name: 'Event', thumbnailUrl: `${baseUrl}/event` },
  });

  console.log('--- Seeding 30 Concepts & Locations ---');
  const con1 = await prisma.concept.create({
    data: {
      name: 'Royal Wedding Elegance',
      description: 'A grand and luxurious wedding photography package featuring high-end settings and professional lighting to capture your most significant life moments.',
      photographerId: p1.userId,
      categoryId: cat1.id,
      thumbnailUrl: `${baseUrl}/con1`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 15000000,
            estimatedDuration: 240,
            description: '4 hours, 1 location',
            locations: {
              create: [
                {
                  province: 'Thành phố Hồ Chí Minh',
                  ward: 'Phường Thủ Đầu Một',
                },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 45000000,
            estimatedDuration: 720,
            description: 'Full day, 3 locations',
            locations: {
              create: [
                {
                  province: 'Thành phố Hồ Chí Minh',
                  ward: 'Phường Thủ Đầu Một',
                },
                { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Bình Dương' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Thủ Đầu Một' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Bình Dương' },
        ],
      },
    },
  });

  const con2 = await prisma.concept.create({
    data: {
      name: 'Cyberpunk Urban Night',
      description: 'Capture the futuristic neon glow of the city at night. Perfect for edgy portraits with vibrant colors and high-contrast urban backgrounds.',
      photographerId: p2.userId,
      categoryId: cat15.id,
      thumbnailUrl: `${baseUrl}/con2`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 3000000,
            estimatedDuration: 90,
            description: 'Night shoot, 1 costume',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Phường Phúc Lợi' },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 6500000,
            estimatedDuration: 180,
            description: 'Night shoot, 3 costumes, props',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Phường Ba Đình' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hà Nội', ward: 'Phường Phúc Lợi' },
          { province: 'Thành phố Hà Nội', ward: 'Phường Ba Đình' },
        ],
      },
    },
  });

  const con3 = await prisma.concept.create({
    data: {
      name: 'Minimalist Portrait Session',
      description: 'Clean, simple, and timeless portraits focusing on the subject’s personality with professional studio lighting and neutral backgrounds.',
      photographerId: p3.userId,
      categoryId: cat2.id,
      thumbnailUrl: `${baseUrl}/con3`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 1500000,
            estimatedDuration: 60,
            description: 'Standard studio headshot',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường Hải Vân' },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 3500000,
            estimatedDuration: 120,
            description: 'Creative portrait with makeup',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường Hải Châu' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Đà Nẵng', ward: 'Phường Hải Vân' },
          { province: 'Thành phố Đà Nẵng', ward: 'Phường Hải Châu' },
        ],
      },
    },
  });

  const con4 = await prisma.concept.create({
    data: {
      name: 'High Fashion Runway',
      description: 'Professional high-fashion shoot inspired by international runways. Includes creative directing and high-end editorial editing style.',
      photographerId: p4.userId,
      categoryId: cat4.id,
      thumbnailUrl: `${baseUrl}/con4`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 8000000,
            estimatedDuration: 180,
            description: 'Studio editorial',
            locations: {
              create: [
                { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 18000000,
            estimatedDuration: 300,
            description: 'Outdoor luxury location',
            locations: {
              create: [
                { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú An' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú An' },
        ],
      },
    },
  });

  const con5 = await prisma.concept.create({
    data: {
      name: 'Wild Nature Exploration',
      description: 'Explore the beauty of the outdoors with this adventure-themed package. Ideal for hiking, camping, and mountain-view photography.',
      photographerId: p5.userId,
      categoryId: cat12.id,
      thumbnailUrl: `${baseUrl}/con5`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 2500000,
            estimatedDuration: 120,
            description: 'Trekking path shoot',
            locations: {
              create: [{ province: 'Tỉnh Lâm Đồng', ward: 'Phường Phú Thuỷ' }],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 5500000,
            estimatedDuration: 240,
            description: 'Peak mountain sunset shoot',
            locations: {
              create: [{ province: 'Tỉnh Lâm Đồng', ward: 'Phường Phan Thiết' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Tỉnh Lâm Đồng', ward: 'Phường Phú Thuỷ' },
          { province: 'Tỉnh Lâm Đồng', ward: 'Phường Phan Thiết' },
        ],
      },
    },
  });

  const con6 = await prisma.concept.create({
    data: {
      name: 'Modern Architecture Views',
      description: 'Highlighting the synergy between humans and urban design. This concept focuses on clean lines and modern skyscraper backdrops.',
      photographerId: p10.userId,
      categoryId: cat6.id,
      thumbnailUrl: `${baseUrl}/con6`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 6000000,
            estimatedDuration: 120,
            description: 'Downtown skyscrapers',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Phường Long Biên' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 12000000,
            estimatedDuration: 240,
            description: 'Private luxury building access',
            locations: {
              create: [{ province: 'Thành phố Hà Nội', ward: 'Phường Tây Hồ' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hà Nội', ward: 'Phường Long Biên' },
          { province: 'Thành phố Hà Nội', ward: 'Phường Tây Hồ' },
        ],
      },
    },
  });

  const con7 = await prisma.concept.create({
    data: {
      name: 'Family Outdoor Picnic',
      description: 'Capture heartwarming family bonding moments during a picnic. Natural, candid, and full of joy in a beautiful park setting.',
      photographerId: p8.userId,
      categoryId: cat7.id,
      thumbnailUrl: `${baseUrl}/con7`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 1800000,
            estimatedDuration: 90,
            description: 'Public park setting',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường An Hải' },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 4000000,
            estimatedDuration: 150,
            description: 'Private resort garden',
            locations: {
              create: [{ province: 'Thành phố Đà Nẵng', ward: 'Phường Hải Châu' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Đà Nẵng', ward: 'Phường An Hải' },
          { province: 'Thành phố Đà Nẵng', ward: 'Phường Hải Châu' },
        ],
      },
    },
  });
  const con8 = await prisma.concept.create({
    data: {
      name: 'Sports Stadium Action',
      description: 'Dynamic sports photography capturing high-energy movement and athletic achievement at professional stadium locations.',
      photographerId: p9.userId,
      categoryId: cat8.id,
      thumbnailUrl: `${baseUrl}/con8`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 5000000,
            estimatedDuration: 120,
            description: 'Gym/Stadium shoot',
            locations: {
              create: [
                { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 9500000,
            estimatedDuration: 180,
            description: 'Professional action coverage',
            locations: {
              create: [{ province: 'Thành phố Hồ Chí Minh', ward: 'Xã Minh Thạnh' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Xã Minh Thạnh' },
        ],
      },
    },
  });

  const con9 = await prisma.concept.create({
    data: {
      name: 'Ethereal Forest Art',
      description: 'Whimsical and magical photography deep in the forest. Includes smoke effects and props to create a fairy-tale atmosphere.',
      photographerId: p11.userId,
      categoryId: cat9.id,
      thumbnailUrl: `${baseUrl}/con9`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 7500000,
            estimatedDuration: 180,
            description: 'Forest shoot with smoke props',
            locations: {
              create: [{ province: 'Thành phố Hồ Chí Minh', ward: 'Xã Long Hòa' }],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 14000000,
            estimatedDuration: 300,
            description: 'Full conceptual fairy tale theme',
            locations: {
              create: [{ province: 'Thành phố Hồ Chí Minh', ward: 'Xã Thanh An' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Xã Long Hòa' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Xã Thanh An' },
        ],
      },
    },
  });

  const con10 = await prisma.concept.create({
    data: {
      name: 'Gourmet Food Textures',
      description: 'High-end food styling and photography for menus and social media, focusing on appetizing textures and vibrant colors.',
      photographerId: p6.userId,
      categoryId: cat10.id,
      thumbnailUrl: `${baseUrl}/con10`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 3500000,
            estimatedDuration: 120,
            description: '5 dishes, studio',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Phường Ba Đình' },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 8000000,
            estimatedDuration: 240,
            description: 'Full menu, on-site restaurant',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Phường Hoàn Kiếm' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hà Nội', ward: 'Phường Ba Đình' },
          { province: 'Thành phố Hà Nội', ward: 'Phường Hoàn Kiếm' },
        ],
      },
    },
  });

  const con11 = await prisma.concept.create({
    data: {
      name: 'Lost City Travel',
      description: 'An exploratory travel concept at ancient ruins and historical sites. Capturing the sense of wonder and history.',
      photographerId: p12.userId,
      categoryId: cat11.id,
      thumbnailUrl: `${baseUrl}/con11`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 2000000,
            estimatedDuration: 120,
            description: 'Temple ruins shoot',
            locations: {
              create: [
                { province: 'Tỉnh Khánh Hòa', ward: 'Phường Bắc Nha Trang' },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 4500000,
            estimatedDuration: 240,
            description: 'Island & ruins adventure',
            locations: {
              create: [{ province: 'Tỉnh Khánh Hòa', ward: 'Xã Khánh Vĩnh' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Tỉnh Khánh Hòa', ward: 'Phường Bắc Nha Trang' },
          { province: 'Tỉnh Khánh Hòa', ward: 'Xã Khánh Vĩnh' },
        ],
      },
    },
  });

  const con12 = await prisma.concept.create({
    data: {
      name: 'K-Pop Style Studio',
      description: 'Transform into an idol with Korean-inspired makeup and photography. High-energy, colorful, and trendy studio vibes.',
      photographerId: p13.userId,
      categoryId: cat4.id,
      thumbnailUrl: `${baseUrl}/con12`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 5500000,
            estimatedDuration: 180,
            description: '1 outfit, idol makeup',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường An Hải' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 12000000,
            estimatedDuration: 300,
            description: '3 outfits, music video style',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường Thanh Khê' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Đà Nẵng', ward: 'Phường An Hải' },
          { province: 'Thành phố Đà Nẵng', ward: 'Phường Thanh Khê' },
        ],
      },
    },
  });

  const con13 = await prisma.concept.create({
    data: {
      name: 'Tiny Macro Worlds',
      description: 'Discover the hidden beauty of the microscopic world.',
      photographerId: p14.userId,
      categoryId: cat13.id,
      thumbnailUrl: `${baseUrl}/con13`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 1200000,
            estimatedDuration: 60,
            description: 'Nature macro shoot',
            locations: {
              create: [
                { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 2800000,
            estimatedDuration: 120,
            description: 'Jewelry/Product macro',
            locations: {
              create: [{ province: 'Thành phố Hồ Chí Minh', ward: 'Phường Chánh Hiệp' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Chánh Hiệp' },
        ],
      },
    },
  });

  const con14 = await prisma.concept.create({
    data: {
      name: 'Supercar Sunset Drive',
      description: 'Luxury automotive photography alongside exotic supercars during the golden hour for a sophisticated look.',
      photographerId: p15.userId,
      categoryId: cat14.id,
      thumbnailUrl: `${baseUrl}/con14`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 7000000,
            estimatedDuration: 120,
            description: 'Static shots, sunset',
            locations: {
              create: [
                { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 15000000,
            estimatedDuration: 240,
            description: 'Rolling shots, night drive',
            locations: {
              create: [
                {
                  province: 'Thành phố Hồ Chí Minh',
                  ward: 'Phường Bến Cát',
                },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Bến Cát' },
        ],
      },
    },
  });

  const con15 = await prisma.concept.create({
    data: {
      name: 'Vintage City Streets',
      description: 'Nostalgic and emotional street photography with a film-like aesthetic, capturing the heartbeat of the old city.',
      photographerId: p1.userId,
      categoryId: cat3.id,
      thumbnailUrl: `${baseUrl}/con15`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 2200000,
            estimatedDuration: 90,
            description: '35mm Film style',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Phường Ô Chợ Dừa' },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 4800000,
            estimatedDuration: 150,
            description: 'Old Quarter exploration',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Xã Yên Xuân' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hà Nội', ward: 'Phường Ô Chợ Dừa' },
          { province: 'Thành phố Hà Nội', ward: 'Xã Yên Xuân' },
        ],
      },
    },
  });

  const con16 = await prisma.concept.create({
    data: {
      name: 'Drone Aerial Views',
      description: 'Stunning 4K drone photography providing a bird’s-eye perspective of landscapes, events, or luxury properties.',
      photographerId: p16.userId,
      categoryId: cat16.id,
      thumbnailUrl: `${baseUrl}/con16`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 5000000,
            estimatedDuration: 60,
            description: 'Landscape photos',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường Sơn Trà' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 11000000,
            estimatedDuration: 120,
            description: 'Commercial video & photo',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường Hòa Cường' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Đà Nẵng', ward: 'Phường Sơn Trà' },
          { province: 'Thành phố Đà Nẵng', ward: 'Phường Hòa Cường' },
        ],
      },
    },
  });
  const con17 = await prisma.concept.create({
    data: {
      name: 'Food Styling Workshop',
      description: 'Learn and capture the art of food arrangement. This interactive shoot focuses on storytelling through cuisine.',
      photographerId: p17.userId,
      categoryId: cat10.id,
      thumbnailUrl: `${baseUrl}/con17`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 1500000,
            estimatedDuration: 120,
            description: 'Styling basics',
            locations: {
              create: [
                {
                  province: 'Thành phố Hồ Chí Minh',
                  ward: 'Phường Bình Dương',
                },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 3800000,
            estimatedDuration: 240,
            description: 'Pro lighting & styling',
            locations: {
              create: [
                { province: 'Thành phố Hồ Chí Minh', ward: 'Xã Trừ Văn Thố' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Bình Dương' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Xã Trừ Văn Thố' },
        ],
      },
    },
  });

  const con18 = await prisma.concept.create({
    data: {
      name: 'Pre-Wedding Romance',
      description: 'A gentle and poetic pre-wedding concept at a serene hill location. Focused on natural light and couple intimacy.',
      photographerId: p18.userId,
      categoryId: cat1.id,
      thumbnailUrl: `${baseUrl}/con18`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 12000000,
            estimatedDuration: 300,
            description: 'Half day, local hills',
            locations: {
              create: [{ province: 'Tỉnh Lâm Đồng', ward: 'Phường Phú Thuỷ' }],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 28000000,
            estimatedDuration: 600,
            description: 'Full day, remote resort',
            locations: {
              create: [{ province: 'Tỉnh Lâm Đồng', ward: 'Phường Hàm Thắng' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Tỉnh Lâm Đồng', ward: 'Phường Phú Thuỷ' },
          { province: 'Tỉnh Lâm Đồng', ward: 'Phường Hàm Thắng' },
        ],
      },
    },
  });
  const con19 = await prisma.concept.create({
    data: {
      name: 'Newborn Gentle Poses',
      description: 'Safely and patiently capturing the first days of a baby’s life with soft textures and peaceful studio setups.',
      photographerId: p19.userId,
      categoryId: cat20.id,
      thumbnailUrl: `${baseUrl}/con19`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 3000000,
            estimatedDuration: 180,
            description: 'Home visit shoot',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Phường Hồng Hà' },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 6500000,
            estimatedDuration: 300,
            description: 'Full studio setup at home',
            locations: {
              create: [{ province: 'Thành phố Hà Nội', ward: 'Phường Tây Hồ' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hà Nội', ward: 'Phường Hồng Hà' },
          { province: 'Thành phố Hà Nội', ward: 'Phường Tây Hồ' },
        ],
      },
    },
  });

  const con20 = await prisma.concept.create({
    data: {
      name: 'Car Culture Showcase',
      description: 'For the ultimate car enthusiast. Detailed shots of engine modifications, interior craftsmanship, and exterior styling.',
      photographerId: p20.userId,
      categoryId: cat14.id,
      thumbnailUrl: `${baseUrl}/con20`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 2500000,
            estimatedDuration: 90,
            description: 'Detail shots only',
            locations: {
              create: [
                {
                  province: 'Thành phố Hồ Chí Minh',
                  ward: 'Phường Bình Dương',
                },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 5500000,
            estimatedDuration: 180,
            description: 'Showcase & action',
            locations: {
              create: [
                { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú An' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Bình Dương' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú An' },
        ],
      },
    },
  });

  const con21 = await prisma.concept.create({
    data: {
      name: 'Macro Flower Details',
      description: 'Intricate floral photography exploring the fine details of petals and dewdrops. Vibrant, natural, and artistic.',
      photographerId: p21.userId,
      categoryId: cat13.id,
      thumbnailUrl: `${baseUrl}/con21`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 1500000,
            estimatedDuration: 60,
            description: 'Home garden shoot',
            locations: {
              create: [{ province: 'Tỉnh Đồng Nai', ward: 'Phường Đồng Xoài' }],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 3200000,
            estimatedDuration: 120,
            description: 'Botanical garden session',
            locations: {
              create: [{ province: 'Tỉnh Đồng Nai', ward: 'Phường Biên Hòa' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Tỉnh Đồng Nai', ward: 'Phường Đồng Xoài' },
          { province: 'Tỉnh Đồng Nai', ward: 'Phường Biên Hòa' },
        ],
      },
    },
  });

  const con22 = await prisma.concept.create({
    data: {
      name: 'Night Sky Stars',
      description: 'Astro-photography capturing the Milky Way and constellations. Specialized long-exposure equipment included.',
      photographerId: p22.userId,
      categoryId: cat15.id,
      thumbnailUrl: `${baseUrl}/con22`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 6500000,
            estimatedDuration: 240,
            description: 'Single exposure stars',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường Cẩm Lệ' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 13000000,
            estimatedDuration: 480,
            description: 'Deep sky & tracking',
            locations: {
              create: [{ province: 'Thành phố Đà Nẵng', ward: 'Phường An Khê' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Đà Nẵng', ward: 'Phường Cẩm Lệ' },
          { province: 'Thành phố Đà Nẵng', ward: 'Phường An Khê' },
        ],
      },
    },
  });

  const con23 = await prisma.concept.create({
    data: {
      name: 'Concert Live Energy',
      description: 'High-speed photography capturing the thrill of a live music performance. Specialized for low-light stage lighting.',
      photographerId: p23.userId,
      categoryId: cat26.id,
      thumbnailUrl: `${baseUrl}/con23`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 4500000,
            estimatedDuration: 120,
            description: 'Club gig coverage',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Phường Phú Thượng' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 12000000,
            estimatedDuration: 300,
            description: 'Festival stage coverage',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Phường Thanh Liệt' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hà Nội', ward: 'Phường Phú Thượng' },
          { province: 'Thành phố Hà Nội', ward: 'Phường Thanh Liệt' },
        ],
      },
    },
  });

  const con24 = await prisma.concept.create({
    data: {
      name: 'Boudoir Confidence Boost',
      description: 'A discreet and empowering session designed to celebrate physical beauty and self-confidence in a private setting.',
      photographerId: p24.userId,
      categoryId: cat25.id,
      thumbnailUrl: `${baseUrl}/con24`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 5000000,
            estimatedDuration: 120,
            description: 'Basic studio setup',
            locations: {
              create: [
                { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú An' },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 9500000,
            estimatedDuration: 180,
            description: 'Luxury hotel session',
            locations: {
              create: [{ province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú An' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Phú Lợi' },
        ],
      },
    },
  });

  const con25 = await prisma.concept.create({
    data: {
      name: 'Festival Cultural Vibes',
      description: 'Documenting the vibrant energy and cultural traditions of regional festivals with colorful and high-action shots.',
      photographerId: p25.userId,
      categoryId: cat27.id,
      thumbnailUrl: `${baseUrl}/con25`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 4000000,
            estimatedDuration: 180,
            description: 'Street parade coverage',
            locations: {
              create: [{ province: 'Tỉnh Quảng Ninh', ward: 'Phường Hà Tu' }],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 10000000,
            estimatedDuration: 480,
            description: 'Full cultural documentary',
            locations: {
              create: [
                { province: 'Tỉnh Quảng Ninh', ward: 'Phường Bãi Cháy' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Tỉnh Quảng Ninh', ward: 'Phường Hà Tu' },
          { province: 'Tỉnh Quảng Ninh', ward: 'Phường Bãi Cháy' },
        ],
      },
    },
  });

  const con26 = await prisma.concept.create({
    data: {
      name: 'Surreal Dream Scenes',
      description: 'Creative and imaginative photography utilizing post-production to blend reality with dreamy, surreal elements.',
      photographerId: p26.userId,
      categoryId: cat28.id,
      thumbnailUrl: `${baseUrl}/con26`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 8500000,
            estimatedDuration: 240,
            description: 'Simple composite',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường Hải Châu' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 20000000,
            estimatedDuration: 480,
            description: 'Advanced photomanipulation',
            locations: {
              create: [
                { province: 'Thành phố Đà Nẵng', ward: 'Phường Sơn Trà' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Đà Nẵng', ward: 'Phường Hải Châu' },
          { province: 'Thành phố Đà Nẵng', ward: 'Phường Sơn Trà' },
        ],
      },
    },
  });

  const con27 = await prisma.concept.create({
    data: {
      name: 'Vintage Retro Style',
      description: 'Bringing back the 90s aesthetic with retro props and color grading. Fun, nostalgic, and full of personality.',
      photographerId: p27.userId,
      categoryId: cat29.id,
      thumbnailUrl: `${baseUrl}/con27`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 1800000,
            estimatedDuration: 90,
            description: 'Classic 90s vibes',
            locations: {
              create: [
                {
                  province: 'Thành phố Hồ Chí Minh',
                  ward: 'Phường Chánh Hiệp',
                },
              ],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 3500000,
            estimatedDuration: 150,
            description: 'Themed retro set',
            locations: {
              create: [{ province: 'Thành phố Hồ Chí Minh', ward: 'Phường Chánh Phú Hòa' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Chánh Hiệp' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Chánh Phú Hòa' },
        ],
      },
    },
  });
  const con28 = await prisma.concept.create({
    data: {
      name: 'Underwater Ocean Adventure',
      description: 'A unique underwater session for the adventurous. Capturing ethereal and weightless shots in a beautiful oceanic setting.',
      photographerId: p28.userId,
      categoryId: cat17.id,
      thumbnailUrl: `${baseUrl}/con28`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 15000000,
            estimatedDuration: 180,
            description: 'Shallow reef session',
            locations: {
              create: [
                { province: 'Tỉnh Khánh Hòa', ward: 'Phường Bắc Nha Trang' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 35000000,
            estimatedDuration: 300,
            description: 'Deep ocean diving session',
            locations: {
              create: [{ province: 'Tỉnh Khánh Hòa', ward: 'Phường Bắc Cam Ranh' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Tỉnh Khánh Hòa', ward: 'Phường Bắc Nha Trang' },
          { province: 'Tỉnh Khánh Hòa', ward: 'Phường Bắc Cam Ranh' },
        ],
      },
    },
  });

  const con29 = await prisma.concept.create({
    data: {
      name: 'Children Playful Moments',
      description: 'Natural and candid shots of children playing. Capturing pure joy and innocence without forced posing.',
      photographerId: p29.userId,
      categoryId: cat7.id,
      thumbnailUrl: `${baseUrl}/con29`,
      packages: {
        create: [
          {
            tier: ConceptTier.BASIC,
            price: 2000000,
            estimatedDuration: 90,
            description: 'Candid backyard play',
            locations: {
              create: [{ province: 'Thành phố Hà Nội', ward: 'Xã Đại Thanh' }],
            },
          },
          {
            tier: ConceptTier.STANDARD,
            price: 4500000,
            estimatedDuration: 180,
            description: 'Professional studio fun set',
            locations: {
              create: [
                { province: 'Thành phố Hà Nội', ward: 'Xã Nam Phù' },
              ],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hà Nội', ward: 'Xã Đại Thanh' },
          { province: 'Thành phố Hà Nội', ward: 'Xã Nam Phù' },
        ],
      },
    },
  });

  const con30 = await prisma.concept.create({
    data: {
      name: 'Corporate Branding Shots',
      description: 'Professional imagery for business leaders and brands. High-quality portraits for press releases and websites.',
      photographerId: p30.userId,
      categoryId: cat23.id,
      thumbnailUrl: `${baseUrl}/con30`,
      packages: {
        create: [
          {
            tier: ConceptTier.STANDARD,
            price: 6000000,
            estimatedDuration: 120,
            description: 'Studio headshots',
            locations: {
              create: [
                { province: 'Thành phố Hồ Chí Minh', ward: 'Xã Dầu Tiếng' },
              ],
            },
          },
          {
            tier: ConceptTier.PREMIUM,
            price: 15000000,
            estimatedDuration: 300,
            description: 'On-site lifestyle branding',
            locations: {
              create: [{ province: 'Thành phố Hồ Chí Minh', ward: 'Phường Bình Dương' }],
            },
          },
        ],
      },
      locations: {
        create: [
          { province: 'Thành phố Hồ Chí Minh', ward: 'Xã Dầu Tiếng' },
          { province: 'Thành phố Hồ Chí Minh', ward: 'Phường Bình Dương' },
        ],
      },
    },
  });

  console.log('--- Seeding 30 Concept Photos ---');
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
  await prisma.conceptPhoto.create({
    data: { conceptId: con15.id, imageUrl: `${baseUrl}/vintage1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con16.id, imageUrl: `${baseUrl}/aerial1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con17.id, imageUrl: `${baseUrl}/food-styling1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con18.id, imageUrl: `${baseUrl}/pre-wedding1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con19.id, imageUrl: `${baseUrl}/newborn1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con20.id, imageUrl: `${baseUrl}/car-culture1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con21.id, imageUrl: `${baseUrl}/flower-macro1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con22.id, imageUrl: `${baseUrl}/night-sky1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con23.id, imageUrl: `${baseUrl}/concert1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con24.id, imageUrl: `${baseUrl}/boudoir1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con25.id, imageUrl: `${baseUrl}/festival1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con26.id, imageUrl: `${baseUrl}/surreal1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con27.id, imageUrl: `${baseUrl}/vintage-retro1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con28.id, imageUrl: `${baseUrl}/underwater1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con29.id, imageUrl: `${baseUrl}/children-play1` },
  });
  await prisma.conceptPhoto.create({
    data: { conceptId: con30.id, imageUrl: `${baseUrl}/corporate1` },
  });

  console.log('--- Seeding 30 Bookings ---');
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
      photographerId: p2.userId,
      conceptId: con2.id,
      bookingDate: new Date('2025-06-15'),
      status: BookingStatus.CONFIRMED,
      totalPrice: 800,
    },
  });
  const b3 = await prisma.booking.create({
    data: {
      clientId: c3.id,
      photographerId: p3.userId,
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

  console.log('--- Seeding 30 Reviews ---');
  await prisma.review.create({
    data: {
      bookingId: b1.id,
      rating: 5,
      comment: 'Perfect wedding photos, highly recommended!',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b3.id,
      rating: 4,
      comment: 'Great portrait work, very professional.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b7.id,
      rating: 5,
      comment: 'Captured family moments beautifully.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b12.id,
      rating: 5,
      comment: 'Amazing studio experience.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b2.id,
      rating: 4,
      comment: 'Stunning aerial views.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b5.id,
      rating: 3,
      comment: 'Good but could be better lighting.',
    },
  });
  await prisma.review.create({
    data: {
      bookingId: b8.id,
      rating: 5,
      comment: 'Vibrant festival captures.',
    },
  });

  console.log('--- Seeding 30 Schedules ---');
  await prisma.photographerSchedule.create({
    data: { photographerId: p1.userId, availableDate: new Date('2025-05-20') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p2.userId, availableDate: new Date('2025-06-15') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p3.userId, availableDate: new Date('2025-04-10') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p4.userId, availableDate: new Date('2025-09-01') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p5.userId, availableDate: new Date('2025-07-20') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p6.userId, availableDate: new Date('2025-10-10') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p7.userId, availableDate: new Date('2025-03-05') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p8.userId, availableDate: new Date('2025-08-15') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p9.userId, availableDate: new Date('2025-11-22') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p10.userId, availableDate: new Date('2025-12-05') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p11.userId, availableDate: new Date('2025-05-30') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p12.userId, availableDate: new Date('2025-01-15') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p13.userId, availableDate: new Date('2025-02-14') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p14.userId, availableDate: new Date('2025-04-20') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p15.userId, availableDate: new Date('2025-03-12') },
  });
  await prisma.photographerSchedule.create({
    data: { photographerId: p16.userId, availableDate: new Date('2025-06-25') },
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
